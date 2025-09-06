import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail, verifyEmailConnection } from '@/lib/email';
import { createReminderEmailTemplate } from '@/lib/emailTemplates';

export async function POST() {
  try {
    console.log('🕐 Starting scheduled reminder process...');
    
    // Verify email connection
    const emailReady = await verifyEmailConnection();
    if (!emailReady) {
      return NextResponse.json(
        { message: 'Email service not configured properly' },
        { status: 500 }
      );
    }

    // Get users who need reminders (haven't received one in the last 2 days)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const allUsers = await prisma.user.findMany({
      where: {
        isActive: true,
        // Users who haven't received a reminder in the last 2 days
        emailReminders: {
          none: {
            emailType: 'reminder',
            sentAt: { gte: twoDaysAgo }
          }
        }
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
    const usersNeedingReminders = allUsers.filter(user => user.email);

    console.log(`📧 Found ${usersNeedingReminders.length} users needing reminders`);

    if (usersNeedingReminders.length === 0) {
      return NextResponse.json({
        message: 'No users need reminders at this time',
        sent: 0,
        skipped: 0
      });
    }

    let sentCount = 0;
    let skippedCount = 0;
    const results = [];

    for (const user of usersNeedingReminders) {
      try {
        // Check if user has pending contributions
        const receipts = await prisma.receipt.aggregate({
          where: { userId: user.id, status: "APPROVED" },
          _sum: { amount: true },
        });
        
        const totalPaid = Number(receipts._sum.amount || 0);
        
        const contributions = await prisma.contribution.findMany({
          where: { 
            isActive: true,
            OR: [
              { userId: null },
              { userId: user.id }
            ]
          },
          select: { amount: true },
        });
        
        const totalContributions = contributions.reduce((sum, c) => sum + Number(c.amount), 0);
        const pendingAmount = Math.max(totalContributions - totalPaid, 0);

        // Skip users with no pending contributions
        if (pendingAmount === 0 && contributions.length === 0) {
          skippedCount++;
          results.push({
            email: user.email,
            status: 'skipped',
            reason: 'No pending contributions'
          });
          continue;
        }

        // Send personalized email
        const userName = user.displayName || user.username || 'Member';
        const emailHtml = createReminderEmailTemplate({
          userName,
          pendingAmount,
          contributionCount: contributions.length
        });

        const emailResult = await sendEmail(
          user.email!,
          '🎯 New Contributions Available - CDS LedgerPro',
          emailHtml
        );

        if (emailResult.success) {
          // Record the email reminder
          await prisma.emailReminder.create({
            data: {
              userId: user.id,
              emailType: 'reminder',
              status: 'sent',
              nextReminder: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
            }
          });

          sentCount++;
          results.push({
            email: user.email,
            status: 'sent',
            pendingAmount,
            contributionCount: contributions.length
          });
        } else {
          // Record failed email
          await prisma.emailReminder.create({
            data: {
              userId: user.id,
              emailType: 'reminder',
              status: 'failed',
              errorMessage: emailResult.error?.message || 'Unknown error'
            }
          });

          results.push({
            email: user.email,
            status: 'failed',
            error: emailResult.error?.message
          });
        }

        // Add delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error processing user ${user.email}:`, error);
        results.push({
          email: user.email,
          status: 'error',
          error: error
        });
      }
    }

    console.log(`✅ Scheduled reminder process completed: ${sentCount} sent, ${skippedCount} skipped`);

    return NextResponse.json({
      message: 'Scheduled reminders processed successfully',
      sent: sentCount,
      skipped: skippedCount,
      total: usersNeedingReminders.length,
      results
    });

  } catch (error) {
    console.error('❌ Error in scheduled reminder process:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error },
      { status: 500 }
    );
  }
}

// GET endpoint to check reminder status
export async function GET() {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const allUsersNeedingReminders = await prisma.user.findMany({
      where: {
        isActive: true,
        emailReminders: {
          none: {
            emailType: 'reminder',
            sentAt: { gte: twoDaysAgo }
          }
        }
      },
      select: { email: true }
    });

    const usersNeedingReminders = allUsersNeedingReminders.filter(user => user.email).length;

    const allActiveUsers = await prisma.user.findMany({
      where: { 
        isActive: true
      },
      select: { email: true }
    });

    const totalActiveUsers = allActiveUsers.filter(user => user.email).length;

    const recentReminders = await prisma.emailReminder.count({
      where: {
        emailType: 'reminder',
        sentAt: { gte: twoDaysAgo }
      }
    });

    return NextResponse.json({
      totalActiveUsers,
      usersNeedingReminders,
      recentReminders,
      lastCheck: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      message: 'Error checking reminder status',
      error: error
    }, { status: 500 });
  }
}
