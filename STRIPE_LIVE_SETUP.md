# Stripe Live Mode Setup (Production Keys)

**⚠️ WARNING: Using real money from the start**

---

## Prerequisites

Before using live mode:
- [ ] Stripe account fully activated (not restricted)
- [ ] Bank account connected for payouts
- [ ] Business details verified
- [ ] Ready to handle real customer support
- [ ] Refund process understood

---

## Step 1: Get Live API Keys

1. Go to: https://dashboard.stripe.com/apikeys
2. Toggle to **LIVE MODE** (top right - make sure it says "LIVE" not "TEST")
3. Reveal **Secret key** (starts with `sk_live_`)
4. Copy it

## Step 2: Update Vercel Environment Variables

### Required Keys:

```bash
cd /Users/ericcoffie/Linkedin\ App

# 1. Set live Stripe secret key
echo "sk_live_YOUR_KEY_HERE" | vercel env add STRIPE_SECRET_KEY production

# 2. Set live publishable key (if needed for frontend)
echo "pk_live_YOUR_KEY_HERE" | vercel env add STRIPE_PUBLISHABLE_KEY production
```

## Step 3: Create Live Webhook

1. Go to: https://dashboard.stripe.com/webhooks (make sure LIVE MODE)
2. Click **"Add endpoint"**
3. Endpoint URL:
   ```
   https://linkedin-deal-magnet.vercel.app/api/webhook
   ```
4. Select events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created` (optional)
   - ✅ `customer.subscription.deleted` (optional)
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`)

## Step 4: Set Webhook Secret

```bash
echo "whsec_YOUR_LIVE_SECRET_HERE" | vercel env add STRIPE_WEBHOOK_SECRET production
```

## Step 5: Verify Price IDs

Check your Stripe dashboard for live price IDs:

1. Go to: https://dashboard.stripe.com/products (LIVE MODE)
2. Find or create product: "LinkedIn Profile Rewrite - $97"
3. Get the price ID (starts with `price_`)
4. Update local `.env`:

```bash
STRIPE_PRICE_FULL_FIX=price_YOUR_LIVE_PRICE_ID
```

## Step 6: Deploy with Live Keys

```bash
vercel --prod
```

---

## 🧪 CRITICAL: Test with Small Real Payment First

**DO NOT skip this** - even with live keys, test first:

### Safe Testing Strategy:

1. **Create $1 test product** in Stripe dashboard:
   - Name: "Test - Delete After"
   - Price: $1.00
   - Get price ID

2. **Temporarily modify code** to use $1 product:
   - Edit `server.js` line 2128
   - Change `price_1SedI3K5zyiZ50PBOx0luGnq` to your $1 test price
   - Deploy

3. **Run real $1 test**:
   - Complete audit
   - Pay $1 with your real card
   - Verify webhook fires
   - Check audit marked as paid
   - Confirm email arrives

4. **If test passes**:
   - Refund the $1 in Stripe dashboard
   - Change price back to $97
   - Deploy again
   - Ready for real customers

5. **If test fails**:
   - Fix the issue
   - Refund the $1
   - Repeat until it works

---

## Monitoring Checklist (First 24 Hours)

When using real payments:

- [ ] Keep Vercel logs open: `vercel logs --follow`
- [ ] Monitor Stripe dashboard: https://dashboard.stripe.com/payments
- [ ] Check email inbox for Resend deliveries
- [ ] Watch Supabase dashboard for database updates
- [ ] Have refund process ready
- [ ] Respond to support emails within 1 hour

---

## Emergency Procedures

### If Webhook Fails:
1. Check Vercel logs for error message
2. Check Stripe webhook attempts (shows failed deliveries)
3. Manually mark audit as paid in Supabase
4. Manually send email via Resend dashboard
5. Refund customer if can't resolve quickly

### If Email Fails:
1. Check Resend dashboard for delivery status
2. Check spam folder
3. Manually forward audit results
4. Fix issue before next payment

### If Database Fails:
1. Check Supabase logs
2. Verify connection not rate limited
3. Export audit data from webhook logs
4. Manually insert to database
5. Refund if data lost

---

## Quick Refund Process

If something goes wrong:

```bash
# Find payment in Stripe dashboard
https://dashboard.stripe.com/payments

# Click the payment
# Click "Refund payment"
# Select "Full refund"
# Add reason: "Technical issue - sorry for inconvenience"
```

Then email customer explaining the issue.

---

## Confidence Checklist

Only use live keys if you can answer YES to all:

- [ ] I've tested the audit flow end-to-end
- [ ] I've verified email sending works
- [ ] I've confirmed database saves correctly
- [ ] I understand how to refund in Stripe
- [ ] I can monitor logs in real-time
- [ ] I'm ready to provide customer support
- [ ] I have time to watch the first few payments
- [ ] I'm okay with potential refunds

---

## Alternative: Start with $1 Live Price

**Compromise approach:**

1. Launch with $1 price (real payment, low risk)
2. Monitor first 10 customers
3. Fix any issues that come up
4. Once confident, raise to $97
5. Much safer than going straight to $97

This way you're using real Stripe keys but limiting financial risk.

---

## Current Price IDs (from .env)

Update these to your LIVE price IDs:

```bash
STRIPE_PRICE_FULL_FIX=price_1SedI3K5zyiZ50PBOx0luGnq  # ← Update to live price
STRIPE_PRICE_CONTENT_ENGINE=price_1SedJZK5zyiZ50PBwJ4Sy4Qb  # ← Update to live price
STRIPE_PRICE_PRO_MONTHLY=price_1TCK9oK5zyiZ50PBotTne3pw  # ← Update to live price
```

---

**Recommendation:** Use live keys BUT start with $1 test product for first few transactions. Once confident, switch to $97.

**Last Updated:** April 8, 2026
