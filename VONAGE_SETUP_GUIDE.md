# Vonage SMS OTP Setup Guide

## Quick Setup for Real SMS OTP

### Step 1: Get Vonage Account
1. Go to https://vonage.com
2. Sign up for a free account
3. Verify your email and phone number

### Step 2: Get API Credentials
1. Go to https://dashboard.nexmo.com/
2. Navigate to "Getting Started" → "Your API Key"
3. Copy your:
   - **API Key**
   - **API Secret**

### Step 3: Enable Verify API
1. In the Vonage dashboard, go to "Products" → "Verify"
2. Click "Get Started" or "Enable"
3. This gives you access to the Verify API for SMS OTP

### Step 4: Update Environment Variables
Replace the placeholder values in `.env.local`:

```bash
# Replace these with your real Vonage credentials
VONAGE_API_KEY=your_actual_api_key_here
VONAGE_API_SECRET=your_actual_api_secret_here
VONAGE_SIGNATURE_SECRET=your_signature_secret_here  # Optional
```

### Step 5: Test Real SMS
1. Restart your development server: `npm run dev`
2. Go to the signup page
3. Enter a real phone number
4. Click "Send OTP"
5. You should receive a real SMS with the OTP code

## Free Tier Limits
- **Free account**: 50 SMS messages per month
- **Paid plans**: Start from $0.005 per SMS

## Alternative: Use Your Own Vonage Credentials
If you already have Vonage credentials, just update the `.env.local` file:

```bash
VONAGE_API_KEY=your_existing_api_key
VONAGE_API_SECRET=your_existing_api_secret
```

## Troubleshooting
- Make sure your Vonage account is verified
- Check that the Verify API is enabled in your dashboard
- Ensure your phone number format is correct (+1234567890)
- Check the Vonage dashboard for delivery logs

## Cost Considerations
- Vonage offers free credits for new accounts
- SMS costs vary by country (usually $0.005-$0.01 per SMS)
- Email delivery is usually free or very cheap
