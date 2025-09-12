# TradeMart - B2B Sourcing Marketplace

A modern B2B sourcing marketplace built with Next.js 14, TypeScript, and PostgreSQL. TradeMart connects buyers with verified suppliers through secure RFQ (Request for Quotation) processes and escrow transactions.

## 🚀 Features

- **Secure Authentication**: NextAuth.js with email/password and Google OAuth
- **Role-based Access**: Buyers, Suppliers, and Admin roles
- **RFQ Management**: Create, manage, and track requests for quotations
- **Quote System**: Suppliers can submit competitive quotes
- **Escrow Transactions**: Secure payment handling with escrow system
- **Supplier Verification**: Verified supplier badges and ratings
- **Real-time Updates**: Live status updates for RFQs and transactions

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon DB)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui + Radix UI
- **Deployment**: Vercel + Neon DB

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon DB account (or any PostgreSQL database)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd TradeMart
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://neondb_owner:npg_Maus8bK6kdvD@ep-cold-forest-a4yns4nq-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="4706e1cf36bbcfbdc5d8ad3eb306ee2b"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with test data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 👥 Test Accounts

After running the seed script, you can use these test accounts:

### Admin
- **Email**: admin@trademart.com
- **Password**: admin123

### Buyers
- **Email**: buyer1@example.com
- **Password**: buyer123
- **Email**: buyer2@example.com
- **Password**: buyer123

### Suppliers
- **Email**: supplier1@example.com
- **Password**: supplier123
- **Email**: supplier2@example.com
- **Password**: supplier123
- **Email**: supplier3@example.com
- **Password**: supplier123

## 🏗 Project Structure

```
TradeMart/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── rfqs/          # RFQ management
│   │   ├── quotes/        # Quote system
│   │   └── transactions/  # Escrow transactions
│   ├── auth/              # Auth pages (signin/signup)
│   ├── dashboard/         # User dashboard
│   └── page.tsx           # Homepage
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── public/               # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### RFQs
- `GET /api/rfqs` - List all RFQs (with filters)
- `POST /api/rfqs` - Create new RFQ
- `GET /api/rfqs/[id]` - Get single RFQ with quotes

### Quotes
- `POST /api/quotes` - Submit quote (suppliers only)
- `PATCH /api/quotes/[id]` - Accept/reject quote (buyers only)

### Transactions
- `GET /api/transactions` - List user transactions
- `PATCH /api/transactions/[id]/release` - Release funds
- `PATCH /api/transactions/[id]/refund` - Request refund

## 🎨 Design System

### Colors
- **Primary**: #0072CE (Trust Blue)
- **Secondary**: #27AE60 (Growth Green)
- **Background**: #F4F6F8 (Light Grey)
- **Text**: #2C3E50 (Dark Grey)

### Components
Built with shadcn/ui components:
- Button, Card, Input, Badge
- Responsive design with TailwindCSS
- Dark/light mode support

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-production-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 📊 Database Schema

### Core Tables
- **users** - User accounts (buyers, suppliers, admin)
- **suppliers** - Supplier profiles with verification status
- **rfqs** - Requests for quotations
- **quotes** - Supplier quotes for RFQs
- **transactions** - Escrow transactions

### NextAuth.js Tables
- **accounts** - OAuth provider accounts
- **sessions** - User sessions
- **verification_tokens** - Email verification tokens

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based sessions
- Role-based access control
- Escrow system for secure payments
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@trademart.com or create an issue in the repository.

---

**TradeMart** - Trade Safe. Grow Fast. 🚀