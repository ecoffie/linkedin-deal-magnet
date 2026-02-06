# LinkedIn Deal Magnet - Claude Project Context

## IMPORTANT: Deployment Note
**This project's Vercel deployment (`govcon-content-generator.vercel.app`) is NOT active.**
The content generator is actually deployed via the **market-assassin** project at `tools.govcongiants.org`.

---

## Related GovCon Projects (Quick Reference)

| Project | Location | Deploys To | Purpose |
|---------|----------|------------|---------|
| **LinkedIn Deal Magnet** | This project | N/A (not actively deployed) | Original Express backend for content generator |
| **Market Assassin** | `/Users/ericcoffie/Projects/market-assassin` | `tools.govcongiants.org` | Next.js app with content generator + other tools |
| **GovCon Funnels** | `/Users/ericcoffie/govcon-funnels` | `govcongiants.org` | Marketing funnel |
| **GovCon Shop** | `/Users/ericcoffie/govcon-shop` | `shop.govcongiants.org` | Live shop (production) |

### Where to make changes:
- **Content Generator frontend** (HTML/JS): Edit in `market-assassin/public/content-generator/`
- **Content Generator API routes**: Edit in `market-assassin/src/app/api/`
- **Knowledge base / agency data**: Can be maintained here in `bootcamp/agencies/`

---

## Project Overview
**Name:** LinkedIn Deal Magnet
**Purpose:** AI-powered LinkedIn content generator for government contractors
**Framework:** Node.js + Express.js (monolithic server.js)
**Database:** Supabase
**AI Models:** Grok API (default) + OpenAI fine-tuned model

## Tech Stack
- **Backend:** Express.js (5,500+ lines in server.js)
- **Frontend:** Vanilla HTML + Tailwind CSS + JavaScript
- **AI:** Grok API (`grok-2-1212`) + OpenAI fine-tuned (`ft:gpt-4o-mini`)
- **Database:** Supabase (PostgreSQL)
- **Payments:** Stripe
- **Auth:** LinkedIn OAuth 2.0 (Passport.js)

---

## Content Generation Pipeline (3-Step Process)

### Step 1: Agency Pain Point Extraction
- Pulls from 31 agency knowledge base files in `bootcamp/agencies/`
- Each file has pain points, strategic priorities, market insights

### Step 2: Stats Injection + GEO Optimization
- Injects authoritative sources (GAO, DoD Strategic Plans)
- GEO Boost: Optimizes for AI search engines (ChatGPT, Perplexity)

### Step 3: Voice Analysis + Template Application
- Analyzes user's past LinkedIn posts for voice matching
- Applies 1 of 15 content templates

---

## Key Files

| File | Purpose |
|------|---------|
| `server.js` | Main Express backend (all API endpoints) |
| `api/index.js` | Vercel serverless function wrapper |
| `vercel.json` | Vercel deployment config |
| `content-generator.html` | Content generator UI |
| `db/supabase.js` | Database client & models |
| `bootcamp/agencies/*.json` | 31 agency knowledge base files |
| `bootcamp/viral-hooks.json` | 24 viral hook templates |
| `bootcamp/notion-viral-content.json` | Viral content frameworks |
| `data-collection/fine_tune_instruction_format.jsonl` | Fine-tuning training data |

---

## API Endpoints

### Content Generation
- `POST /api/content-generator/generate` - Main generation pipeline
- `GET /api/content-generator/templates` - List templates
- `GET /api/content-generator/viral-content` - Hooks & frameworks
- `POST /api/agencies/lookup` - NAICS-based agency matching (USASpending)

### Agency Data
- `GET /api/agencies` - All agencies (categorized)
- `GET /api/agency-knowledge-base/:name` - Specific agency details

### USASpending Integration
- `POST /api/government-contracts/search` - Contract search

---

## 15 Content Templates

story-driven, data-driven, question-based, case-study, thought-leadership,
list-tips, contrarian, actionable-how-to, motivational-story,
analytical-teardown, observation-insight, x-vs-y-comparison,
present-vs-future, listicle, contrarian-v2

---

## Agency Knowledge Base (31 Agencies)

**DoD:** dod, navy, navfac, army, air-force, usace
**Civilian:** va, hhs, dhs, nasa, gsa, epa, dot, state, usda, usaid, doe, doj, commerce, labor, education, hud, treasury, nrc, nsf, fcc, opm, sba, ssa, doi

---

## Environment Variables

```env
GROK_API_KEY=...
GROK_MODEL=grok-2-1212
OPENAI_API_KEY=...
FINE_TUNED_MODEL=ft:gpt-4o-mini-2024-07-18:gcg:govcon-linkedin:CtWXEc0l
STRIPE_SECRET_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
SESSION_SECRET=...
```

---

## Notes for Claude

1. **Don't deploy here** - The active content generator lives in `market-assassin`. Push frontend/API changes there.
2. **This repo is the knowledge base source** - Agency data, viral hooks, and content templates originate here.
3. **API_BASE must be relative** - The `market-assassin` frontend uses same-origin API calls (not cross-origin to a Vercel app).
4. **No Node.js on this machine** - `npm`, `node` are not installed. Can't run locally or use Vercel CLI.
5. **USASpending API** - Used for NAICS-based agency lookup. Can be slow; always have a fallback.

---

*Last Updated: February 5, 2026*
