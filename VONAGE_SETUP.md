# Vonage API Integration Setup

## Required Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Vonage API Configuration
VONAGE_API_KEY="your-vonage-api-key"
VONAGE_API_SECRET="your-vonage-api-secret"
VONAGE_SMS_FROM="TradeMart"
VONAGE_EMAIL_FROM="noreply@trademart.com"
```

## Getting Vonage API Credentials

1. **Sign up for Vonage API account**:
   - Go to [Vonage Developer Portal](https://developer.vonage.com/)
   - Create a free account

2. **Get API Key and Secret**:
   - Log in to your Vonage dashboard
   - Navigate to "API Settings" or "Account Settings"
   - Copy your API Key and API Secret

3. **Configure SMS Settings**:
   - Set `VONAGE_SMS_FROM` to your desired sender name (e.g., "TradeMart")
   - For production, you may need to register a dedicated sender ID

4. **Configure Email Settings**:
   - Set `VONAGE_EMAIL_FROM` to your verified email address
   - You may need to verify your domain with Vonage

## Features Implemented

- ✅ SMS OTP sending via Vonage SMS API
- ✅ Email OTP sending (with HTML template)
- ✅ OTP verification using Vonage Verify API
- ✅ Phone number formatting and validation
- ✅ Error handling and logging
- ✅ Development mode logging for testing
- ✅ Database integration for OTP storage
- ✅ Request ID tracking for enhanced verification

## Usage

The Vonage service is automatically integrated into the existing OTP flow in the signup process. Users can:

1. Choose between email or phone verification
2. Receive OTP via SMS or email
3. Verify the code within 10 minutes
4. Complete account registration

## API Endpoints

### Send OTP
- **Endpoint**: `POST /api/auth/send-otp`
- **Body**: 
  ```json
  {
    "method": "email" | "phone",
    "email": "user@example.com",
    "phone": "+1234567890"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "OTP sent successfully",
    "requestId": "unique-request-id",
    "otp": "123456" // Only in development
  }
  ```

### Verify OTP
- **Endpoint**: `POST /api/auth/verify-otp`
- **Body**: 
  ```json
  {
    "method": "email" | "phone",
    "email": "user@example.com",
    "phone": "+1234567890",
    "otp": "123456",
    "requestId": "unique-request-id" // Optional for phone verification
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "OTP verified successfully"
  }
  ```

## Testing

### Development Mode
In development mode, OTP codes are logged to the console for easy testing. No actual SMS/email will be sent.

### Production Mode
In production, actual SMS/email will be sent via Vonage API.

### Test Script
Run the test script to verify integration:
```bash
node test-vonage-integration.js
```

## Error Handling

The integration includes comprehensive error handling:
- Invalid API credentials
- Network connectivity issues
- Invalid phone numbers
- Rate limiting
- Expired OTP codes

## Security Features

- OTP codes expire after 10 minutes
- Codes are removed from database after verification
- Rate limiting to prevent abuse
- Secure phone number formatting

## Cost Considerations

- Vonage offers a free tier with limited messages
- SMS costs vary by country (typically $0.05-$0.15 per message)
- Email delivery is usually free or very low cost
- Monitor your usage in the Vonage dashboard

## Troubleshooting

### Common Issues

1. **"Invalid API Key"**: Check your Vonage credentials
2. **"Phone number format invalid"**: Ensure phone numbers include country code
3. **"Rate limit exceeded"**: Wait before sending another OTP
4. **"OTP expired"**: Generate a new OTP code

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## Production Deployment

1. Set up production Vonage account
2. Configure webhook endpoints if needed
3. Set up monitoring for OTP delivery rates
4. Configure rate limiting
5. Set up alerting for failed deliveries
