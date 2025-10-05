import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { lists } from '@/db/schema';
import { eq, like, or, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const userIdParam = searchParams.get('userId');
    const isPublicParam = searchParams.get('isPublic');

    let query = db.select().from(lists);
    const conditions: any[] = [];

    // Filter by userId
    if (userIdParam) {
      const userId = parseInt(userIdParam);
      if (!isNaN(userId)) {
        conditions.push(eq(lists.userId, userId));
      }
    }

    // Filter by isPublic
    if (isPublicParam !== null) {
      const isPublic = isPublicParam === 'true' ? 1 : 0;
      conditions.push(eq(lists.isPublic, isPublic));
    }

    // Search in name and description
    if (search && search.trim()) {
      const searchTerm = search.trim();
      conditions.push(
        or(
          like(lists.name, `%${searchTerm}%`),
          like(lists.description, `%${searchTerm}%`)
        )
      );
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    // Sort by createdAt descending and apply pagination
    const results = await query.orderBy(desc(lists.createdAt)).limit(limit).offset(offset);

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
    const { userId, name, description, isPublic } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'name is required and must be a non-empty string', code: 'INVALID_NAME' },
        { status: 400 }
      );
    }

    // Validate userId is valid integer
    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      return NextResponse.json(
        { error: 'userId must be a valid integer', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    // Prepare data for insertion
    const listData: any = {
      userId: parsedUserId,
      name: name.trim(),
      description: description ? description.trim() : null,
      isPublic: isPublic !== undefined ? (isPublic ? 1 : 0) : 1,
      createdAt: new Date().toISOString()
    };

    const newList = await db.insert(lists).values(listData).returning();

    return NextResponse.json(newList[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}