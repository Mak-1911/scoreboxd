import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { scorecards } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single scorecard fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { 
            error: "Valid ID is required",
            code: "INVALID_ID" 
          },
          { status: 400 }
        );
      }

      const scorecard = await db.select()
        .from(scorecards)
        .where(eq(scorecards.id, parseInt(id)))
        .limit(1);

      if (scorecard.length === 0) {
        return NextResponse.json(
          { 
            error: 'Scorecard not found',
            code: 'SCORECARD_NOT_FOUND'
          },
          { status: 404 }
        );
      }

      return NextResponse.json(scorecard[0], { status: 200 });
    }

    // List scorecards with filtering and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const eventId = searchParams.get('eventId');
    const sport = searchParams.get('sport');

    let query = db.select().from(scorecards);

    // Build WHERE conditions
    const conditions = [];
    
    if (eventId) {
      if (isNaN(parseInt(eventId))) {
        return NextResponse.json(
          { 
            error: "Valid eventId is required",
            code: "INVALID_EVENT_ID" 
          },
          { status: 400 }
        );
      }
      conditions.push(eq(scorecards.eventId, parseInt(eventId)));
    }

    if (sport) {
      conditions.push(eq(scorecards.sport, sport));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(scorecards.createdAt))
      .limit(limit)
      .offset(offset);

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
    const { eventId, sport, finalScore, additionalData } = body;

    // Validate required fields
    if (!eventId) {
      return NextResponse.json(
        { 
          error: "eventId is required",
          code: "MISSING_REQUIRED_FIELDS" 
        },
        { status: 400 }
      );
    }

    if (typeof eventId !== 'number' || isNaN(eventId)) {
      return NextResponse.json(
        { 
          error: "eventId must be a valid integer",
          code: "INVALID_EVENT_ID" 
        },
        { status: 400 }
      );
    }

    if (!sport || typeof sport !== 'string' || sport.trim() === '') {
      return NextResponse.json(
        { 
          error: "sport is required and must be a non-empty string",
          code: "MISSING_REQUIRED_FIELDS" 
        },
        { status: 400 }
      );
    }

    if (!finalScore || typeof finalScore !== 'string' || finalScore.trim() === '') {
      return NextResponse.json(
        { 
          error: "finalScore is required and must be a non-empty string",
          code: "MISSING_REQUIRED_FIELDS" 
        },
        { status: 400 }
      );
    }

    // Validate additionalData if provided
    if (additionalData !== undefined && additionalData !== null) {
      if (typeof additionalData !== 'object' || Array.isArray(additionalData)) {
        return NextResponse.json(
          { 
            error: "additionalData must be a valid JSON object",
            code: "INVALID_ADDITIONAL_DATA" 
          },
          { status: 400 }
        );
      }
    }

    // Sanitize inputs
    const sanitizedSport = sport.trim();
    const sanitizedFinalScore = finalScore.trim();

    // Create scorecard
    const newScorecard = await db.insert(scorecards)
      .values({
        eventId: eventId,
        sport: sanitizedSport,
        finalScore: sanitizedFinalScore,
        additionalData: additionalData || null,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newScorecard[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        },
        { status: 400 }
      );
    }

    // Check if scorecard exists
    const existingScorecard = await db.select()
      .from(scorecards)
      .where(eq(scorecards.id, parseInt(id)))
      .limit(1);

    if (existingScorecard.length === 0) {
      return NextResponse.json(
        { 
          error: 'Scorecard not found',
          code: 'SCORECARD_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { sport, finalScore, additionalData } = body;

    // Build update object with only provided fields
    const updates: any = {};

    if (sport !== undefined) {
      if (typeof sport !== 'string' || sport.trim() === '') {
        return NextResponse.json(
          { 
            error: "sport must be a non-empty string",
            code: "INVALID_SPORT" 
          },
          { status: 400 }
        );
      }
      updates.sport = sport.trim();
    }

    if (finalScore !== undefined) {
      if (typeof finalScore !== 'string' || finalScore.trim() === '') {
        return NextResponse.json(
          { 
            error: "finalScore must be a non-empty string",
            code: "INVALID_FINAL_SCORE" 
          },
          { status: 400 }
        );
      }
      updates.finalScore = finalScore.trim();
    }

    if (additionalData !== undefined) {
      if (additionalData !== null && (typeof additionalData !== 'object' || Array.isArray(additionalData))) {
        return NextResponse.json(
          { 
            error: "additionalData must be a valid JSON object or null",
            code: "INVALID_ADDITIONAL_DATA" 
          },
          { status: 400 }
        );
      }
      updates.additionalData = additionalData;
    }

    // Check if there are any updates to perform
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { 
          error: "No valid fields provided for update",
          code: "NO_UPDATES_PROVIDED" 
        },
        { status: 400 }
      );
    }

    // Perform update
    const updatedScorecard = await db.update(scorecards)
      .set(updates)
      .where(eq(scorecards.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedScorecard[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        },
        { status: 400 }
      );
    }

    // Check if scorecard exists before deleting
    const existingScorecard = await db.select()
      .from(scorecards)
      .where(eq(scorecards.id, parseInt(id)))
      .limit(1);

    if (existingScorecard.length === 0) {
      return NextResponse.json(
        { 
          error: 'Scorecard not found',
          code: 'SCORECARD_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Delete scorecard
    const deleted = await db.delete(scorecards)
      .where(eq(scorecards.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      { 
        message: 'Scorecard deleted successfully',
        scorecard: deleted[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}