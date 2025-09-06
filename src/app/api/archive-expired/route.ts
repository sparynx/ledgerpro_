import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    const now = new Date();
    console.log(`Archiving expired contributions at: ${now.toISOString()}`);
    
    // Find all active contributions that have passed their due date
    const expiredContributions = await prisma.contribution.findMany({
      where: {
        isActive: true,
        dueDate: {
          lt: now // Less than current time (expired)
        }
      },
      include: {
        receipts: {
          select: {
            id: true,
            userId: true,
            amount: true,
            status: true
          }
        }
      }
    });
    
    console.log(`Found ${expiredContributions.length} expired contributions to archive`);
    
    let archivedCount = 0;
    let deletedCount = 0;
    
    for (const contribution of expiredContributions) {
      console.log(`Processing: ${contribution.title} (Due: ${contribution.dueDate.toISOString()})`);
      
      // Create a past contribution record using raw SQL
      await prisma.$executeRaw`
        INSERT INTO past_contributions (id, title, description, amount, "dueDate", "userId", "originalId", "createdAt", "archivedAt")
        VALUES (gen_random_uuid(), ${contribution.title}, ${contribution.description}, ${contribution.amount}, ${contribution.dueDate}, ${contribution.userId}, ${contribution.id}, ${contribution.createdAt}, NOW())
      `;
      
      // Check if there are any receipts for this contribution
      if (contribution.receipts.length > 0) {
        console.log(`  - Has ${contribution.receipts.length} receipts, marking as inactive`);
        
        // If there are receipts, we should keep the contribution but mark it as inactive
        // This preserves the relationship between receipts and contributions
        await prisma.contribution.update({
          where: { id: contribution.id },
          data: { isActive: false }
        });
        
        archivedCount++;
      } else {
        console.log(`  - No receipts, deleting contribution`);
        
        // If no receipts, we can safely delete the contribution
        await prisma.contribution.delete({
          where: { id: contribution.id }
        });
        
        deletedCount++;
      }
    }
    
    return NextResponse.json({
      message: 'Expired contributions processed successfully',
      archived: archivedCount,
      deleted: deletedCount,
      total: expiredContributions.length
    });

  } catch (error) {
    console.error('Error archiving expired contributions:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
