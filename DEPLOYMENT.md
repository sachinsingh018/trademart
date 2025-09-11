# 🚀 TradeMart Vercel Deployment Guide

## Prerequisites
- Vercel account (free tier available)
- GitHub repository with your code
- Neon DB account (or any PostgreSQL database)

## Step 1: Push to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub and push your code:
```bash
git remote add origin https://github.com/yourusername/trademart.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project
5. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Step 3: Configure Environment Variables

In your Vercel dashboard:

1. Go to your project → Settings → Environment Variables
2. Add the following variables:

### Required Variables:

```env
DATABASE_URL=postgresql://neondb_owner:npg_Maus8bK6kdvD@ep-cold-forest-a4yns4nq-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

```env
NEXTAUTH_URL=https://your-app-name.vercel.app
```

```env
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random
```

### Optional Variables (for Google OAuth):

```env
GOOGLE_CLIENT_ID=your-google-client-id
```

```env
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Step 4: Database Setup

After deployment, you need to set up your database:

1. Go to your Vercel project dashboard
2. Open the terminal (or use Vercel CLI locally)
3. Run the following commands:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database
npx prisma db seed
```

## Step 5: Update Google OAuth (if using)

If you're using Google OAuth, update your Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 client
4. Add your Vercel domain to authorized redirect URIs:
   - `https://your-app-name.vercel.app/api/auth/callback/google`

## Step 6: Test Your Deployment

1. Visit your deployed URL: `https://your-app-name.vercel.app`
2. Test the sign-in functionality
3. Create test accounts and verify everything works

## Troubleshooting

### Build Errors
- Check that all dependencies are in `package.json`
- Ensure TypeScript compilation passes locally
- Check Vercel build logs for specific errors

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure your database allows connections from Vercel's IP ranges
- Check if your database has SSL requirements

### Authentication Issues
- Verify `NEXTAUTH_URL` matches your domain exactly
- Ensure `NEXTAUTH_SECRET` is set
- Check Google OAuth redirect URIs if using Google sign-in

### Environment Variables Not Loading
- Make sure variables are added in Vercel dashboard
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

## Production Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] Environment variables configured
- [ ] Database schema pushed
- [ ] Database seeded with test data
- [ ] Google OAuth configured (if using)
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate active
- [ ] Application tested end-to-end

## Performance Optimization

- Enable Vercel Analytics
- Configure caching headers
- Optimize images with Next.js Image component
- Use Vercel Edge Functions for better performance

## Monitoring

- Set up Vercel Analytics
- Monitor error logs in Vercel dashboard
- Set up uptime monitoring
- Configure alerts for critical issues

---

**Your TradeMart app should now be live at: `https://your-app-name.vercel.app`** 🎉

For support, check the Vercel documentation or create an issue in your repository.
