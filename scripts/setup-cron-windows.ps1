# Windows PowerShell Script to Set Up Local Cron Job
# This script sets up a scheduled task to run email reminders every 2 days

Write-Host "=== CDS LedgerPro Email Reminder Scheduler ===" -ForegroundColor Green
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "❌ This script needs to run as Administrator" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Get the current directory (project root)
$projectPath = Get-Location
$scriptPath = Join-Path $projectPath "scripts\run-email-reminders.ps1"

Write-Host "Project Path: $projectPath" -ForegroundColor Cyan
Write-Host "Script Path: $scriptPath" -ForegroundColor Cyan
Write-Host ""

# Create the PowerShell script that will be executed by the scheduled task
$reminderScript = @"
# CDS LedgerPro Email Reminder Script
Set-Location "$projectPath"

Write-Host "=== Running Scheduled Email Reminders ===" -ForegroundColor Green
Write-Host "Time: `$(Get-Date)" -ForegroundColor Cyan

try {
    # Start the development server if not running
    `$devServer = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { `$_.CommandLine -like "*next*" }
    
    if (-not `$devServer) {
        Write-Host "Starting development server..." -ForegroundColor Yellow
        Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Hidden
        Start-Sleep -Seconds 10
    }
    
    # Wait for server to be ready
    `$maxAttempts = 30
    `$attempt = 0
    
    do {
        try {
            `$response = Invoke-WebRequest -Uri "http://localhost:3000/api/scheduled-reminders" -Method POST -TimeoutSec 5
            Write-Host "✅ Email reminders sent successfully!" -ForegroundColor Green
            Write-Host "Response: `$(`$response.Content)" -ForegroundColor Cyan
            break
        }
        catch {
            `$attempt++
            Write-Host "Attempt `$attempt/`$maxAttempts - Server not ready, waiting..." -ForegroundColor Yellow
            Start-Sleep -Seconds 10
        }
    } while (`$attempt -lt `$maxAttempts)
    
    if (`$attempt -eq `$maxAttempts) {
        Write-Host "❌ Failed to send email reminders after `$maxAttempts attempts" -ForegroundColor Red
    }
}
catch {
    Write-Host "❌ Error running email reminders: `$_" -ForegroundColor Red
}

Write-Host "=== Email Reminder Script Completed ===" -ForegroundColor Green
"@

# Save the reminder script
$reminderScript | Out-File -FilePath $scriptPath -Encoding UTF8
Write-Host "✅ Created reminder script: $scriptPath" -ForegroundColor Green

# Create the scheduled task
$taskName = "CDS-LedgerPro-Email-Reminders"
$taskDescription = "Sends email reminders to CDS LedgerPro users every 2 days"

# Remove existing task if it exists
try {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
    Write-Host "✅ Removed existing scheduled task" -ForegroundColor Green
}
catch {
    Write-Host "ℹ️  No existing task to remove" -ForegroundColor Cyan
}

# Create the scheduled task action
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$scriptPath`""

# Create the scheduled task trigger (every 2 days at 9:00 AM)
$trigger = New-ScheduledTaskTrigger -Daily -At "9:00AM" -DaysInterval 2

# Create the scheduled task settings
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# Create the scheduled task principal (run as SYSTEM)
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

# Register the scheduled task
try {
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description $taskDescription
    Write-Host "✅ Scheduled task created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Task Details:" -ForegroundColor Cyan
    Write-Host "   Name: $taskName" -ForegroundColor White
    Write-Host "   Schedule: Every 2 days at 9:00 AM" -ForegroundColor White
    Write-Host "   Script: $scriptPath" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Management Commands:" -ForegroundColor Cyan
    Write-Host "   View task: Get-ScheduledTask -TaskName '$taskName'" -ForegroundColor White
    Write-Host "   Run now: Start-ScheduledTask -TaskName '$taskName'" -ForegroundColor White
    Write-Host "   Remove: Unregister-ScheduledTask -TaskName '$taskName'" -ForegroundColor White
}
catch {
    Write-Host "❌ Failed to create scheduled task: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Email reminder scheduling setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Test the scheduled task: Start-ScheduledTask -TaskName '$taskName'" -ForegroundColor White
Write-Host "2. Check task status: Get-ScheduledTask -TaskName '$taskName'" -ForegroundColor White
Write-Host "3. View task history in Task Scheduler (taskschd.msc)" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Important Notes:" -ForegroundColor Yellow
Write-Host "- Make sure your development server is running when the task executes" -ForegroundColor White
Write-Host "- The task will start the server automatically if needed" -ForegroundColor White
Write-Host "- Check the script logs for any issues" -ForegroundColor White

Read-Host "Press Enter to exit"