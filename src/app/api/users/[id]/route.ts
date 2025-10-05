import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // Query database with specific field selection (excluding password)
    const userResult = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        name: users.name,
        bio: users.bio,
        avatar: users.avatar,
        location: users.location,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, parseInt(id)))
      .limit(1);

    // Check if user exists
    if (userResult.length === 0) {
      return NextResponse.json(
        {
          error: 'User not found',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Return user profile (password excluded)
    return NextResponse.json(userResult[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
      },
      { status: 500 }
    );
  }
}