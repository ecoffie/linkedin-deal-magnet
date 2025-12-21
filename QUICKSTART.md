# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
GROK_API_KEY=xai-aQUAgUbj6jKHy5eBPk4E07iFdK8O8ALwEHIf6hTjCI53oUuBpSy8OoVv3LTDl0h3EhIb3YoWR124FzGr
GROK_MODEL=grok-2-1212
STRIPE_SECRET_KEY=sk_test_...  # Get from Stripe Dashboard
STRIPE_PRICE_FULL_FIX=price_...  # Create product in Stripe first
STRIPE_PRICE_CONTENT_ENGINE=price_...  # Create subscription in Stripe first
```

### 3. Set Up Stripe Products

**One-time Payment ($97):**
1. Go to https://dashboard.stripe.com/products
2. Click "Add product"
3. Name: "Full Fix Guide"
4. Pricing: One-time, $97.00 USD
5. Copy the Price ID (starts with `price_`)
6. Add to `.env` as `STRIPE_PRICE_FULL_FIX`

**Subscription ($47/month):**
1. Click "Add product" again
2. Name: "Content Engine"
3. Pricing: Recurring, $47.00 USD, Monthly
4. Copy the Price ID
5. Add to `.env` as `STRIPE_PRICE_CONTENT_ENGINE`

### 4. Run Locally
```bash
npm run dev
```

Visit http://localhost:3000

### 5. Test the Flow

1. **Homepage**: Should load with hero, stats, and form
2. **Audit**: Paste a LinkedIn URL and click "Run Free Audit"
3. **Results**: Should show score, headline comparison, and fixes
4. **Checkout**: Click "Get Full Fix Guide" to test Stripe (use test mode)

## 🐛 Troubleshooting

**"Module not found" errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**LinkedIn scraping not working:**
- The app will use default recommendations if scraping fails
- This is normal in development - scraping works better in production

**Grok API errors:**
- Check your API key is correct
- Try the default fixes - they're comprehensive and work well

**Stripe checkout errors:**
- Make sure Price IDs are correct
- Test with Stripe test mode first
- Check Stripe dashboard for error logs

## 📦 What's Included

- ✅ Beautiful homepage with hero, stats, benefits
- ✅ Free audit flow with AI analysis
- ✅ LinkedIn profile scraping
- ✅ Grok API integration
- ✅ Stripe payment integration
- ✅ Responsive design
- ✅ Ready for Vercel/Render deployment

## 🎯 Next Steps

1. Test the full flow end-to-end
2. Customize the design/colors if needed
3. Set up webhooks (optional) for Stripe
4. Deploy to Vercel or Render
5. Update analytics/tracking if needed

## 💡 Pro Tips

- Use Stripe test mode until you're ready for production
- The default fixes are comprehensive - test those first
- LinkedIn scraping works better with real profiles
- Monitor Grok API usage - it has rate limits










