# LinkedIn Deal Magnet - Deployment Guide

## ✅ What's Complete

All core functionality is built and ready to deploy!

### Backend
- ✅ `/api/audit-manual` - Profile analysis with Claude API
- ✅ `/api/create-checkout-session` - Stripe checkout
- ✅ `/api/webhook` - Payment confirmation
- ✅ `/api/audit/:id` - Retrieve audit by ID
- ✅ `/api/audits-by-email` - Dashboard data
- ✅ Rate limiting (5 audits/email/day)
- ✅ Email sending (Resend)

### Frontend
- ✅ `onboarding.html` - Main flow
- ✅ `dashboard.html` - View past audits
- ✅ Landing & success pages

---

## 🚦 Required Setup (3 Steps)

### 1. Get Resend API Key (5 min)

1. Go to resend.com → Sign up
2. Get API key
3. Add to `.env`: `RESEND_API_KEY=re_...`
4. Update `utils/email.js` line 66 with your domain

### 2. Configure Stripe Webhook (10 min)

**Local Testing:**
```bash
stripe listen --forward-to localhost:3000/api/webhook
# Copy webhook secret to .env
```

**Production:**
- Stripe Dashboard → Webhooks → Add endpoint
- URL: `https://yourdomain.com/api/webhook`
- Events: `checkout.session.completed`
- Copy secret to env vars

### 3. Deploy to Vercel (15 min)

```bash
vercel --prod
```

Add all env vars from `.env` in Vercel dashboard.

---

## ✅ Testing Checklist

- [ ] Submit audit with test data
- [ ] Click $97 button → Use card `4242 4242 4242 4242`
- [ ] Check email received
- [ ] View dashboard
- [ ] Mobile responsive check

---

*Last Updated: April 5, 2026*
