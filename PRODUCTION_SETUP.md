# Production Deployment Guide

## Environment Variables Required

Create a `.env.local` file with the following production values:

```bash
# NextAuth Configuration (CRITICAL)
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-super-secure-secret-key-32-chars-minimum

# Database (CRITICAL)
DATABASE_URL="postgresql://username:password@your-db-host:5432/trademart_production"

# Google OAuth (Required for Google sign-in)
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret

# Vonage SMS/Email Service (Required for OTP functionality)
VONAGE_API_KEY=your-actual-vonage-api-key
VONAGE_API_SECRET=your-actual-vonage-api-secret
VONAGE_SIGNATURE_SECRET=your-actual-vonage-signature-secret

# AWS Configuration (For production features)
AWS_ACCESS_KEY_ID=your-actual-aws-access-key
AWS_SECRET_ACCESS_KEY=your-actual-aws-secret-key
AWS_REGION=us-east-1

# Application Environment
NODE_ENV=production
```

## Production Checklist

### ✅ Security
- [ ] Use HTTPS in production
- [ ] Generate a strong NEXTAUTH_SECRET (32+ characters)
- [ ] Use production database (PostgreSQL recommended)
- [ ] Set up proper CORS policies
- [ ] Enable security headers (already configured in next.config.ts)

### ✅ OTP/SMS Service
- [ ] Get real Vonage API credentials
- [ ] Test SMS/Email delivery in production
- [ ] Set up proper error monitoring
- [ ] Configure rate limiting for OTP requests

### ✅ Database
- [ ] Set up production PostgreSQL database
- [ ] Run database migrations: `npm run db:migrate`
- [ ] Set up database backups
- [ ] Configure connection pooling

### ✅ Authentication
- [ ] Set up Google OAuth credentials
- [ ] Configure OAuth redirect URLs
- [ ] Test login flows

### ✅ Monitoring & Logging
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure logging service
- [ ] Set up performance monitoring

### ✅ Deployment
- [ ] Use a proper hosting service (Vercel, AWS, etc.)
- [ ] Set up CI/CD pipeline
- [ ] Configure environment variables in hosting platform
- [ ] Set up SSL certificates

## Current Status

### ✅ Ready for Production:
- Graceful error handling
- Proper fallbacks for missing services
- Security headers configured
- Input validation
- Password hashing

### ⚠️ Needs Configuration:
- Real Vonage API credentials
- Production database setup
- Google OAuth credentials
- Proper environment variables

### 🔧 Development Features (Safe for Production):
- Mock OTP system falls back gracefully
- Console logging for development
- Proper error messages

## Quick Production Deploy

1. Set up production database
2. Update environment variables with real credentials
3. Run `npm run build`
4. Deploy to your hosting platform
5. Test all functionality

The application is designed to work in production even if some services (like Vonage) are not fully configured - it will fall back to mock mode gracefully.
