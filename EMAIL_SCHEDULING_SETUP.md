# CDS LedgerPro - Email Reminder Scheduling Setup

This guide explains how to set up automatic email reminders for your CDS LedgerPro application.

## 🎯 Overview

The email reminder system sends personalized emails to all registered users every 2 days, reminding them to upload receipts for pending contributions.

## 📧 Email System Features

- **Personalized emails** with user's name and pending contribution amount
- **Beautiful HTML template** with CDS LedgerPro branding
- **Automatic tracking** of sent emails in the database
- **Rate limiting** to avoid Gmail restrictions
- **Error handling** and retry logic

## 🚀 Quick Setup (Choose One)

### Option 1: Vercel Cron Jobs (Recommended for Production)

**Already configured!** Your `vercel.json` file is ready:

```json
{
  "crons": [
    {
      "path": "/api/scheduled-reminders",
      "schedule": "0 9 */2 * *"
    }
  ]
}
```

**Deploy to Vercel:**
```bash
vercel --prod
```

**Enable in Vercel Dashboard:**
1. Go to your project in Vercel dashboard
2. Navigate to "Functions" tab
3. Enable "Cron Jobs" feature
4. ✅ **Done!** Emails will send every 2 days at 9:00 AM UTC

### Option 2: Windows Local Development

**Run as Administrator:**
```powershell
# Right-click PowerShell and select "Run as Administrator"
.\scripts\setup-cron-windows.ps1
```

**Test the setup:**
```powershell
.\scripts\test-scheduled-reminders.ps1
```

### Option 3: External Cron Service

Use **Cron-job.org** (Free):
1. Create account at https://cron-job.org
2. Add new cron job:
   - **URL:** `https://ledgerpro-rho.vercel.app/api/scheduled-reminders`
   - **Method:** POST
   - **Schedule:** `0 9 */2 * *` (every 2 days at 9:00 AM)
3. ✅ **Done!**

## 📋 API Endpoints

### Manual Email Sending
- **GET** `/api/send-reminders` - Check email service status
- **POST** `/api/send-reminders` - Send emails to all users immediately

### Scheduled Email Sending
- **GET** `/api/scheduled-reminders` - Check scheduled reminder status
- **POST** `/api/scheduled-reminders` - Execute scheduled reminders (for cron jobs)

## 🧪 Testing

### Test Email Service
```powershell
# Check if email service is ready
Invoke-WebRequest -Uri "http://localhost:3000/api/send-reminders" -Method GET

# Send test emails
Invoke-WebRequest -Uri "http://localhost:3000/api/send-reminders" -Method POST
```

### Test Scheduled Reminders
```powershell
# Check scheduled reminder status
Invoke-WebRequest -Uri "http://localhost:3000/api/scheduled-reminders" -Method GET

# Execute scheduled reminders
Invoke-WebRequest -Uri "http://localhost:3000/api/scheduled-reminders" -Method POST
```

## 📊 Monitoring

### Check Email Logs
- **Database:** Check `email_reminders` table for sent emails
- **Console:** Check server logs for email sending status
- **Gmail:** Check your Gmail outbox for sent emails

### Check Scheduled Task Status (Windows)
```powershell
# View task details
Get-ScheduledTask -TaskName "CDS-LedgerPro-Email-Reminders"

# Run task manually
Start-ScheduledTask -TaskName "CDS-LedgerPro-Email-Reminders"
```

## ⚙️ Configuration

### Environment Variables
Make sure these are set in your `.env.local`:
```bash
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Gmail App Password
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password: https://myaccount.google.com/apppasswords
3. Use the 16-character password (no spaces) in your environment variables

## 🚨 Troubleshooting

### Common Issues

**1. Emails not sending:**
- Check Gmail app password format (16 characters, no spaces)
- Verify GMAIL_USER is correct email address
- Check Gmail outbox for any blocked emails

**2. Scheduled task not running:**
- Ensure the task is enabled in Task Scheduler
- Check if the development server is running
- Verify the PowerShell script path is correct

**3. Cron job not working:**
- Check the cron syntax: `0 9 */2 * *`
- Verify the URL is accessible
- Check server logs for any errors

### Debug Commands

```powershell
# Test scheduled reminders
.\scripts\test-scheduled-reminders.ps1

# Check server status
Invoke-WebRequest -Uri "http://localhost:3000/api/scheduled-reminders" -Method GET
```

## 📈 Performance

- **Rate Limiting:** 1-second delay between emails
- **Gmail Limits:** 500 emails/day for free accounts
- **Database Tracking:** All emails are logged for monitoring
- **Error Handling:** Failed emails are retried automatically

## 🔒 Security

- **Environment Variables:** Sensitive data stored securely
- **Gmail App Passwords:** More secure than regular passwords
- **Rate Limiting:** Prevents spam and abuse
- **Database Logging:** Audit trail for all email activities

---

## 🎉 Success!

Once set up, your CDS LedgerPro will automatically:
- ✅ Send personalized reminder emails every 2 days
- ✅ Track all email activities in the database
- ✅ Handle errors gracefully
- ✅ Respect Gmail rate limits
- ✅ Provide detailed logging and monitoring

Your users will receive beautiful, personalized emails encouraging them to upload their receipts and stay engaged with the platform!
