interface EmailTemplateProps {
  userName: string;
  pendingAmount?: number;
  contributionCount?: number;
}

export const createReminderEmailTemplate = ({ userName, pendingAmount = 0, contributionCount = 0 }: EmailTemplateProps) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contribution Available - CDS LedgerPro</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }
        
        .header-content {
            position: relative;
            z-index: 1;
        }
        
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .tagline {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 20px;
        }
        
        .message {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border-left: 4px solid #667eea;
            padding: 25px;
            border-radius: 8px;
            margin: 30px 0;
        }
        
        .highlight-title {
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 15px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 25px 0;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
        }
        
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 14px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        
        .features {
            margin: 30px 0;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            margin: 15px 0;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
        }
        
        .feature-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: white;
            font-weight: bold;
        }
        
        .feature-text {
            flex: 1;
            color: #4a5568;
        }
        
        .footer {
            background: #2d3748;
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .footer-content {
            margin-bottom: 20px;
        }
        
        .social-links {
            margin: 20px 0;
        }
        
        .social-link {
            display: inline-block;
            margin: 0 10px;
            color: #a0aec0;
            text-decoration: none;
            font-size: 14px;
        }
        
        .unsubscribe {
            font-size: 12px;
            color: #a0aec0;
            margin-top: 20px;
        }
        
        .unsubscribe a {
            color: #a0aec0;
            text-decoration: underline;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content, .footer {
                padding: 20px;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .greeting {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="header-content">
                <div class="logo">📊 CDS LedgerPro</div>
                <div class="tagline">Your Digital Contribution Management System</div>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <div class="greeting">Hello ${userName}! 👋</div>
            
            <div class="message">
                We hope you're doing well! We have exciting news - <strong>new contributions are now available</strong> on the CDS LedgerPro platform. 
                Don't miss out on the opportunity to fulfill your contribution obligations and stay up-to-date with your payments.
            </div>
            
            <div class="highlight-box">
                <div class="highlight-title">🎯 Action Required</div>
                <p>Please visit the CDS LedgerPro app to view and upload receipts for the new contributions. 
                Your timely response helps maintain the smooth operation of our community initiatives.</p>
            </div>
            
            ${pendingAmount > 0 || contributionCount > 0 ? `
            <div class="stats-grid">
                ${pendingAmount > 0 ? `
                <div class="stat-card">
                    <div class="stat-number">₦${pendingAmount.toLocaleString()}</div>
                    <div class="stat-label">Pending Amount</div>
                </div>
                ` : ''}
                ${contributionCount > 0 ? `
                <div class="stat-card">
                    <div class="stat-number">${contributionCount}</div>
                    <div class="stat-label">New Contributions</div>
                </div>
                ` : ''}
            </div>
            ` : ''}
            
            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ledgerpro-rho.vercel.app'}/member/dashboard" class="cta-button">
                    🚀 Visit CDS LedgerPro Now
                </a>
            </div>
            
            <div class="features">
                <div class="feature-item">
                    <div class="feature-icon">📱</div>
                    <div class="feature-text">
                        <strong>Easy Upload:</strong> Upload receipts directly from your mobile device
                    </div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">⚡</div>
                    <div class="feature-text">
                        <strong>Quick Processing:</strong> Get instant confirmation of your submissions
                    </div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📊</div>
                    <div class="feature-text">
                        <strong>Track Progress:</strong> Monitor your contribution status in real-time
                    </div>
                </div>
            </div>
            
            <div class="message">
                <strong>Need help?</strong> If you have any questions or need assistance, please don't hesitate to contact our support team. 
                We're here to help make your contribution process as smooth as possible.
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-content">
                <strong>CDS LedgerPro</strong><br>
                Digital Contribution Management System
            </div>
            
            <div class="social-links">
                <a href="#" class="social-link">Support</a>
                <a href="#" class="social-link">Help Center</a>
                <a href="#" class="social-link">Contact Us</a>
            </div>
            
            <div class="unsubscribe">
                You received this email because you're a registered member of CDS LedgerPro.<br>
                <a href="#">Unsubscribe</a> | <a href="#">Update Preferences</a>
            </div>
        </div>
    </div>
</body>
</html>
  `;
};

export const createWelcomeEmailTemplate = ({ userName }: { userName: string }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to CDS LedgerPro</title>
    <style>
        /* Same styles as reminder email */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 24px; font-weight: 600; color: #2d3748; margin-bottom: 20px; }
        .message { font-size: 16px; color: #4a5568; margin-bottom: 30px; line-height: 1.7; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; text-align: center; margin: 30px 0; }
        .footer { background: #2d3748; color: white; padding: 30px; text-align: center; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">🎉 Welcome to CDS LedgerPro</div>
        </div>
        <div class="content">
            <div class="greeting">Hello ${userName}! 👋</div>
            <div class="message">
                Welcome to CDS LedgerPro! We're excited to have you join our digital contribution management system. 
                You can now easily track and manage your contributions, upload receipts, and stay updated with all community initiatives.
            </div>
            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ledgerpro-rho.vercel.app'}/member/dashboard" class="cta-button">
                    Get Started Now
                </a>
            </div>
        </div>
        <div class="footer">
            <strong>CDS LedgerPro</strong><br>
            Digital Contribution Management System
        </div>
    </div>
</body>
</html>
  `;
};


