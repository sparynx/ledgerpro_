require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteUserContribution() {
  try {
    const contributionId = 'cmesvfswf0000c954j1omyenx';
    
    // First, delete the receipt associated with this contribution
    const receipts = await prisma.receipt.findMany({
      where: { contributionId: contributionId }
    });
    
    if (receipts.length > 0) {
      await prisma.receipt.deleteMany({
        where: { contributionId: contributionId }
      });
      console.log(`Deleted ${receipts.length} receipt(s) for contribution`);
    }
    
    // Then delete the contribution
    const deletedContribution = await prisma.contribution.delete({
      where: { id: contributionId }
    });

    console.log('✅ Successfully deleted contribution:', contributionId);
    console.log('Title:', deletedContribution.title);
    console.log('Amount:', deletedContribution.amount);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUserContribution();
