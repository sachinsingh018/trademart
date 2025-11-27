# ONDC Implementation Summary

## ✅ Implementation Complete

All ONDC Buyer App callback endpoints have been created and are ready for deployment.

---

## 📁 Files Created

### ONDC Callback Endpoints (9 endpoints)
1. `app/api/ondc/on_subscribe/route.ts` - Registry subscription callback
2. `app/api/ondc/on_search/route.ts` - Search results callback
3. `app/api/ondc/on_select/route.ts` - Item selection callback
4. `app/api/ondc/on_init/route.ts` - Order initialization callback
5. `app/api/ondc/on_confirm/route.ts` - Order confirmation callback
6. `app/api/ondc/on_status/route.ts` - Order status updates callback
7. `app/api/ondc/on_cancel/route.ts` - Order cancellation callback
8. `app/api/ondc/on_track/route.ts` - Order tracking callback (optional)
9. `app/api/ondc/on_update/route.ts` - Order update callback (optional)

### Helper Files
10. `lib/ondc/keys.ts` - Signing keys helper (with placeholder implementation)
11. `app/.well-known/ondc/keys/route.ts` - Public key endpoint for registry

### Documentation
12. `ONDC_DEPLOYMENT_GUIDE.md` - Complete deployment instructions

---

## 🎯 Answers to Your Questions

### 1. Which file to deploy at `https://ondc.tradepanda.ai/on_subscribe`?

**Answer:** The endpoint is already created at:
```
app/api/ondc/on_subscribe/route.ts
```

**Deployed URL will be:**
```
https://ondc.tradepanda.ai/api/ondc/on_subscribe
```

**Note:** Next.js App Router automatically routes `/api/ondc/on_subscribe` to this file. The endpoint handles both:
- `POST /api/ondc/on_subscribe` - For ONDC Registry callbacks
- `GET /api/ondc/on_subscribe` - For health checks

---

### 2. How to expose these routes under a new subdomain without affecting www.tradepanda.ai?

**Answer:** Use Vercel's custom domain feature:

#### Step-by-Step Instructions:

1. **Add Custom Domain in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to: **Settings → Domains**
   - Click **Add Domain**
   - Enter: `ondc.tradepanda.ai`
   - Click **Add**

2. **Configure DNS:**
   - Vercel will provide DNS records (usually a CNAME)
   - Go to your DNS provider (where `tradepanda.ai` is managed)
   - Add a new CNAME record:
     ```
     Type: CNAME
     Name: ondc
     Value: [value provided by Vercel, e.g., cname.vercel-dns.com]
     TTL: 3600
     ```

3. **Wait for SSL:**
   - Vercel automatically provisions SSL certificates
   - Wait 1-5 minutes for SSL to activate
   - Check Vercel dashboard for SSL status

4. **Verify Deployment:**
   - Once DNS propagates, test:
     ```bash
     curl https://ondc.tradepanda.ai/api/ondc/on_subscribe
     ```
   - Should return: `{"status":"ok","message":"ONDC on_subscribe endpoint is active",...}`

#### Why This Works:

- **Complete Isolation:** `ondc.tradepanda.ai` is a separate subdomain
- **Same Codebase:** Both domains point to the same Vercel project
- **No Conflicts:** Next.js routes are path-based, not domain-based
- **Automatic Routing:** Next.js automatically serves the correct routes
- **www.tradepanda.ai Unaffected:** Your main domain continues to work normally

#### Alternative: If you need separate deployments

If you want complete separation (different codebases), you can:
1. Create a separate Vercel project
2. Deploy only the ONDC endpoints
3. Point `ondc.tradepanda.ai` to the new project

**But this is not necessary** - the current approach is simpler and recommended.

---

### 3. List of next steps to complete ONDC preprod registry subscription

**Answer:** Follow these steps in order:

#### Step 1: Generate RSA Key Pair (Required)

