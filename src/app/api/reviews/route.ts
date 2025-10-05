import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews } from '@/db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('userId');
    const eventId = searchParams.get('eventId');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let query = db.select().from(reviews);

    const conditions = [];
    
    if (userId) {
      const userIdInt = parseInt(userId);
      if (isNaN(userIdInt)) {
        return NextResponse.json({ 
          error: 'Valid userId is required',
          code: 'INVALID_USER_ID' 
        }, { status: 400 });
      }
      conditions.push(eq(reviews.userId, userIdInt));
    }

    if (eventId) {
      const eventIdInt = parseInt(eventId);
      if (isNaN(eventIdInt)) {
        return NextResponse.json({ 
          error: 'Valid eventId is required',
          code: 'INVALID_EVENT_ID' 
        }, { status: 400 });
      }
      conditions.push(eq(reviews.eventId, eventIdInt));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (sort === 'createdAt') {
      query = order === 'asc' 
        ? query.orderBy(asc(reviews.createdAt))
        : query.orderBy(desc(reviews.createdAt));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, eventId, rating, content, spoiler } = body;

    if (!userId) {
      return NextResponse.json({ 
        error: 'userId is required',
        code: 'MISSING_USER_ID' 
      }, { status: 400 });
    }

    if (!eventId) {
      return NextResponse.json({ 
        error: 'eventId is required',
        code: 'MISSING_EVENT_ID' 
      }, { status: 400 });
    }

    if (rating === undefined || rating === null) {
      return NextResponse.json({ 
        error: 'rating is required',
        code: 'MISSING_RATING' 
      }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ 
        error: 'content is required',
        code: 'MISSING_CONTENT' 
      }, { status: 400 });
    }

    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return NextResponse.json({ 
        error: 'Valid userId is required',
        code: 'INVALID_USER_ID' 
      }, { status: 400 });
    }

    const eventIdInt = parseInt(eventId);
    if (isNaN(eventIdInt)) {
      return NextResponse.json({ 
        error: 'Valid eventId is required',
        code: 'INVALID_EVENT_ID' 
      }, { status: 400 });
    }

    const ratingInt = parseInt(rating);
    if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
      return NextResponse.json({ 
        error: 'Rating must be between 1 and 5',
        code: 'INVALID_RATING' 
      }, { status: 400 });
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      return NextResponse.json({ 
        error: 'content cannot be empty',
        code: 'EMPTY_CONTENT' 
      }, { status: 400 });
    }

    const newReview = await db.insert(reviews)
      .values({
        userId: userIdInt,
        eventId: eventIdInt,
        rating: ratingInt,
        content: trimmedContent,
        spoiler: spoiler !== undefined ? spoiler : false,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newReview[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}