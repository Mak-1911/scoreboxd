import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { scorecards, playerStats } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const scorecardId = parseInt(id);

    // Fetch scorecard
    const scorecardResult = await db.select()
      .from(scorecards)
      .where(eq(scorecards.id, scorecardId))
      .limit(1);

    if (scorecardResult.length === 0) {
      return NextResponse.json(
        { 
          error: 'Scorecard not found',
          code: 'SCORECARD_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Fetch associated player stats
    const playerStatsResult = await db.select()
      .from(playerStats)
      .where(eq(playerStats.scorecardId, scorecardId));

    // Combine results
    const combinedResult = {
      ...scorecardResult[0],
      playerStats: playerStatsResult
    };

    return NextResponse.json(combinedResult, { status: 200 });

  } catch (error) {
    console.error('GET scorecard error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}