```bash
# Generate 2048-bit private key
openssl genrsa -out ondc-private.pem 2048

# Generate public key from private key
openssl rsa -in ondc-private.pem -pubout -out ondc-public.pem

# View the keys (for copying to environment variables)
cat ondc-private.pem
cat ondc-public.pem
```

**Store keys securely:**
- Add to Vercel environment variables (recommended)
- Or use AWS Secrets Manager
- Or use a secure key management service

#### Step 2: Configure Environment Variables in Vercel

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables** and add:

```env
ONDC_SUBSCRIBER_ID=ondc.tradepanda.ai
ONDC_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n[your private key]\n-----END PRIVATE KEY-----
ONDC_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\n[your public key]\n-----END PUBLIC KEY-----
ONDC_KEY_ID=ondc.tradepanda.ai-1
ONDC_ENV=preprod
ONDC_REGISTRY_URL=https://preprod.registry.ondc.org
```

**Important:** 
- For multi-line keys, use `\n` for newlines in environment variables
- Or use Vercel's multi-line environment variable feature

#### Step 3: Update Keys Helper (Optional)

The `lib/ondc/keys.ts` file is already set up to load keys from environment variables. If you're using a different storage method (AWS Secrets Manager, etc.), update the `loadOndcKeys()` function.

#### Step 4: Deploy to Vercel

```bash
# Push code to your repository
git add .
git commit -m "Add ONDC callback endpoints"
git push

# Vercel will auto-deploy, or deploy manually:
vercel --prod
```

#### Step 5: Verify Public Key Endpoint

Test that your public key is accessible:

```bash
curl https://ondc.tradepanda.ai/.well-known/ondc/keys
```

Expected response:
```json
{
  "keys": [
    {
      "keyId": "ondc.tradepanda.ai-1",
      "publicKey": "-----BEGIN PUBLIC KEY-----\n..."
    }
  ]
}
```

#### Step 6: Register with ONDC Preprod Registry

1. **Access Registry:**
   - Go to: https://preprod.registry.ondc.org
   - Create account or login

2. **Submit Subscription Request:**
   - **Subscriber ID:** `ondc.tradepanda.ai`
   - **Subscriber Type:** `BAP` (Buyer App)
   - **Domain:** `ONDC:RET10` (or your chosen domain)
   - **City:** Your city code (e.g., `std:080` for standard city)
   - **Country:** `IND` (or your country code)

3. **Provide Callback URLs:**
   - **on_subscribe:** `https://ondc.tradepanda.ai/api/ondc/on_subscribe`
   - **Public Key URL:** `https://ondc.tradepanda.ai/.well-known/ondc/keys`

4. **Upload Public Key:**
   - Copy public key from `ondc-public.pem`
   - Paste in registry form
   - Or provide the public key URL if the registry supports it

5. **Submit and Wait:**
   - Submit the subscription request
   - Wait for ONDC Registry approval (usually 1-3 business days)
   - Registry will call your `on_subscribe` endpoint when approved

#### Step 7: Verify Subscription

1. **Check Endpoint Logs:**
   - Go to Vercel Dashboard → Your Project → Functions
   - Check logs for `on_subscribe` endpoint
   - Look for callback from ONDC Registry

2. **Test Endpoints:**
   - Use ONDC test tools to verify all endpoints
   - Ensure all endpoints return `{ status: "ok" }`

3. **Monitor Callbacks:**
   - Set up logging/monitoring for ONDC endpoints
   - Track all incoming callbacks from the network

#### Step 8: Implement Business Logic (Post-Subscription)

After subscription is confirmed:

1. **Implement Request Signing:**
   - Sign all outgoing requests to ONDC network
   - Use `lib/ondc/keys.ts` to load private key
   - Add BECKN headers to requests

2. **Implement Response Verification:**
   - Verify BECKN headers on incoming callbacks
   - Validate signatures from seller apps
   - Reject unsigned/invalid requests

