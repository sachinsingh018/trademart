# 🚀 AWS Integration Guide for TradeMart

This guide explains how to integrate AWS services for email and SMS OTP verification in TradeMart.

## 📋 Required AWS Services

### 1. Amazon SES (Simple Email Service)
- **Purpose**: Send verification emails and welcome emails
- **Cost**: Free tier includes 62,000 emails/month
- **Setup**: Requires domain verification for production

### 2. Amazon SNS (Simple Notification Service)
- **Purpose**: Send SMS OTP codes
- **Cost**: ~$0.75 per 100 SMS messages
- **Setup**: Requires phone number verification

## 🔧 Setup Instructions

### Step 1: AWS Account Setup

1. Create an AWS account at [aws.amazon.com](https://aws.amazon.com)
2. Navigate to IAM (Identity and Access Management)
3. Create a new user with programmatic access
4. Attach the following policies:
   - `AmazonSESFullAccess`
   - `AmazonSNSFullAccess`

### Step 2: Environment Variables

Add these to your `.env.local` file:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# SES Configuration
FROM_EMAIL=noreply@yourdomain.com
SES_VERIFIED_EMAIL=your-verified-email@domain.com

# SNS Configuration (optional)
SNS_PHONE_NUMBER=+1234567890
```

### Step 3: Install AWS SDK

```bash
npm install @aws-sdk/client-ses @aws-sdk/client-sns
```

### Step 4: Update API Routes

The API routes are already prepared for AWS integration. Simply uncomment the AWS code in:

- `/app/api/auth/send-otp/route.ts`
- `/app/api/auth/register/route.ts`

## 📧 Email Setup (SES)

### Development Setup
1. Go to AWS SES Console
2. Verify your email address in "Verified identities"
3. Move out of sandbox mode for production

### Production Setup
1. Verify your domain
2. Set up DKIM authentication
3. Configure SPF and DMARC records
4. Request production access

### Email Templates

The system includes these email types:
- **Verification Email**: OTP code for account verification
- **Welcome Email**: Welcome message after successful registration
- **Password Reset**: OTP for password reset (future feature)

## 📱 SMS Setup (SNS)

### Phone Number Verification
1. Go to AWS SNS Console
2. Navigate to "Phone numbers"
3. Add and verify your phone number
4. Note: You can only send SMS to verified numbers in sandbox mode

### Production Setup
1. Request SMS spending limit increase
2. Verify your identity
3. Enable SMS for your region

## 🔄 Integration Steps

### 1. Uncomment AWS Code

In `/app/api/auth/send-otp/route.ts`:

```typescript
// Uncomment these imports
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Uncomment the AWS service calls
const sesClient = new SESClient({ region: process.env.AWS_REGION });
const snsClient = new SNSClient({ region: process.env.AWS_REGION });
```

### 2. Update Database Schema

Add phone field to User model in `prisma/schema.prisma`:

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  phone         String?   // Add this field
  passwordHash  String?   @map("password_hash")
  role          String    @default("buyer")
  createdAt     DateTime  @default(now()) @map("created_at")
  // ... rest of the fields
}
```

### 3. Run Database Migration

```bash
npx prisma db push
npx prisma generate
```

## 🧪 Testing

### Development Mode
- OTP codes are logged to console
- No actual emails/SMS sent
- Use test credentials

### Production Mode
- Real emails/SMS sent
- Requires verified identities
- Monitor usage and costs

## 💰 Cost Optimization

### Email (SES)
- Free tier: 62,000 emails/month
- Additional: $0.10 per 1,000 emails
- Use email templates to reduce costs

### SMS (SNS)
- ~$0.75 per 100 SMS messages
- Consider email-first verification
- Implement rate limiting

## 🔒 Security Best Practices

1. **Rate Limiting**: Implement OTP request limits
2. **Expiration**: OTP codes expire in 10 minutes
3. **One-time Use**: OTP codes are deleted after verification
4. **Validation**: Always validate OTP on server side
5. **Logging**: Log all OTP attempts for monitoring

## 🚨 Error Handling

The system includes comprehensive error handling for:
- AWS service failures
- Invalid credentials
- Rate limiting
- Network timeouts
- Invalid phone numbers/emails

## 📊 Monitoring

### CloudWatch Metrics
- Monitor SES bounce rates
- Track SNS delivery success
- Set up alarms for failures

### Application Logs
- OTP generation attempts
- Verification successes/failures
- AWS service errors

## 🔄 Future Enhancements

1. **Email Templates**: Use SES templates for better formatting
2. **SMS Templates**: Customize SMS messages
3. **Multi-language**: Support multiple languages
4. **Analytics**: Track verification success rates
5. **A/B Testing**: Test different OTP formats

## 🆘 Troubleshooting

### Common Issues

1. **SES Sandbox**: Can only send to verified emails
2. **SNS Sandbox**: Can only send to verified phone numbers
3. **Rate Limits**: AWS has default rate limits
4. **Region Mismatch**: Ensure region consistency

### Debug Mode

Enable debug logging:

```env
DEBUG_AWS=true
```

This will log all AWS API calls and responses.

## 📞 Support

- AWS SES Documentation: https://docs.aws.amazon.com/ses/
- AWS SNS Documentation: https://docs.aws.amazon.com/sns/
- TradeMart Support: [Your support contact]

---

**Note**: This integration is designed to be easily toggleable. You can switch between development (console logging) and production (AWS services) modes by simply commenting/uncommenting the relevant code sections.
