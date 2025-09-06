import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Use raw SQL query since Prisma client might not be updated yet
    const pastContributions = await prisma.$queryRaw`
      SELECT 
        pc.*,
        u.id as user_id,
        u.email as user_email,
        u."displayName" as user_display_name,
        u.username as user_username,
        u."stateCode" as user_state_code
      FROM past_contributions pc
      LEFT JOIN users u ON pc."userId" = u.id
      ORDER BY pc."archivedAt" DESC
    `;

    // Transform the raw result to match expected format
    const formattedContributions = (pastContributions as any[]).map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      amount: Number(row.amount),
      dueDate: row.dueDate,
      userId: row.userId,
      originalId: row.originalId,
      archivedAt: row.archivedAt,
      createdAt: row.createdAt,
      user: row.user_id ? {
        id: row.user_id,
        email: row.user_email,
        displayName: row.user_display_name,
        username: row.user_username,
        stateCode: row.user_state_code,
      } : null
    }));

    return NextResponse.json(formattedContributions);

  } catch (error) {
    console.error('Error fetching past contributions:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
