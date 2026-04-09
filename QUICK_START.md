# LinkedIn Deal Magnet - Quick Start Guide

## 🚀 From Zero to Launch in 30 Minutes

### Step 1: Get Resend API Key (5 min)
```bash
# 1. Go to https://resend.com
# 2. Sign up (free account)
# 3. Get API key from dashboard
# 4. Add to .env file
echo "RESEND_API_KEY=re_YourKeyHere" >> .env

# 5. Update email sender (edit utils/email.js line 66)
# Change: from: 'LinkedIn Deal Magnet <noreply@yourdomain.com>'
```

### Step 2: Configure Stripe Webhook (10 min)
```bash
# Local testing:
stripe listen --forward-to localhost:3000/api/webhook

# Copy the webhook secret (whsec_...) and add to .env:
echo "STRIPE_WEBHOOK_SECRET=whsec_YourSecretHere" >> .env

# For production:
# 1. Stripe Dashboard → Webhooks → Add endpoint
# 2. URL: https://yourdomain.com/api/webhook
# 3. Events: checkout.session.completed
# 4. Copy signing secret
```

### Step 3: Deploy to Vercel (15 min)
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy
vercel --prod

# Add env vars in Vercel dashboard:
# Settings → Environment Variables → Add all from .env
```

### Step 4: Test (5 min)
```bash
# 1. Visit your production URL
# 2. Go to /onboarding
# 3. Fill form with test data
# 4. Use test card: 4242 4242 4242 4242
# 5. Check email inbox
# 6. Visit /dashboard
```

## ✅ You're Live!

Your MVP is now deployed and accepting payments.

---

## 🐛 Quick Troubleshooting

**No email received?**
→ Check RESEND_API_KEY in Vercel env vars

**Payment not working?**
→ Check STRIPE_WEBHOOK_SECRET in Vercel env vars

**Audit fails?**
→ Check ANTHROPIC_API_KEY has credits

---

Read `DEPLOYMENT_GUIDE.md` for detailed instructions.
