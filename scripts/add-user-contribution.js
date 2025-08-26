require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addUserContribution() {
  try {
    const userId = 'cme6vsmo7000akw04dww7bvqb';
    
    // Find the user by database ID
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.error('User not found with ID:', userId);
      return;
    }

    console.log('Found user:', user.displayName || user.username || user.email);

    // Create a user-specific contribution that won't show for others
    const contribution = await prisma.contribution.create({
      data: {
        title: `Special Contribution - ${user.displayName || user.username || 'User'}`,
        description: `Private contribution for ${user.displayName || user.username || 'this user'} only`,
        amount: 1000,
        dueDate: new Date(),
        isActive: false, // Make it inactive so it doesn't show in general contribution lists
      }
    });

    console.log('Created private contribution:', contribution.id);

    // Create an automatically approved receipt
    const receipt = await prisma.receipt.create({
      data: {
        userId: user.id,
        contributionId: contribution.id,
        amount: 1000,
        imageUrl: 'https://via.placeholder.com/400x300?text=Auto+Approved',
        description: 'Automatically approved receipt',
        status: 'APPROVED',
        adminNotes: 'Automatically approved by system',
      }
    });

    console.log('Created approved receipt:', receipt.id);
    console.log('✅ Successfully added private 1000 contribution and approved receipt for user:', userId);
    console.log('Note: This contribution is inactive and won\'t show for other users');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addUserContribution();
