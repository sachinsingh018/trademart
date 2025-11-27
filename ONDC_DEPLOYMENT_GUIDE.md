# ONDC Endpoints Deployment Guide

## Overview

This guide explains how to deploy the ONDC Buyer App callback endpoints to `ondc.tradepanda.ai` without affecting the main `www.tradepanda.ai` application.

## Created Endpoints

All endpoints are located in `app/api/ondc/` directory:

1. **POST /api/ondc/on_subscribe** - Registry subscription callback
2. **POST /api/ondc/on_search** - Search results callback
3. **POST /api/ondc/on_select** - Item selection callback
4. **POST /api/ondc/on_init** - Order initialization callback
5. **POST /api/ondc/on_confirm** - Order confirmation callback
6. **POST /api/ondc/on_status** - Order status updates callback
7. **POST /api/ondc/on_cancel** - Order cancellation callback
8. **POST /api/ondc/on_track** - Order tracking callback (optional)
9. **POST /api/ondc/on_update** - Order update callback (optional)

## File Structure

```
TradeMart/
├── app/
│   └── api/
│       └── ondc/                    # ONDC isolated endpoints
│           ├── on_subscribe/
│           │   └── route.ts
│           ├── on_search/
│           │   └── route.ts
│           ├── on_select/
│           │   └── route.ts
│           ├── on_init/
│           │   └── route.ts
│           ├── on_confirm/
│           │   └── route.ts
│           ├── on_status/
│           │   └── route.ts
│           ├── on_cancel/
│           │   └── route.ts
│           ├── on_track/
│           │   └── route.ts
│           └── on_update/
│               └── route.ts
└── lib/
    └── ondc/
        └── keys.ts                  # Signing keys helper
```

## Deployment Configuration

### Option 1: Vercel Subdomain (Recommended)

Since you're using Vercel, you can configure a separate subdomain:

1. **Add Custom Domain in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Domains
   - Add `ondc.tradepanda.ai` as a custom domain
   - Vercel will provide DNS records to configure

2. **Configure DNS:**
   - Add a CNAME record in your DNS provider:
     ```
     Type: CNAME
     Name: ondc
     Value: cname.vercel-dns.com (or value provided by Vercel)
     TTL: 3600
     ```

3. **SSL Certificate:**
   - Vercel automatically provisions SSL certificates for custom domains
   - Wait for SSL to be activated (usually 1-5 minutes)

4. **Environment Variables:**
   - Add ONDC-specific environment variables in Vercel:
     ```env
     ONDC_SUBSCRIBER_ID=ondc.tradepanda.ai
     ONDC_PRIVATE_KEY=your-private-key
     ONDC_PUBLIC_KEY=your-public-key
     ONDC_KEY_ID=ondc.tradepanda.ai-1
     ```

### Option 2: Next.js Rewrites (Alternative)

If you can't use a subdomain, you can use Next.js rewrites in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  // ... existing config
  async rewrites() {
    return [
      {
        source: '/ondc/:path*',
        destination: '/api/ondc/:path*',
      },
    ];
  },
};
```

Then access endpoints at: `https://www.tradepanda.ai/ondc/on_subscribe`

**Note:** This is less ideal as it doesn't provide proper isolation.

## Endpoint URLs After Deployment

Once deployed to `ondc.tradepanda.ai`, your endpoints will be:

- `https://ondc.tradepanda.ai/api/ondc/on_subscribe`
- `https://ondc.tradepanda.ai/api/ondc/on_search`
- `https://ondc.tradepanda.ai/api/ondc/on_select`
- `https://ondc.tradepanda.ai/api/ondc/on_init`
- `https://ondc.tradepanda.ai/api/ondc/on_confirm`
- `https://ondc.tradepanda.ai/api/ondc/on_status`
- `https://ondc.tradepanda.ai/api/ondc/on_cancel`
- `https://ondc.tradepanda.ai/api/ondc/on_track` (optional)
- `https://ondc.tradepanda.ai/api/ondc/on_update` (optional)

## Registry Subscription Endpoint

**For ONDC Registry subscription, use:**
```
https://ondc.tradepanda.ai/api/ondc/on_subscribe
```

This is the endpoint you'll provide to the ONDC Registry during subscription.

## Testing Endpoints

### Local Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test endpoints locally:
   ```bash
   # Test on_subscribe
   curl -X POST http://localhost:3000/api/ondc/on_subscribe \
     -H "Content-Type: application/json" \
     -d '{"status": "SUBSCRIBED"}'

   # Test health check
   curl http://localhost:3000/api/ondc/on_subscribe
   ```

### Production Testing

After deployment, test with:
```bash
# Test on_subscribe
curl -X POST https://ondc.tradepanda.ai/api/ondc/on_subscribe \
  -H "Content-Type: application/json" \
  -d '{"status": "SUBSCRIBED"}'

# Test health check
curl https://ondc.tradepanda.ai/api/ondc/on_subscribe
```

Expected response:
```json
{
  "status": "ok",
  "message": "Subscription acknowledged"
}
```

## Isolation from Main Application

The ONDC endpoints are isolated because:

1. **Separate Directory:** All ONDC endpoints are in `app/api/ondc/` - completely separate from existing routes
2. **No Route Conflicts:** None of the existing routes use `/ondc/` prefix
3. **Independent Logic:** Each endpoint is self-contained with its own route handler
4. **Subdomain Isolation:** Using `ondc.tradepanda.ai` subdomain provides complete separation

