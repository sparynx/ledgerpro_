# Email Reminder System Setup Guide

## 🚀 Quick Setup

### 1. Gmail SMTP Configuration

Add these environment variables to your `.env.local` file:

```bash
# Gmail SMTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# App URL (for email links)
NEXT_PUBLIC_APP_URL=https://ledgerpro-rho.vercel.app
```

### 2. Gmail App Password Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password as `GMAIL_APP_PASSWORD`

### 3. Test Email Service

Visit: `https://your-domain.com/api/send-reminders` (GET request)
- Should return: `{"status": "ready", "message": "Email service is ready"}`

## 📧 Features

### ✅ **Beautiful Email Templates**
- **Responsive design** that works on all devices
- **Gradient backgrounds** and modern UI
- **Personalized content** with user's pending amounts
- **Call-to-action buttons** linking to the app

### ✅ **Smart Reminder System**
- **Automatic sending** every 2 days
- **Only to users with pending contributions**
- **Prevents spam** with email tracking
- **Rate limiting** to avoid Gmail limits

### ✅ **Admin Controls**
- **Manual send button** in admin dashboard
- **Bulk email sending** to all users
- **Email tracking** and status monitoring
- **Error handling** and retry logic

## 🔧 API Endpoints

### Send Reminder Emails
```
POST /api/send-reminders
```
- Sends emails to all users with pending contributions
- Returns: sent count, failed count, results

### Scheduled Reminders
```
POST /api/scheduled-reminders
```
- Checks for users needing reminders (every 2 days)
- Sends personalized emails
- Records email history

### Check Email Status
```
GET /api/send-reminders
```
- Verifies email service configuration
- Returns user count and service status

## ⏰ Automatic Scheduling

### Option 1: Vercel Cron Jobs
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/scheduled-reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Option 2: External Cron Service
Use services like:
- **cron-job.org** (free)
- **EasyCron** (free tier)
- **SetCronJob** (free tier)

Set to call: `https://your-domain.com/api/scheduled-reminders` every day at 9 AM

### Option 3: Manual Trigger
Use the "📧 Send Reminder Emails" button in admin dashboard

## 📊 Email Tracking

The system tracks:
- **Email sent date/time**
- **Email status** (sent, failed, bounced)
- **Error messages** for failed emails
- **Next reminder date** (2 days from last sent)

## 🎨 Email Template Features

### **Header Section**
- Beautiful gradient background
- CDS LedgerPro branding
- Professional tagline

### **Content Section**
- Personalized greeting
- Pending contribution amounts
- Contribution count
- Clear call-to-action

### **Features Section**
- Mobile-friendly upload
- Quick processing
- Real-time tracking

### **Footer Section**
- Contact information
- Unsubscribe options
- Professional branding

## 🔒 Security & Limits

### **Gmail Limits**
- **500 emails/day** for free accounts
- **Rate limiting** built-in (1 second between emails)
- **Error handling** for failed sends

### **Spam Prevention**
- **Email tracking** prevents duplicate sends
- **2-day intervals** between reminders
- **Professional templates** reduce spam flags

## 🚨 Troubleshooting

### Email Service Not Working
1. Check Gmail credentials in `.env.local`
2. Verify app password is correct
3. Ensure 2FA is enabled on Gmail
4. Check API endpoint: `/api/send-reminders` (GET)

### Emails Not Sending
1. Check Gmail daily limit (500 emails)
2. Verify user emails are valid
3. Check error logs in API responses
4. Test with single user first

### Template Issues
1. Verify `NEXT_PUBLIC_APP_URL` is set
2. Check email template HTML
3. Test in different email clients

## 📈 Monitoring

### Admin Dashboard
- **Send Reminder Emails** button
- **Real-time feedback** on email status
- **Success/failure counts**

### API Monitoring
- Check `/api/scheduled-reminders` (GET) for status
- Monitor email tracking in database
- Review error logs for failed sends

## 🎯 Next Steps

1. **Set up Gmail credentials**
2. **Test email service** with GET request
3. **Send test emails** using admin dashboard
4. **Set up automatic scheduling** (cron job)
5. **Monitor email delivery** and user engagement

The system is now ready to send beautiful, personalized reminder emails to all your users every 2 days until they complete their contributions! 🎉


