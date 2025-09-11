# TradeMart Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://neondb_owner:npg_Maus8bK6kdvD@ep-cold-forest-a4yns4nq-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (optional - get from Google Cloud Console)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## Setup Commands

Run these commands in order:

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npm run db:generate

# 3. Push schema to database
npm run db:push

# 4. Seed the database with test data
npm run db:seed

# 5. Start development server
npm run dev
```

## Test Accounts

After seeding, use these accounts:

- **Admin**: admin@trademart.com / admin123
- **Buyer**: buyer1@example.com / buyer123
- **Supplier**: supplier1@example.com / supplier123

## Next Steps

1. Visit http://localhost:3000
2. Sign in with test accounts
3. Explore the dashboard
4. Create RFQs and submit quotes
5. Test the escrow system

## Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google
   - https://your-domain.vercel.app/api/auth/callback/google
6. Copy Client ID and Secret to `.env.local`
