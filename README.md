# LinkedIn Deal Magnet

AI-powered LinkedIn optimization tools for professionals seeking career growth.

**Live URL:** https://linkedin-deal-magnet.vercel.app

## What Is This?

A suite of tools to help job seekers, career changers, and professionals optimize their LinkedIn presence:

1. **LinkedIn Profile Optimizer** (Phase 1) - Get a Readiness Score and 20+ AI-powered fixes
2. **Pro Subscription** ($19/mo) - Full access to all features
3. **Job Board** (Phase 2) - Curated job listings with email alerts

## Target Audience

- Job seekers looking to stand out
- Career changers starting fresh
- Professionals building personal brands
- Women reentering the workforce

## Features

### Phase 1: Profile Optimizer (MVP COMPLETE - March 2026)
- **Free Audit**: Readiness Score (0-100) + AI headline + 15-20 prioritized fixes
- **Manual Input**: User provides profile data (no scraping - LinkedIn ToS compliant)
- **Email Capture**: Required before showing results
- **Claude AI**: Primary analysis engine with Grok/OpenAI fallbacks
- **Monetization**: $97 profile rewrite service (done-for-you)

### Partner Program
- Partners (Kumud, Sibel, Olga): 60% revenue share ($11.40/conversion)
- Affiliates: 20% revenue share ($3.80/conversion)
- Tracking via `?ref=` URL parameter

### Phase 2: Job Board (Coming Soon)
- Job search with filters (remote, salary, industry)
- Email alerts for new listings
- Integration with Profile Optimizer
- Niche focus: "Fresh Start Careers"

## Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: HTML + Tailwind CSS + Vanilla JS
- **Database**: Supabase (PostgreSQL)
- **Auth**: LinkedIn OAuth 2.0
- **AI**: Claude (Primary) + Grok + OpenAI (Fallbacks)
- **Payments**: Stripe
- **Deployment**: Vercel

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Run locally
npm run dev

# Visit http://localhost:3000
```

## Environment Variables

```env
# Required
ANTHROPIC_API_KEY=       # Claude API (primary AI)
GROK_API_KEY=            # Grok API (fallback)
OPENAI_API_KEY=          # OpenAI (fallback)
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
SESSION_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PRICE_PRO_MONTHLY=

# Optional (Phase 2)
ADZUNA_APP_ID=
ADZUNA_API_KEY=
RESEND_API_KEY=
```

## Project Structure

```
/
├── server.js              # Express backend
├── onboarding.html        # 3-step onboarding flow
├── content-generator.html # Content creation tool
├── db/
│   ├── schema.sql         # Database schema
│   └── supabase.js        # Database models
├── api/
│   └── index.js           # Vercel serverless wrapper
├── VISION.md              # Product vision
├── PHASE_1_*.md           # Phase 1 spec
├── PHASE_2_*.md           # Phase 2 spec
├── TODO.md                # Task tracking
└── CLAUDE.md              # AI assistant context
```

## Documentation

### Product & Planning
| Document | Description |
|----------|-------------|
| [VISION.md](./VISION.md) | Product vision, target audiences, revenue model |
| [PHASE_1_LINKEDIN_OPTIMIZER.md](./PHASE_1_LINKEDIN_OPTIMIZER.md) | MVP specification (manual input approach) |
| [PHASE_2_JOB_BOARD.md](./PHASE_2_JOB_BOARD.md) | Job board specification |
| [TODO.md](./TODO.md) | Current tasks and progress |
| [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | Complete implementation overview & status |

### Technical Documentation
| Document | Description |
|----------|-------------|
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | API reference, endpoints, request/response specs |
| [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) | Pre-launch testing guide (5 profile types, mobile, etc) |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Vercel deployment steps, environment setup |
| [CLAUDE.md](./CLAUDE.md) | AI assistant context & session handoff |

## Deployment

### Vercel (Current)

Live at: https://linkedin-deal-magnet.vercel.app

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Environment variables are configured in Vercel dashboard.

## API Endpoints

### Auth
- `GET /auth/linkedin` - Initiate OAuth
- `GET /auth/linkedin/callback` - OAuth callback

### Profile Optimizer
- `POST /api/audit-manual` - Analyze profile with user-provided data (see API_DOCUMENTATION.md)
- `GET /api/audit/:id` - Retrieve saved audit (coming soon)
- `GET /api/health` - Health check

### Payments
- `POST /api/create-checkout-session` - Create Stripe checkout (supports referrer tracking)
- `POST /api/webhook/stripe` - Handle payments

### Affiliate
- `GET /api/affiliate/stats?ref=` - Get affiliate statistics (requires auth)

### Jobs (Phase 2)
- `GET /api/jobs/search` - Search jobs
- `POST /api/jobs/subscribe` - Email alerts

## Partner URLs

- Kumud: `https://linkedin-deal-magnet.vercel.app/onboarding?ref=kumud`
- Sibel: `https://linkedin-deal-magnet.vercel.app/onboarding?ref=sibel`
- Olga: `https://linkedin-deal-magnet.vercel.app/onboarding?ref=olga`

## Pricing

- **Free**: Full audit (score + headline + all 15-20 fixes)
- **Profile Rewrite** ($97 one-time): Done-for-you headline + about + top 3 experiences rewritten
  - Delivered in 24-48 hours
  - 1 round of revisions included

## License

MIT
