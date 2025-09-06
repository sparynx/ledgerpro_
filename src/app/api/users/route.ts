import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateCode = searchParams.get('stateCode');
    const search = searchParams.get('search');
    const includeReceipts = searchParams.get('include') === 'receipts';

    let whereClause: any = { isActive: true };

    if (stateCode) {
      whereClause.stateCode = {
        contains: stateCode,
        mode: 'insensitive',
      };
    }

    if (search) {
      whereClause.OR = [
        {
          displayName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          username: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          stateCode: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        stateCode: true,
        isActive: true,
        createdAt: true,
        receipts: includeReceipts
          ? {
              select: {
                id: true,
                amount: true,
                status: true,
                createdAt: true,
                description: true,
                imageUrl: true,
                contribution: { select: { title: true } },
              },
              orderBy: { createdAt: 'desc' },
            }
          : false,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
  }
}
