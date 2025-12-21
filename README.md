# LinkedIn Deal Magnet

Turn Your LinkedIn Into a Deal Magnet - AI-powered LinkedIn optimization SaaS for government contractors.

## Features

- **Free LinkedIn Profile Audit** - Get AI-powered analysis of your LinkedIn profile
- **Score & Recommendations** - Receive a 0-100 score and 20+ personalized fixes
- **Headline Optimization** - See your current headline vs AI-optimized version
- **Stripe Integration** - One-time payments ($97) and subscriptions ($47/mo)
- **Beautiful UI** - Modern, responsive design built with Tailwind CSS

## 🚀 MVP Development

**See [MVP_FEATURE_PRIORITY.md](./MVP_FEATURE_PRIORITY.md) for the complete 4-6 week MVP roadmap:**
- Onboarding flow (LinkedIn connection, company info, capabilities)
- Agency matching engine (USASpending API integration)
- Content generator (AI-powered LinkedIn posts with agency pain points)
- GEO booster (optimize for AI engine visibility)
- Save/schedule/export functionality

## Tech Stack

- **Frontend**: HTML, CSS (Tailwind), Vanilla JavaScript
- **Backend**: Node.js, Express
- **AI**: Grok API (xAI)
- **Payments**: Stripe
- **Scraping**: Cheerio + AllOrigins proxy

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   - `GROK_API_KEY` - Your Grok API key
   - `STRIPE_SECRET_KEY` - Your Stripe secret key
   - `STRIPE_PRICE_FULL_FIX` - Stripe price ID for $97 one-time
   - `STRIPE_PRICE_CONTENT_ENGINE` - Stripe price ID for $47/mo subscription

3. **Create Stripe Products**
   - Go to Stripe Dashboard → Products
   - Create product "Full Fix Guide" ($97 one-time)
   - Create product "Content Engine" ($47/month recurring)
   - Copy the Price IDs to your `.env` file

4. **Run locally**
   ```bash
   npm run dev
   ```
   
   Visit `http://localhost:3000`

## Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` and follow prompts
3. Add environment variables in Vercel dashboard
4. Deploy: `vercel --prod`

### Render

1. Connect your GitHub repo
2. Create new Web Service
3. Add environment variables
4. Deploy automatically on push

## API Endpoints

- `POST /api/audit` - Analyze LinkedIn profile
  ```json
  {
    "url": "https://linkedin.com/in/username"
  }
  ```

- `POST /api/create-checkout-session` - Create Stripe checkout
  ```json
  {
    "priceId": "price_full_fix",
    "mode": "payment",
    "successUrl": "...",
    "cancelUrl": "..."
  }
  ```

- `GET /api/health` - Health check

## Notes

- LinkedIn scraping uses AllOrigins proxy to bypass CORS
- If scraping fails, the app falls back to mock data for development
- Grok API is used for AI analysis - if it fails, default recommendations are provided
- The app works without login - all data is session-based

## License

MIT
