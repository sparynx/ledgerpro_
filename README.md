# 🏛️ CDS LedgerPro

> **A comprehensive financial management system for CDS (Community Development Service) organizations**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.13.0-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Database Setup](#-database-setup)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

CDS LedgerPro is a modern, full-stack financial management application designed specifically for Community Development Service (CDS) organizations. It streamlines contribution collection, receipt management, expense tracking, and financial reporting with an intuitive user interface and robust admin controls.

### Key Benefits

- **🔐 Secure Authentication** - Firebase-powered user management
- **📊 Real-time Analytics** - Live financial dashboards and reports
- **📧 Automated Reminders** - Email notifications for pending contributions
- **📱 Responsive Design** - Works seamlessly on all devices
- **⚡ High Performance** - Built with Next.js 15 and modern optimizations
- **🛡️ Type Safety** - Full TypeScript implementation

## ✨ Features

### 👥 **User Management**
- **Google OAuth Integration** - Seamless sign-in with Firebase
- **Role-based Access Control** - Admin and member permissions
- **Profile Management** - Username, state code, and contact information
- **User Status Tracking** - Active/inactive member management

### 💰 **Financial Management**
- **Contribution Creation** - Admins can create global or user-specific contributions
- **Receipt Upload System** - Members upload payment proofs with image support
- **Approval Workflow** - Admin review and approval/rejection system
- **Cash Contribution Recording** - Manual entry for cash payments
- **Expense Tracking** - Comprehensive expense management
- **Available Funds Calculation** - Real-time financial status

### 📊 **Analytics & Reporting**
- **Admin Dashboard** - Comprehensive financial overview
- **Member Dashboard** - Personal contribution tracking
- **Financial Reports** - Detailed analytics and insights
- **Export Functionality** - CSV export for external analysis
- **Historical Data** - Past contributions and archived records

### 📧 **Communication System**
- **Automated Email Reminders** - Scheduled notifications every 2 days
- **Beautiful Email Templates** - Professional, responsive designs
- **Email Tracking** - Database logging of all communications
- **Gmail SMTP Integration** - Reliable email delivery

### 🔄 **Automation Features**
- **Expired Contribution Archiving** - Automatic cleanup of overdue contributions
- **Scheduled Tasks** - Cron job integration for automated processes
- **Cache Management** - Optimized data fetching and updates
- **Real-time Updates** - Live data synchronization

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15.4.5** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5.0** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first styling
- **Lucide React** - Beautiful icon library

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **Prisma 6.13.0** - Modern database ORM
- **PostgreSQL** - Robust relational database
- **Nodemailer** - Email service integration

### **Authentication & Security**
- **Firebase Authentication** - Google OAuth integration
- **Environment Variables** - Secure configuration management
- **Role-based Access Control** - Admin/member permissions

### **Deployment & Infrastructure**
- **Vercel** - Serverless deployment platform
- **Vercel Cron Jobs** - Scheduled task automation
- **PostgreSQL Database** - Cloud-hosted database
- **Gmail SMTP** - Email service provider

### **Development Tools**
- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking
- **Prisma Studio** - Database management interface
- **Turbopack** - Fast development builds

## 📸 Screenshots

### Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/800x400/1e40af/ffffff?text=Admin+Dashboard)

### Member Dashboard
![Member Dashboard](https://via.placeholder.com/800x400/059669/ffffff?text=Member+Dashboard)

### Contribution Management
![Contribution Management](https://via.placeholder.com/800x400/7c3aed/ffffff?text=Contribution+Management)

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or later
- **npm** or **yarn** package manager
- **PostgreSQL** database
- **Firebase** project for authentication
- **Gmail** account for email services

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/cds-ledgerpro.git
cd cds-ledgerpro
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables** (see [Environment Setup](#-environment-setup))

4. **Set up the database** (see [Database Setup](#-database-setup))

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/cds_ledgerpro"

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Email Configuration
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-16-character-app-password"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Google Authentication
3. Add your domain to authorized domains
4. Copy the configuration values to your `.env.local`

### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an app password at [Google Account Settings](https://myaccount.google.com/apppasswords)
3. Use the 16-character password (no spaces) in your environment variables

## 🗄️ Database Setup

1. **Create a PostgreSQL database**
```sql
CREATE DATABASE cds_ledgerpro;
```

2. **Run Prisma migrations**
```bash
npx prisma db push
```

3. **Generate Prisma client**
```bash
npx prisma generate
```

4. **Seed the database** (optional)
```bash
npm run seed
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy to Vercel**
```bash
vercel --prod
```

3. **Set environment variables** in Vercel dashboard

4. **Enable Cron Jobs** in Vercel Functions tab

### Manual Deployment

1. **Build the application**
```bash
npm run build
```

2. **Start the production server**
```bash
npm start
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signin` - User sign-in
- `POST /api/auth/signup` - User registration
- `GET /api/auth/profile` - Get user profile

### Contribution Endpoints
- `GET /api/contributions` - Get all contributions
- `POST /api/contributions` - Create new contribution
- `PUT /api/contributions/[id]` - Update contribution
- `DELETE /api/contributions/[id]` - Delete contribution

### Receipt Endpoints
- `GET /api/receipts` - Get user receipts
- `POST /api/receipts` - Upload receipt
- `PUT /api/receipts/[id]` - Update receipt status

### Report Endpoints
- `GET /api/reports/dashboard` - Get dashboard data
- `GET /api/reports/export` - Export financial data
- `POST /api/reports/send` - Send reports via email

### Email Endpoints
- `GET /api/send-reminders` - Check email service status
- `POST /api/send-reminders` - Send manual email reminders
- `POST /api/scheduled-reminders` - Execute scheduled reminders

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```
3. **Commit your changes**
```bash
git commit -m 'Add some amazing feature'
```
4. **Push to the branch**
```bash
git push origin feature/amazing-feature
```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Prisma Team** - For the excellent database ORM
- **Firebase Team** - For authentication services
- **Vercel Team** - For deployment platform
- **Tailwind CSS Team** - For the utility-first CSS framework

## 📞 Support

For support, email support@cdsledgerpro.com or join our Discord community.

---

<div align="center">

**Made with ❤️ for CDS Organizations**

[⭐ Star this repo](https://github.com/yourusername/cds-ledgerpro) | [🐛 Report Bug](https://github.com/yourusername/cds-ledgerpro/issues) | [💡 Request Feature](https://github.com/yourusername/cds-ledgerpro/issues)

</div>