# TODO - LinkedIn Deal Magnet

## Phase 1: LinkedIn Profile Optimizer (MVP)

### ✅ COMPLETED - March 19, 2026

#### Backend: `/api/audit-manual` Endpoint
- [x] **Manual input approach** (no scraping - user provides data)
- [x] AI analysis with **Claude API** (primary, Grok fallback)
- [x] Score calculation (0-100 with score labels)
- [x] Headline generation (under 220 chars)
- [x] Fix generation (15-20 items with priorities)
- [x] Save audit to Supabase with email capture

#### Frontend: Manual Input Form
- [x] Comprehensive form with email, headline, about, 2-3 experiences
- [x] Character counters (220 for headline, 2600 for about)
- [x] Profile completeness checkboxes (photo, banner, connections)
- [x] Form validation for required fields
- [x] Email capture gate with "weekly tips" checkbox
- [x] Loading animation with updated messaging (no "scraping")

#### Payment Flow
- [x] Stripe integration with `price_1SedI3K5zyiZ50PBOx0luGnq` ($97)
- [x] `POST /api/create-checkout-session` working
- [x] Profile Rewrite CTA on results page ($97 one-time)
- [x] Checkout flow with success/cancel URLs

### P0 - Still Needed for Launch

#### Testing & Validation
- [ ] Test with 5 real LinkedIn profiles (junior, mid, senior, career changer, executive)
- [ ] Validate Claude API analysis quality
- [ ] Test mobile responsive layout
- [ ] Test Stripe checkout end-to-end

#### Database
- [ ] Verify `audits` table schema in Supabase
- [ ] Test audit retrieval by email
- [ ] Add indexes for performance

#### Launch Prep
- [ ] Update privacy policy (manual input, no scraping)
- [ ] Update terms of service
- [ ] Set up Vercel deployment
- [ ] Configure production environment variables

### P1 - Important but Not Blocking

#### Dashboard
- [ ] Post-signup dashboard page
- [ ] Show past audits
- [ ] Re-audit CTA

#### Sharing
- [ ] Shareable audit URL (`/audit/:id`)
- [ ] Social share buttons (Twitter, LinkedIn)

#### Analytics
- [ ] Track audit completions
- [ ] Track payment conversions
- [ ] Track headline copies

### P2 - Nice to Have

- [ ] PDF export of full report
- [ ] Email audit results
- [ ] A/B test pricing ($97 vs $67 vs $127)

---

## Phase 2: Job Board Lead Magnet

### Backend
- [ ] Adzuna API integration
- [ ] `GET /api/jobs/search` - Search with filters
- [ ] `GET /api/jobs/:id` - Job detail
- [ ] `POST /api/jobs/save` - Save job (requires auth)
- [ ] `POST /api/jobs/subscribe` - Email alerts

### Email
- [ ] Resend integration
- [ ] Welcome email template
- [ ] Weekly digest template
- [ ] Unsubscribe handling
- [ ] Cron job for weekly sends

### Frontend
- [ ] `/jobs` - Landing page with search
- [ ] `/jobs/search` - Results with filters
- [ ] `/jobs/:id` - Job detail page
- [ ] `/jobs/saved` - Saved jobs (logged in)
- [ ] Email capture modal
- [ ] Upsell CTAs to Profile Optimizer

### Analytics
- [ ] Track job views
- [ ] Track apply clicks
- [ ] Track email signups
- [ ] Track conversions from job board to optimizer

---

## Completed

### Infrastructure
- [x] Express.js server setup
- [x] Vercel deployment config
- [x] CORS configuration
- [x] Supabase connection

### Auth
- [x] LinkedIn OAuth integration (Passport.js)
- [x] LinkedIn profile data fetching
- [x] Session management

### Onboarding UI
- [x] Step 1: LinkedIn OAuth button
- [x] Step 2: Profile URL input + validation
- [x] Step 3: Score display with animated ring
- [x] Fix cards with priority badges
- [x] Headline copy button
- [x] Progress indicators

### Payments
- [x] Stripe integration (basic)

---

## Current Sprint (Week of March 18)

Focus: **Get `/api/audit` working end-to-end**

1. [ ] Profile scraping returning real data
2. [ ] AI analysis generating quality scores/fixes
3. [ ] Frontend displaying real results (not mock)
4. [ ] Test with 5 real LinkedIn profiles

---

## Open Questions

1. **Naming**: Keep "LinkedIn Deal Magnet" or rebrand?
2. **Pricing**: $97 one-time confirmed, or test other prices?
3. **Launch partner**: Start with Kumud, Sibel, or Olga?
4. **Scraping reliability**: Need ScraperAPI/Brightdata for production?

---

*Last Updated: March 18, 2026*
