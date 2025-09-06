import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get all users with their contribution statistics
    const contributors = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        email: true,
        displayName: true,
        username: true,
        stateCode: true,
        receipts: {
          where: { status: 'APPROVED' },
          select: {
            amount: true,
            createdAt: true,
          },
        },
      },
    });

    // Transform the data to include calculated fields
    const contributorsWithStats = contributors.map(user => {
      const totalPaid = user.receipts.reduce((sum, receipt) => sum + Number(receipt.amount), 0);
      const lastContribution = user.receipts.length > 0 
        ? user.receipts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
        : null;

      return {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        username: user.username,
        stateCode: user.stateCode,
        totalPaid,
        receiptsCount: user.receipts.length,
        lastContribution,
      };
    });

    // Sort by total paid (descending)
    contributorsWithStats.sort((a, b) => b.totalPaid - a.totalPaid);

    return NextResponse.json(contributorsWithStats);

  } catch (error) {
    console.error('Error fetching contributors:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


