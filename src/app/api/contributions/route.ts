import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const firebaseUid = searchParams.get("firebaseUid");
    
    let whereClause: any = { isActive: true };
    
    if (firebaseUid) {
      // Find user by firebaseUid
      const user = await prisma.user.findUnique({ 
        where: { firebaseUid },
        select: { id: true }
      });
      
      if (user) {
        // Show global contributions (userId is null) AND user-specific contributions
        whereClause = {
          isActive: true,
          OR: [
            { userId: null }, // Global contributions for all users
            { userId: user.id } // User-specific contributions
          ]
        };
      }
    }
    
    const contributions = await prisma.contribution.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(contributions);
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, amount, dueDate } = body;

    if (!title || !amount || !dueDate) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const contribution = await prisma.contribution.create({
      data: {
        title,
        description,
        amount: new Prisma.Decimal(amount),
        dueDate: new Date(dueDate),
        isActive: true,
      },
    });

    return NextResponse.json(contribution, { status: 201 });
  } catch (error) {
    console.error('Error creating contribution:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
