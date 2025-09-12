# 🚀 Quick Setup Guide

## The Error You're Seeing

The error "Failed to fetch suppliers" occurs because the database isn't set up yet. Here's how to fix it:

## Step 1: Set Up Database Connection

Create a `.env.local` file in your project root:

```env
# Database URL - Replace with your actual database connection
DATABASE_URL="postgresql://username:password@localhost:5432/trademart?schema=trademart"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Step 2: Set Up Database

### Option A: Use Neon (Recommended - Free PostgreSQL)
1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new database
4. Copy the connection string
5. Paste it in your `.env.local` file

### Option B: Use Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database named `trademart`
3. Use connection string: `postgresql://postgres:password@localhost:5432/trademart?schema=trademart`

## Step 3: Run Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Populate with sample data
npm run db:populate
```

## Step 4: Test the Setup

1. Visit: `http://localhost:3000/api/test`
2. You should see: `{"success":true,"message":"Database connection successful","data":{"users":2,"suppliers":2,"products":2}}`

## Step 5: Verify Pages Work

1. Visit: `http://localhost:3000/suppliers`
2. You should see suppliers listed (no more error!)

## Troubleshooting

### If you still get errors:

1. **Check database connection:**
   ```bash
   # Test database connection
   curl http://localhost:3000/api/test
   ```

2. **Check if data exists:**
   ```bash
   # Run population script again
   npm run db:populate
   ```

3. **Check environment variables:**
   - Make sure `.env.local` exists
   - Make sure `DATABASE_URL` is correct
   - Restart the dev server after adding env vars

### Common Issues:

- **"Environment variable not found: DATABASE_URL"**
  - Create `.env.local` file with DATABASE_URL

- **"Connection refused"**
  - Check if PostgreSQL is running
  - Verify connection string is correct

- **"Schema 'trademart' does not exist"**
  - Run `npm run db:push` to create schema

## Quick Test Commands

```bash
# Test database connection
curl http://localhost:3000/api/test

# Test suppliers API
curl http://localhost:3000/api/suppliers

# Test products API  
curl http://localhost:3000/api/products

# Test RFQs API
curl http://localhost:3000/api/rfqs
```

## What Each Command Does

- `npm run db:generate` - Creates Prisma client for database access
- `npm run db:push` - Creates tables in your database
- `npm run db:populate` - Adds sample data (suppliers, products, RFQs)

## After Setup

Once everything is working:
- ✅ `/suppliers` - Shows real suppliers from database
- ✅ `/products` - Shows real products from database  
- ✅ `/rfqs` - Shows real RFQs from database
- ✅ `/supplier-dashboard` - Manage supplier data

The error should be gone and you'll see real data! 🎉
