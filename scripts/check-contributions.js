require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkContributions() {
  try {
    // Get all contributions
    const allContributions = await prisma.contribution.findMany({
      orderBy: { createdAt: 'desc' },
    });

    console.log('All contributions in database:');
    console.log('===============================');
    
    allContributions.forEach((c, index) => {
      console.log(`${index + 1}. ID: ${c.id}`);
      console.log(`   Title: ${c.title}`);
      console.log(`   Amount: ₦${c.amount}`);
      console.log(`   Active: ${c.isActive}`);
      console.log(`   Created: ${c.createdAt}`);
      console.log('   ---');
    });

    // Get active contributions only
    const activeContributions = await prisma.contribution.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`\nActive contributions (${activeContributions.length}):`);
    console.log('===============================');
    
    activeContributions.forEach((c, index) => {
      console.log(`${index + 1}. ${c.title} - ₦${c.amount}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkContributions();
