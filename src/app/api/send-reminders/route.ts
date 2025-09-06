import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendBulkEmails, verifyEmailConnection } from '@/lib/email';
import { createReminderEmailTemplate } from '@/lib/emailTemplates';

export async function POST() {
  try {
    console.log('🚀 Starting reminder email process...');
    
    // Verify email connection first
    const emailReady = await verifyEmailConnection();
    if (!emailReady) {
      return NextResponse.json(
        { message: 'Email service not configured properly' },
        { status: 500 }
      );
    }

    // Get all active users
    const allUsers = await prisma.user.findMany({
      where: { 
        isActive: true
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        username: true,
        firebaseUid: true,
      }
    });

    // Filter users with email addresses
    const users = allUsers.filter(user => user.email);

    console.log(`📧 Found ${users.length} active users to send reminders to`);

    if (users.length === 0) {
      return NextResponse.json({
        message: 'No active users found',
        sent: 0,
        failed: 0
      });
    }

    // Get user contribution data for personalized emails
    const userData = await Promise.all(
      users.map(async (user) => {
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
        
        return {
          ...user,
          pendingAmount,
          contributionCount: contributions.length
        };
      })
    );

    // Filter users who have pending contributions
    const usersWithPendingContributions = userData.filter(user => 
      user.pendingAmount > 0 || user.contributionCount > 0
    );

    console.log(`📊 ${usersWithPendingContributions.length} users have pending contributions`);

    if (usersWithPendingContributions.length === 0) {
      return NextResponse.json({
        message: 'No users with pending contributions found',
        sent: 0,
        failed: 0
      });
    }

    // Prepare email data
    const emailRecipients = usersWithPendingContributions.map(user => ({
      email: user.email!,
      name: user.displayName || user.username || 'Member'
    }));

    // Create email content
    const subject = '🎯 New Contributions Available - CDS LedgerPro';
    
    // Send emails
    const results = await sendBulkEmails(
      emailRecipients,
      subject,
      createReminderEmailTemplate({
        userName: 'Member', // Generic name since we're sending to multiple users
        pendingAmount: 0, // Will be personalized per user
        contributionCount: 0
      })
    );

    // Count results
    const sent = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    // Log failed emails
    const failedEmails = results.filter(r => !r.success);
    if (failedEmails.length > 0) {
      console.error('❌ Failed to send emails to:', failedEmails.map(f => f.email));
    }

    console.log(`✅ Email reminder process completed: ${sent} sent, ${failed} failed`);

    return NextResponse.json({
      message: 'Reminder emails sent successfully',
      totalUsers: users.length,
      usersWithPendingContributions: usersWithPendingContributions.length,
      sent,
      failed,
      results: results.map(r => ({
        email: r.email,
        success: r.success,
        error: (r.error as any)?.message || null
      }))
    });

  } catch (error) {
    console.error('❌ Error sending reminder emails:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error },
      { status: 500 }
    );
  }
}

// GET endpoint to check email service status
export async function GET() {
  try {
    const emailReady = await verifyEmailConnection();
    
    if (!emailReady) {
      return NextResponse.json({
        status: 'error',
        message: 'Email service not configured'
      }, { status: 500 });
    }

    // Get user count
    const allUsers = await prisma.user.findMany({
      where: { 
        isActive: true
      },
      select: { email: true }
    });
    
    const userCount = allUsers.filter(user => user.email).length;

    return NextResponse.json({
      status: 'ready',
      message: 'Email service is ready',
      totalActiveUsers: userCount
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Error checking email service',
      error: error
    }, { status: 500 });
  }
}