**Your existing routes remain unaffected:**
- `www.tradepanda.ai/api/products` ✅ Still works
- `www.tradepanda.ai/api/rfqs` ✅ Still works
- `www.tradepanda.ai/api/suppliers` ✅ Still works
- All other existing endpoints ✅ Still work

## Next Steps for ONDC Preprod Registry Subscription

### Step 1: Generate RSA Key Pair

1. Generate a 2048-bit RSA key pair:
   ```bash
   # Generate private key
   openssl genrsa -out ondc-private.pem 2048

   # Generate public key
   openssl rsa -in ondc-private.pem -pubout -out ondc-public.pem
   ```

2. Store keys securely:
   - Add to Vercel environment variables
   - Or use AWS Secrets Manager
   - Or use a secure key management service

3. Update `lib/ondc/keys.ts` to load keys from your chosen storage

### Step 2: Configure Public Key Endpoint

Create a public key endpoint at `/.well-known/ondc/keys`:

1. Create `app/.well-known/ondc/keys/route.ts`:
   ```typescript
   import { NextResponse } from 'next/server';
   import { getPublicKey, getKeyId } from '@/lib/ondc/keys';

   export async function GET() {
     const publicKey = await getPublicKey();
     const keyId = await getKeyId();

     return NextResponse.json({
       keys: [
         {
           keyId: keyId,
           publicKey: publicKey,
         },
       ],
     });
   }
   ```

2. This will be accessible at:
   `https://ondc.tradepanda.ai/.well-known/ondc/keys`

### Step 3: Register with ONDC Preprod Registry

1. **Access ONDC Preprod Registry:**
   - Go to: https://preprod.registry.ondc.org (or the provided registry URL)
   - Create an account or login

2. **Submit Subscription Request:**
   - Subscriber ID: `ondc.tradepanda.ai`
   - Subscriber Type: `BAP` (Buyer App)
   - Domain: `ONDC:RET10` (or your chosen domain)
   - City: Your city code
   - Country: Your country code (e.g., `IND`)

3. **Provide Callback URLs:**
   - `on_subscribe`: `https://ondc.tradepanda.ai/api/ondc/on_subscribe`
   - Public Key URL: `https://ondc.tradepanda.ai/.well-known/ondc/keys`

4. **Upload Public Key:**
   - Copy your public key from `ondc-public.pem`
   - Paste it in the registry form
   - Or provide the public key URL if supported

5. **Wait for Approval:**
   - ONDC Registry will review your subscription
   - Once approved, they will call your `on_subscribe` endpoint
   - Check your endpoint logs to confirm receipt

### Step 4: Verify Subscription

1. **Check Endpoint Logs:**
   - Monitor Vercel function logs
   - Look for `on_subscribe` callback from registry

2. **Test Endpoints:**
   - Use ONDC test tools to verify endpoints
   - Ensure all endpoints return `{ status: "ok" }`

3. **Update Environment Variables:**
   ```env
   ONDC_REGISTRY_URL=https://preprod.registry.ondc.org
   ONDC_ENV=preprod
   ONDC_SUBSCRIBER_ID=ondc.tradepanda.ai
   ```

### Step 5: Implement Business Logic

After subscription is confirmed, implement:

1. **Request Signing:**
   - Sign all outgoing requests to ONDC network
   - Use `lib/ondc/keys.ts` to load private key

2. **Response Verification:**
   - Verify BECKN headers on incoming callbacks
   - Validate signatures from seller apps

3. **Database Integration:**
   - Store ONDC orders in database
   - Link ONDC orders to your existing transaction system

4. **Frontend Integration:**
   - Create UI for ONDC search
   - Display ONDC order status
   - Handle real-time updates

## Security Considerations

1. **Key Storage:**
   - Never commit keys to git
   - Use environment variables or secure key management
   - Rotate keys periodically

2. **Signature Verification:**
   - Always verify BECKN headers
   - Validate request signatures
   - Reject unsigned requests

3. **Rate Limiting:**
   - Implement rate limiting on ONDC endpoints
   - Prevent abuse and DDoS attacks

4. **Logging:**
   - Log all ONDC requests and responses
   - Store logs securely for audit purposes

## Troubleshooting

### Endpoints Not Accessible

1. **Check DNS:**
   ```bash
   nslookup ondc.tradepanda.ai
   ```

2. **Check SSL:**
   - Verify SSL certificate is active
   - Check Vercel domain status

3. **Check Vercel Deployment:**
   - Verify deployment succeeded
   - Check function logs for errors

### Registry Subscription Fails

1. **Verify Endpoint:**
   - Test `on_subscribe` endpoint manually
   - Ensure it returns `{ status: "ok" }`

2. **Check Public Key:**
   - Verify public key is accessible
   - Test `/.well-known/ondc/keys` endpoint

3. **Check Logs:**
   - Review Vercel function logs
   - Look for error messages

## Support

For ONDC-specific questions:
- ONDC Documentation: https://docs.ondc.org
- ONDC Registry: https://preprod.registry.ondc.org
- ONDC Support: Check ONDC community forums

## Summary

✅ **Endpoints Created:** 9 ONDC callback endpoints  
✅ **Location:** `app/api/ondc/` (isolated from main app)  
✅ **Deployment:** Configure `ondc.tradepanda.ai` subdomain in Vercel  
✅ **Registry Endpoint:** `https://ondc.tradepanda.ai/api/ondc/on_subscribe`  
✅ **Next Steps:** Generate keys, configure public key endpoint, register with ONDC Registry

