import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { playerStats } from '@/db/schema';
import { eq, like, and, desc, asc, sql, isNull } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single player stat by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const playerStat = await db
        .select()
        .from(playerStats)
        .where(eq(playerStats.id, parseInt(id)))
        .limit(1);

      if (playerStat.length === 0) {
        return NextResponse.json(
          { error: 'Player stat not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(playerStat[0], { status: 200 });
    }

    // List player stats with filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');
    const scorecardId = searchParams.get('scorecardId');
    const teamName = searchParams.get('teamName');
    const search = searchParams.get('search');

    let query = db.select().from(playerStats);

    const conditions = [];

    if (scorecardId) {
      if (isNaN(parseInt(scorecardId))) {
        return NextResponse.json(
          { error: 'Valid scorecardId is required', code: 'INVALID_SCORECARD_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(playerStats.scorecardId, parseInt(scorecardId)));
    }

    if (teamName) {
      conditions.push(eq(playerStats.teamName, teamName));
    }

    if (search) {
      conditions.push(like(playerStats.playerName, `%${search}%`));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Order by position asc (nulls last), then createdAt desc
    const results = await query
      .orderBy(
        sql`CASE WHEN ${playerStats.position} IS NULL THEN 1 ELSE 0 END`,
        asc(playerStats.position),
        desc(playerStats.createdAt)
      )
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

    // Check if this is a bulk create request
    if (body.playerStats && Array.isArray(body.playerStats)) {
      // Bulk create
      const playerStatsArray = body.playerStats;

      if (playerStatsArray.length === 0) {
        return NextResponse.json(
          { error: 'Player stats array cannot be empty', code: 'EMPTY_ARRAY' },
          { status: 400 }
        );
      }

      // Validate each player stat
      const validatedPlayerStats = [];
      for (let i = 0; i < playerStatsArray.length; i++) {
        const stat = playerStatsArray[i];

        if (!stat.scorecardId || isNaN(parseInt(stat.scorecardId))) {
          return NextResponse.json(
            {
              error: `Valid scorecardId is required for player stat at index ${i}`,
              code: 'INVALID_SCORECARD_ID',
            },
            { status: 400 }
          );
        }

        if (!stat.playerName || typeof stat.playerName !== 'string' || stat.playerName.trim() === '') {
          return NextResponse.json(
            {
              error: `Valid playerName is required for player stat at index ${i}`,
              code: 'INVALID_PLAYER_NAME',
            },
            { status: 400 }
          );
        }

        if (!stat.stats || typeof stat.stats !== 'object' || Array.isArray(stat.stats)) {
          return NextResponse.json(
            {
              error: `Valid stats object is required for player stat at index ${i}`,
              code: 'INVALID_STATS',
            },
            { status: 400 }
          );
        }

        const validatedStat: any = {
          scorecardId: parseInt(stat.scorecardId),
          playerName: stat.playerName.trim(),
          stats: stat.stats,
          createdAt: new Date().toISOString(),
        };

        if (stat.teamName && typeof stat.teamName === 'string') {
          validatedStat.teamName = stat.teamName.trim();
        }

        if (stat.position !== undefined && stat.position !== null) {
          if (isNaN(parseInt(stat.position))) {
            return NextResponse.json(
              {
                error: `Valid position is required for player stat at index ${i}`,
                code: 'INVALID_POSITION',
              },
              { status: 400 }
            );
          }
          validatedStat.position = parseInt(stat.position);
        }

        validatedPlayerStats.push(validatedStat);
      }

      // Insert all player stats
      const created = await db.insert(playerStats).values(validatedPlayerStats).returning();

      return NextResponse.json(created, { status: 201 });
    }

    // Single create
    const { scorecardId, playerName, teamName, position, stats } = body;

    // Validate required fields
    if (!scorecardId || isNaN(parseInt(scorecardId))) {
      return NextResponse.json(
        { error: 'Valid scorecardId is required', code: 'INVALID_SCORECARD_ID' },
        { status: 400 }
      );
    }

    if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
      return NextResponse.json(
        { error: 'Valid playerName is required', code: 'INVALID_PLAYER_NAME' },
        { status: 400 }
      );
    }

    if (!stats || typeof stats !== 'object' || Array.isArray(stats)) {
      return NextResponse.json(
        { error: 'Valid stats object is required', code: 'INVALID_STATS' },
        { status: 400 }
      );
    }

    const insertData: any = {
      scorecardId: parseInt(scorecardId),
      playerName: playerName.trim(),
      stats: stats,
      createdAt: new Date().toISOString(),
    };

    if (teamName && typeof teamName === 'string') {
      insertData.teamName = teamName.trim();
    }

    if (position !== undefined && position !== null) {
      if (isNaN(parseInt(position))) {
        return NextResponse.json(
          { error: 'Valid position is required', code: 'INVALID_POSITION' },
          { status: 400 }
        );
      }
      insertData.position = parseInt(position);
    }

    const newPlayerStat = await db.insert(playerStats).values(insertData).returning();

    return NextResponse.json(newPlayerStat[0], { status: 201 });
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
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Check if record exists
    const existing = await db
      .select()
      .from(playerStats)
      .where(eq(playerStats.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Player stat not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const updates: any = {};

    // Only allow updating specific fields
    if (body.playerName !== undefined) {
      if (typeof body.playerName !== 'string' || body.playerName.trim() === '') {
        return NextResponse.json(
          { error: 'Valid playerName is required', code: 'INVALID_PLAYER_NAME' },
          { status: 400 }
        );
      }
      updates.playerName = body.playerName.trim();
    }

    if (body.teamName !== undefined) {
      if (body.teamName === null) {
        updates.teamName = null;
      } else if (typeof body.teamName === 'string') {
        updates.teamName = body.teamName.trim();
      } else {
        return NextResponse.json(
          { error: 'Valid teamName is required', code: 'INVALID_TEAM_NAME' },
          { status: 400 }
        );
      }
    }

    if (body.position !== undefined) {
      if (body.position === null) {
        updates.position = null;
      } else if (!isNaN(parseInt(body.position))) {
        updates.position = parseInt(body.position);
      } else {
        return NextResponse.json(
          { error: 'Valid position is required', code: 'INVALID_POSITION' },
          { status: 400 }
        );
      }
    }

    if (body.stats !== undefined) {
      if (!body.stats || typeof body.stats !== 'object' || Array.isArray(body.stats)) {
        return NextResponse.json(
          { error: 'Valid stats object is required', code: 'INVALID_STATS' },
          { status: 400 }
        );
      }
      updates.stats = body.stats;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_UPDATES' },
        { status: 400 }
      );
    }

    const updated = await db
      .update(playerStats)
      .set(updates)
      .where(eq(playerStats.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
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
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(playerStats)
      .where(eq(playerStats.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Player stat not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(playerStats)
      .where(eq(playerStats.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Player stat deleted successfully',
        playerStat: deleted[0],
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