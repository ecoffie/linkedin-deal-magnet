# Deployment Guide

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your actual keys.

3. **Set up Stripe Products**

   Go to [Stripe Dashboard](https://dashboard.stripe.com/products):
   
   a. Create Product: "Full Fix Guide"
      - Type: One-time payment
      - Price: $97.00 USD
      - Copy the Price ID (starts with `price_`)
      - Add to `.env` as `STRIPE_PRICE_FULL_FIX`
   
   b. Create Product: "Content Engine"
      - Type: Recurring
      - Price: $47.00 USD
      - Billing period: Monthly
      - Copy the Price ID
      - Add to `.env` as `STRIPE_PRICE_CONTENT_ENGINE`

4. **Run locally**
   ```bash
   npm run dev
   ```

## Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Add environment variables:
   ```bash
   vercel env add GROK_API_KEY
   vercel env add STRIPE_SECRET_KEY
   vercel env add STRIPE_PRICE_FULL_FIX
   vercel env add STRIPE_PRICE_CONTENT_ENGINE
   ```

4. Deploy:
   ```bash
   vercel --prod
   ```

Or connect your GitHub repo in the Vercel dashboard for automatic deployments.

## Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `linkedin-deal-magnet`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free or Starter ($7/mo)

5. Add Environment Variables:
   - `GROK_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_FULL_FIX`
   - `STRIPE_PRICE_CONTENT_ENGINE`
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (auto-set by Render)

6. Click "Create Web Service"

## Testing

After deployment, test:
1. Homepage loads
2. Submit a LinkedIn URL in the audit form
3. Results display with score and fixes
4. Stripe checkout buttons work (use test mode first)

## Troubleshooting

**LinkedIn scraping fails:**
- The app falls back to default recommendations
- Consider using a paid LinkedIn scraping service for production

**Grok API errors:**
- Check your API key is correct
- Ensure you have API credits
- The app provides default fixes if API fails

**Stripe checkout not working:**
- Verify Price IDs are correct
- Check Stripe webhook is configured (optional, for webhook events)
- Test in Stripe test mode first










