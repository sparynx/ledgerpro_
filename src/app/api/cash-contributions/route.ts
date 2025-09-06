import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, description } = body;

    if (!userId || !amount) {
      return NextResponse.json(
        { message: 'Missing required fields: userId and amount' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, displayName: true }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Create a contribution for this user
    const contribution = await prisma.contribution.create({
      data: {
        title: 'Cash Contribution',
        description: description || 'Cash contribution recorded by admin',
        amount: parseFloat(amount),
        dueDate: new Date(),
        isActive: true,
        userId: userId, // User-specific contribution
      },
    });

    // Create an approved receipt for this contribution (since it's cash, no need for approval)
    const receipt = await prisma.receipt.create({
      data: {
        userId: userId,
        contributionId: contribution.id,
        amount: parseFloat(amount),
        imageUrl: 'cash-payment', // Special marker for cash payments
        description: description || 'Cash payment received by admin',
        status: 'APPROVED', // Auto-approve cash payments
        adminNotes: 'Cash payment recorded by admin',
      },
    });

    return NextResponse.json({
      message: 'Cash contribution recorded successfully',
      contribution,
      receipt,
    }, { status: 201 });

  } catch (error) {
    console.error('Error recording cash contribution:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


