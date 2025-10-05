import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { events } from '@/db/schema';
import { eq, like, or, desc, asc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const event = await db
        .select()
        .from(events)
        .where(eq(events.id, parseInt(id)))
        .limit(1);

      if (event.length === 0) {
        return NextResponse.json(
          { error: 'Event not found', code: 'EVENT_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(event[0], { status: 200 });
    }

    // List with pagination, search, filtering, and sorting
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const sportFilter = searchParams.get('sport');
    const sortField = searchParams.get('sort') || 'date';
    const sortOrder = searchParams.get('order') || 'desc';

    let query = db.select().from(events);

    // Build WHERE conditions
    const conditions = [];

    if (search) {
      const searchTerm = `%${search}%`;
      conditions.push(
        or(
          like(events.title, searchTerm),
          like(events.sport, searchTerm),
          like(events.league, searchTerm),
          like(events.homeTeam, searchTerm),
          like(events.awayTeam, searchTerm)
        )
      );
    }

    if (sportFilter) {
      conditions.push(eq(events.sport, sportFilter));
    }

    if (conditions.length > 0) {
      query = query.where(
        conditions.length === 1 ? conditions[0] : and(...conditions)
      );
    }

    // Apply sorting
    const sortColumn = sortField === 'date' ? events.date : events.createdAt;
    query = query.orderBy(
      sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn)
    );

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string', code: 'INVALID_TITLE' },
        { status: 400 }
      );
    }

    if (!body.sport || typeof body.sport !== 'string' || body.sport.trim() === '') {
      return NextResponse.json(
        { error: 'Sport is required and must be a non-empty string', code: 'INVALID_SPORT' },
        { status: 400 }
      );
    }

    if (!body.date || typeof body.date !== 'string' || body.date.trim() === '') {
      return NextResponse.json(
        { error: 'Date is required and must be a valid string', code: 'INVALID_DATE' },
        { status: 400 }
      );
    }

    // Validate date format (basic check)
    const dateValue = new Date(body.date);
    if (isNaN(dateValue.getTime())) {
      return NextResponse.json(
        { error: 'Date must be a valid date string', code: 'INVALID_DATE_FORMAT' },
        { status: 400 }
      );
    }

    // Sanitize and prepare data
    const eventData = {
      title: body.title.trim(),
      sport: body.sport.trim(),
      league: body.league ? body.league.trim() : null,
      date: body.date.trim(),
      location: body.location ? body.location.trim() : null,
      homeTeam: body.homeTeam ? body.homeTeam.trim() : null,
      awayTeam: body.awayTeam ? body.awayTeam.trim() : null,
      score: body.score ? body.score.trim() : null,
      imageUrl: body.imageUrl ? body.imageUrl.trim() : null,
      description: body.description ? body.description.trim() : null,
      createdAt: new Date().toISOString(),
    };

    const newEvent = await db.insert(events).values(eventData).returning();

    return NextResponse.json(newEvent[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}