3. **Database Integration:**
   - Create database tables for ONDC orders
   - Store ONDC order data
   - Link ONDC orders to your existing transaction system

4. **Frontend Integration:**
   - Create UI for ONDC search
   - Display ONDC order status
   - Handle real-time updates via WebSocket/SSE

---

## 🔒 Security Checklist

- [ ] RSA keys generated (2048-bit minimum)
- [ ] Private key stored securely (not in git)
- [ ] Public key endpoint accessible
- [ ] Environment variables configured
- [ ] Signature verification implemented (TODO)
- [ ] Request signing implemented (TODO)
- [ ] Rate limiting configured (TODO)
- [ ] Logging enabled for audit trail

---

## 📊 Endpoint Status

| Endpoint | Status | URL |
|----------|--------|-----|
| on_subscribe | ✅ Created | `/api/ondc/on_subscribe` |
| on_search | ✅ Created | `/api/ondc/on_search` |
| on_select | ✅ Created | `/api/ondc/on_select` |
| on_init | ✅ Created | `/api/ondc/on_init` |
| on_confirm | ✅ Created | `/api/ondc/on_confirm` |
| on_status | ✅ Created | `/api/ondc/on_status` |
| on_cancel | ✅ Created | `/api/ondc/on_cancel` |
| on_track | ✅ Created (optional) | `/api/ondc/on_track` |
| on_update | ✅ Created (optional) | `/api/ondc/on_update` |
| Public Key | ✅ Created | `/.well-known/ondc/keys` |

---

## 🧪 Testing

### Local Testing

```bash
# Start dev server
npm run dev

# Test on_subscribe
curl -X POST http://localhost:3000/api/ondc/on_subscribe \
  -H "Content-Type: application/json" \
  -d '{"status": "SUBSCRIBED"}'

# Test public key endpoint
curl http://localhost:3000/.well-known/ondc/keys
```

### Production Testing

```bash
# Test on_subscribe
curl -X POST https://ondc.tradepanda.ai/api/ondc/on_subscribe \
  -H "Content-Type: application/json" \
  -d '{"status": "SUBSCRIBED"}'

# Test public key
curl https://ondc.tradepanda.ai/.well-known/ondc/keys
```

---

## ✅ Verification Checklist

Before submitting to ONDC Registry:

- [ ] All endpoints return `{ status: "ok" }`
- [ ] Public key endpoint is accessible
- [ ] DNS configured for `ondc.tradepanda.ai`
- [ ] SSL certificate active
- [ ] Environment variables set
- [ ] Endpoints tested locally
- [ ] Endpoints tested in production
- [ ] Logging configured
- [ ] Error handling implemented

---

## 📝 Notes

1. **No Breaking Changes:** All ONDC endpoints are isolated in `app/api/ondc/` - your existing routes are unaffected.

2. **Modular Design:** Each endpoint is self-contained and can be extended independently.

3. **Placeholder Implementation:** Business logic is marked with `TODO` comments - implement as needed.

4. **Key Management:** The keys helper supports multiple storage methods - update as per your infrastructure.

5. **Optional Endpoints:** `on_track` and `on_update` are optional - implement if needed for your use case.

---

## 🆘 Support

- **ONDC Documentation:** https://docs.ondc.org
- **ONDC Registry:** https://preprod.registry.ondc.org
- **Vercel Docs:** https://vercel.com/docs
- **Next.js API Routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

## 🎉 Summary

✅ **9 ONDC callback endpoints created**  
✅ **Isolated in `app/api/ondc/` directory**  
✅ **No impact on existing `www.tradepanda.ai` routes**  
✅ **Ready for deployment to `ondc.tradepanda.ai` subdomain**  
✅ **Public key endpoint configured**  
✅ **Signing keys helper created**  
✅ **Complete deployment guide provided**

**Next Action:** Generate RSA keys and configure Vercel subdomain, then register with ONDC Preprod Registry.

