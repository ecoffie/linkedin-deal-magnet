# LinkedIn Deal Magnet - Project Context

## Project Overview

**Name**: LinkedIn Deal Magnet
**Purpose**: AI-powered LinkedIn optimization tools for professionals seeking career growth
**Target**: Job seekers, career changers, professionals building personal brands
**Partners**: Influencer-driven distribution (Kumud 183K, Sibel 302K, Olga)

---

## Key Documents

| Document | Purpose |
|----------|---------|
| `VISION.md` | Product vision, target audiences, revenue model |
| `PHASE_1_LINKEDIN_OPTIMIZER.md` | MVP spec for profile audit tool |
| `PHASE_2_JOB_BOARD.md` | Job board lead magnet spec |
| `TODO.md` | Current task tracking |

**Read these before making changes.**

---

## Tech Stack

- **Backend**: Node.js + Express.js (`server.js`)
- **Frontend**: Vanilla HTML + Tailwind CSS + JavaScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: LinkedIn OAuth 2.0 (Passport.js)
- **Payments**: Stripe
- **AI**: Claude API (Anthropic)
- **Deployment**: Vercel

---

## Current State (March 2026)

### What's Built
- [x] LinkedIn OAuth integration
- [x] Onboarding flow UI (3 steps)
- [x] Profile URL input + validation
- [x] Score display with animated ring
- [x] Fix cards with priority badges
- [x] Headline copy button
- [x] Stripe integration (basic)

### What's Missing (Phase 1)
- [ ] `/api/audit` endpoint (profile scraping + AI analysis)
- [ ] Database persistence for audits
- [ ] Payment gating (free vs paid fixes)
- [ ] Dashboard page
- [ ] Mobile polish

### Phase 2 (Not Started)
- [ ] Job board with Adzuna API
- [ ] Email capture + Resend integration
- [ ] Upsell CTAs from job board to optimizer

---

## Key Files

| File | Purpose |
|------|---------|
| `server.js` | Express backend (API endpoints) |
| `onboarding.html` | 3-step onboarding flow |
| `content-generator.html` | Content creation tool (needs update) |
| `db/schema.sql` | Database schema |
| `api/index.js` | Vercel serverless wrapper |

---

## API Endpoints

### Implemented
- `GET /auth/linkedin` - Initiate OAuth
- `GET /auth/linkedin/callback` - OAuth callback
- `GET /api/linkedin/profile` - Get authenticated user
- `POST /api/onboarding/save` - Save user data

### Needed for Phase 1
- `POST /api/audit` - Profile scraping + AI analysis
- `GET /api/audit/:id` - Retrieve saved audit
- `POST /api/checkout` - Stripe payment
- `POST /api/webhook/stripe` - Payment confirmation

### Needed for Phase 2
- `GET /api/jobs/search` - Search jobs (Adzuna)
- `GET /api/jobs/:id` - Job detail
- `POST /api/jobs/subscribe` - Email alerts

---

## Environment Variables

```env
# AI
ANTHROPIC_API_KEY=

# Database
SUPABASE_URL=
SUPABASE_SERVICE_KEY=

# Auth
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
SESSION_SECRET=

# Payments
STRIPE_SECRET_KEY=
STRIPE_PRICE_FULL_REPORT=  # $97 one-time

# Phase 2
ADZUNA_APP_ID=
ADZUNA_API_KEY=
RESEND_API_KEY=
```

---

## Development Notes

### Profile Scraping
- Current: AllOrigins proxy (works but unreliable)
- Production: Consider ScraperAPI or Brightdata
- Fallback: Manual text input if scraping fails

### AI Prompts
- Score calculation: 0-100 based on 5 categories (20 pts each)
- Headline generation: Under 220 chars, includes role + value prop + audience
- Fix generation: 15-20 fixes with priority levels

### Stripe Products Needed
- "Full Report" - $97 one-time
- "Pro Subscription" - $29/month (optional for MVP)

---

## Workflow Rules

1. **Check docs first**: Read VISION.md, PHASE_1, PHASE_2 before starting work
2. **Phase 1 priority**: Complete LinkedIn Optimizer MVP before starting job board
3. **No GovCon references**: This is a general professional audience, not government contractors
4. **Test with real profiles**: Use actual LinkedIn URLs during development
5. **Mobile-first**: All UI must work on mobile

---

## DO NOT

- Reference GovCon, government contractors, or agencies
- Use agency knowledge base files (`bootcamp/agencies/`)
- Deploy to `tools.govcongiants.org` (that's a different project)
- Add features not in the phase specs without discussion

---

## Quick Commands

```bash
# Run locally
npm run dev

# Deploy to Vercel
vercel --prod

# Check Supabase
# Go to supabase.com/dashboard
```

---

## Session Handoff

When resuming work on this project:

1. **Read Context**: Review `IMPLEMENTATION_SUMMARY.md` for current state
2. **Check Tasks**: See `TODO.md` for remaining work
3. **Quick Start**: `cd ~/Linkedin\ App && npm start`
4. **Test URL**: http://localhost:3000/onboarding

### Current Status (March 19, 2026)
✅ Manual input form complete
✅ `/api/audit-manual` endpoint built
✅ Claude API integration working
✅ $97 profile rewrite CTA added
⏳ Testing with real profiles (next task)

---

*Last Updated: March 19, 2026*
