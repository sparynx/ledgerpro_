const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testEmailSystem() {
  try {
    console.log('=== TESTING EMAIL SYSTEM ===');
    
    // Test 1: Check if email service is configured
    console.log('\n1. Testing email service configuration...');
    try {
      const response = await fetch('http://localhost:3000/api/send-reminders', {
        method: 'GET'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Email service status:', data.status);
        console.log('📊 Total active users:', data.totalActiveUsers);
      } else {
        console.log('❌ Email service not configured');
        console.log('Please set up Gmail credentials in .env.local');
      }
    } catch (error) {
      console.log('❌ Cannot connect to email service');
      console.log('Make sure the development server is running');
    }
    
    // Test 2: Check users with pending contributions
    console.log('\n2. Checking users with pending contributions...');
    
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        email: true,
        displayName: true,
        username: true
      }
    });
    
    const usersWithEmail = users.filter(user => user.email);
    console.log(`📧 Users with email addresses: ${usersWithEmail.length}`);
    
    let usersWithPendingContributions = 0;
    
    for (const user of usersWithEmail) {
      // Get user's pending amount
      const receipts = await prisma.receipt.aggregate({
        where: { userId: user.id, status: "APPROVED" },
        _sum: { amount: true },
      });
      
      const totalPaid = Number(receipts._sum.amount || 0);
      
      // Get user's active contributions
      const contributions = await prisma.contribution.findMany({
        where: { 
          isActive: true,
          OR: [
            { userId: null }, // Global contributions
            { userId: user.id } // User-specific contributions
          ]
        },
        select: { amount: true },
      });
      
      const totalContributions = contributions.reduce((sum, c) => sum + Number(c.amount), 0);
      const pendingAmount = Math.max(totalContributions - totalPaid, 0);
      
      if (pendingAmount > 0 || contributions.length > 0) {
        usersWithPendingContributions++;
        console.log(`  - ${user.displayName || user.username || user.email}: ₦${pendingAmount.toLocaleString()} pending`);
      }
    }
    
    console.log(`📊 Users with pending contributions: ${usersWithPendingContributions}`);
    
    // Test 3: Check email reminder history
    console.log('\n3. Checking email reminder history...');
    
    const recentReminders = await prisma.emailReminder.findMany({
      where: {
        emailType: 'reminder',
        sentAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      include: {
        user: {
          select: { email: true, displayName: true }
        }
      },
      orderBy: { sentAt: 'desc' },
      take: 5
    });
    
    console.log(`📧 Recent reminders sent (last 7 days): ${recentReminders.length}`);
    recentReminders.forEach(reminder => {
      console.log(`  - ${reminder.user.email}: ${reminder.status} (${reminder.sentAt.toISOString()})`);
    });
    
    // Test 4: Check scheduled reminders
    console.log('\n4. Testing scheduled reminders...');
    try {
      const response = await fetch('http://localhost:3000/api/scheduled-reminders', {
        method: 'GET'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Scheduled reminders status:');
        console.log(`  - Total active users: ${data.totalActiveUsers}`);
        console.log(`  - Users needing reminders: ${data.usersNeedingReminders}`);
        console.log(`  - Recent reminders: ${data.recentReminders}`);
      } else {
        console.log('❌ Cannot check scheduled reminders');
      }
    } catch (error) {
      console.log('❌ Cannot connect to scheduled reminders service');
    }
    
    console.log('\n=== SETUP INSTRUCTIONS ===');
    console.log('1. Add Gmail credentials to .env.local:');
    console.log('   GMAIL_USER=your-email@gmail.com');
    console.log('   GMAIL_APP_PASSWORD=your-app-password');
    console.log('   NEXT_PUBLIC_APP_URL=http://localhost:3000');
    console.log('');
    console.log('2. Test email sending:');
    console.log('   - Visit: http://localhost:3000/api/send-reminders (GET)');
    console.log('   - Use admin dashboard "Send Reminder Emails" button');
    console.log('');
    console.log('3. Set up automatic scheduling:');
    console.log('   - Use cron job to call /api/scheduled-reminders daily');
    console.log('   - Or use Vercel cron jobs for automatic sending');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEmailSystem();


