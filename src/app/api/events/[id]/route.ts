import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { events, reviews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    
    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Valid event ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Fetch event with review statistics
    const eventWithStats = await db
      .select({
        event: events,
        reviewCount: sql<number>`COUNT(${reviews.id})`.as('review_count'),
        averageRating: sql<number>`AVG(${reviews.rating})`.as('average_rating')
      })
      .from(events)
      .leftJoin(reviews, eq(reviews.eventId, events.id))
      .where(eq(events.id, eventId))
      .groupBy(events.id);

    if (eventWithStats.length === 0) {
      return NextResponse.json(
        { error: 'Event not found', code: 'EVENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const result = {
      ...eventWithStats[0].event,
      reviewStats: {
        count: eventWithStats[0].reviewCount || 0,
        averageRating: eventWithStats[0].averageRating ? parseFloat(eventWithStats[0].averageRating.toFixed(1)) : 0
      }
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}