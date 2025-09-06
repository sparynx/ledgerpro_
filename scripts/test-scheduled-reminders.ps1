# Test Script for Scheduled Email Reminders
# This script tests the scheduled reminder system

Write-Host "=== Testing CDS LedgerPro Scheduled Reminders ===" -ForegroundColor Green
Write-Host ""

# Check if development server is running
Write-Host "1. Checking development server..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/scheduled-reminders" -Method GET -TimeoutSec 5
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Server is running" -ForegroundColor Green
    Write-Host "   Users needing reminders: $($data.usersNeedingReminders)" -ForegroundColor White
    Write-Host "   Total active users: $($data.totalActiveUsers)" -ForegroundColor White
}
catch {
    Write-Host "❌ Development server is not running" -ForegroundColor Red
    Write-Host "   Please start the server with: npm run dev" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "2. Testing scheduled reminder endpoint..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/scheduled-reminders" -Method POST -TimeoutSec 30
    $data = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ Scheduled reminders executed successfully!" -ForegroundColor Green
    Write-Host "   Emails sent: $($data.emailsSent)" -ForegroundColor White
    Write-Host "   Emails failed: $($data.emailsFailed)" -ForegroundColor White
    Write-Host "   Total users: $($data.totalUsers)" -ForegroundColor White
    
    if ($data.results) {
        Write-Host ""
        Write-Host "📧 Email Results:" -ForegroundColor Cyan
        foreach ($result in $data.results) {
            $status = if ($result.success) { "✅" } else { "❌" }
            Write-Host "   $status $($result.email) - $($result.name)" -ForegroundColor White
        }
    }
}
catch {
    Write-Host "❌ Failed to execute scheduled reminders: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Checking scheduled task status..." -ForegroundColor Cyan
try {
    $task = Get-ScheduledTask -TaskName "CDS-LedgerPro-Email-Reminders" -ErrorAction SilentlyContinue
    if ($task) {
        Write-Host "✅ Scheduled task found" -ForegroundColor Green
        Write-Host "   State: $($task.State)" -ForegroundColor White
        Write-Host "   Last Run: $($task.LastRunTime)" -ForegroundColor White
        Write-Host "   Next Run: $($task.NextRunTime)" -ForegroundColor White
    }
    else {
        Write-Host "❌ Scheduled task not found" -ForegroundColor Red
        Write-Host "   Run: scripts\setup-cron-windows.ps1 as Administrator" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Error checking scheduled task: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Test completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "- Check your Gmail for outbound emails" -ForegroundColor White
Write-Host "- Verify users received their reminder emails" -ForegroundColor White
Write-Host "- Monitor the scheduled task execution" -ForegroundColor White

Read-Host "Press Enter to exit"
