require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deactivateContribution() {
  try {
    const contributionId = 'cmesvc29o0000c9o47bn9so4y';
    
    // Deactivate the contribution
    const updatedContribution = await prisma.contribution.update({
      where: { id: contributionId },
      data: { isActive: false }
    });

    console.log('✅ Successfully deactivated contribution:', contributionId);
    console.log('Title:', updatedContribution.title);
    console.log('Now inactive:', updatedContribution.isActive);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deactivateContribution();
