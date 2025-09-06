# Setting up Automatic Contribution Archiving

## Overview
This system automatically archives expired contributions to keep the platform clean while preserving historical data for admin reference.

## How it works
1. **Expired contributions** are automatically moved to a `past_contributions` table
2. **Contributions with receipts** are marked as inactive (preserves data integrity)
3. **Contributions without receipts** are completely deleted
4. **Users never see expired contributions** - they disappear from their dashboards
5. **Admins can view past contributions** for reference

## Manual Archiving
You can manually trigger the archiving process from the admin dashboard:
- Go to Admin Dashboard → Quick Actions → "Archive Expired Contributions"

## Automatic Archiving (Recommended)
To set up automatic archiving, you can use a cron job or scheduled task:

### Option 1: Cron Job (Linux/Mac)
Add this to your crontab to run daily at 2 AM:
```bash
0 2 * * * curl -X POST https://your-domain.com/api/archive-expired
```

### Option 2: Windows Task Scheduler
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger to "Daily" at 2:00 AM
4. Set action to "Start a program"
5. Program: `curl`
6. Arguments: `-X POST https://your-domain.com/api/archive-expired`

### Option 3: Vercel Cron Jobs (if using Vercel)
Add to your `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/archive-expired",
      "schedule": "0 2 * * *"
    }
  ]
}
```

## API Endpoint
- **URL**: `/api/archive-expired`
- **Method**: POST
- **Response**: JSON with count of archived/deleted contributions

## Admin Features
- **View Past Contributions**: `/admin/past-contributions`
- **Manual Archive**: Button in admin dashboard
- **Historical Reference**: All past contributions are preserved with full details

## Database Changes
- New table: `past_contributions` (stores archived contributions)
- Updated: `contributions` table (added `userId` field for user-specific contributions)
- Updated: `users` table (added relations to contributions and past contributions)


