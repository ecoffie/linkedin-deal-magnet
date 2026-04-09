# LinkedIn Deal Magnet - Tasks

**Current Focus**: Phase 1 MVP Launch Prep

---

## Phase 1: LinkedIn Optimizer (MVP)

### ✅ Completed

#### Backend
- [x] LinkedIn OAuth integration (Passport.js)
- [x] `/api/audit-manual` endpoint with Claude API
- [x] Profile data validation
- [x] 0-100 scoring system
- [x] AI headline generation
- [x] 15-20 prioritized fixes generation
- [x] Supabase connection and models
- [x] Grok/OpenAI fallback chain (optional)

#### Frontend
- [x] Onboarding flow UI (3 steps)
- [x] Manual input form with character counters
- [x] Email capture gate with "weekly tips" checkbox
- [x] Profile completeness fields (photo, banner, connections)
- [x] Score display with animated ring
- [x] Fix cards with priority badges (high/medium/low)
- [x] Headline copy button
- [x] $97 Profile Rewrite CTA card
- [x] Stripe checkout function skeleton

#### Documentation
- [x] VISION.md - Product vision and target audiences
- [x] PHASE_1_LINKEDIN_OPTIMIZER.md - MVP spec
- [x] IMPLEMENTATION_SUMMARY.md - March 19 handoff doc
- [x] CLAUDE.md - Project context for AI sessions
- [x] `.claude/commands/` - 3 core skills (headline, audit, about rewrite)
- [x] `docs/prompts/` - Prompt documentation
- [x] `docs/api-integrations.md` - All external APIs
- [x] `docs/database-schema.md` - Supabase schema
- [x] `docs/testing-checklist.md` - Pre-launch QA
- [x] `docs/monetization-strategy.md` - Revenue model & pricing
- [x] `docs/error-patterns.md` - Searchable error catalog
- [x] `PRD-profile-rewrite-service.md` - $97 product spec
- [x] `PRD-job-board-lead-magnet.md` - Phase 2 spec
- [x] `.claude/agents/profile-rewrite-agent.md` - Autonomous workflow
- [x] `tasks/todo.md` and `tasks/lessons.md` - Task management
- [x] `INFRASTRUCTURE_COMPLETE.md` - Full infrastructure summary

---

### ⏳ In Progress

#### Testing & Validation
- [ ] Test manual input flow with 5 real LinkedIn profiles
  - [ ] Junior professional (1-3 years experience)
  - [ ] Mid-level (4-8 years)
  - [ ] Senior (8+ years)
  - [ ] Career changer (switching industries)
  - [ ] Executive (VP/C-level)
- [ ] Validate Claude API response quality
- [ ] Test score accuracy across different profile types
- [ ] Mobile responsive testing (iOS Safari, Android Chrome)

---

### 🔴 Blocked / Needs Attention

**Stripe Integration:**
- Need to complete `/api/checkout` endpoint
- Need to implement webhook handler for payment confirmation
- Test end-to-end payment flow in Stripe test mode

**Database:**
- Verify `audits` table exists in Supabase
- Test audit save/retrieval by email
- Add indexes for performance

---

### 📋 To Do

#### High Priority (Pre-Launch)

**Backend Endpoints:**
- [x] Complete `/api/create-checkout-session` endpoint ✅
  - Creates Stripe checkout session
  - Maps `price_full_fix` → `price_1SedI3K5zyiZ50PBOx0luGnq` ($97)
  - Passes audit_id, email, referrer in metadata
  - Returns session URL
- [x] Complete `/api/webhook` endpoint ✅
  - Verifies webhook signature (when STRIPE_WEBHOOK_SECRET set)
  - Marks audit as paid in Supabase
  - Sends email with results via Resend
- [ ] Create `/api/audit/:id` endpoint (retrieve saved audit)
- [ ] Add rate limiting (max 5 audits per email per day)

**Frontend:**
- [x] Wire up Stripe checkout button click event ✅
- [x] Add loading state for payment redirect ✅
- [ ] Create dashboard page (`/dashboard`)
  - Show past audits
  - Link to saved results
  - Show payment history if Pro user
- [ ] Polish loading animation timing
- [ ] Add error handling for failed API calls
- [ ] Test all CTAs and navigation flows

**Database:**
- [ ] Run schema migration in Supabase SQL editor
- [ ] Test audit insert/select queries
- [ ] Test payment insert/update queries
- [ ] Add database indexes (see database-schema.md)

**Infrastructure:**
- [x] Deploy to Vercel production ✅ (https://linkedin-deal-magnet.vercel.app)
- [x] Configure production environment variables ✅
- [ ] Test production deployment (smoke test all endpoints)
- [ ] Set up custom domain (optional: `app.linkedindealmagnet.com`)
- [ ] Configure Stripe webhook URL in Stripe dashboard

**Content & Legal:**
- [ ] Update privacy policy (remove scraping references)
- [ ] Add terms of service page
- [ ] Create "How It Works" section on landing page
- [ ] Add FAQ section
- [ ] Get 3-5 beta user testimonials

---

#### Medium Priority (Post-Launch Week 1)

**Features:**
- [ ] PDF export of audit results
- [ ] Email audit results automatically (Resend integration)
- [ ] Shareable audit URLs (`/audit/:id` public view)
- [ ] Add LinkedIn OAuth pre-fill option (name, headline from API)

**Analytics:**
- [ ] Set up Plausible or PostHog analytics
- [ ] Track conversion funnel (landing → audit → payment)
- [ ] Track audit completion rate
- [ ] Track score distribution

**Marketing:**
- [ ] Create influencer affiliate tracking links
- [ ] Set up UTM parameter tracking in database
- [ ] Create social proof section (testimonials)
- [ ] Draft launch post for Kumud to share

---

#### Low Priority (Phase 1.5)

**Enhancements:**
- [ ] Resume tailoring per job posting (AI-powered)
- [ ] Progress tracking over time (re-audit feature)
- [ ] LinkedIn post generator standalone tool
- [ ] Chrome extension for easier data collection
- [ ] Batch audit feature for agencies

**Optimization:**
- [ ] A/B test pricing ($97 vs $79 vs $29/mo subscription)
- [ ] A/B test headline copy on landing page
- [ ] A/B test CTA button text
- [ ] Optimize AI prompts based on user feedback

---

## Phase 2: Job Board Lead Magnet

**Status**: Not started (planned for 2-3 weeks after Phase 1 launch)

### To Do
- [ ] Read PHASE_2_JOB_BOARD.md spec
- [ ] Integrate Adzuna Job Search API
- [ ] Create job search page with filters
- [ ] Add email capture for job alerts
- [ ] Build job detail page
- [ ] Create email alert system (Resend integration)
- [ ] Add "Optimize Profile for This Job" upsell

---

## Infrastructure & Tools

### ✅ MCP Servers Built
- [x] **Stripe MCP Server** (`mcp__stripe__*`) - Payment processing
  - ✅ Installed and tested (5 tools working)
  - ✅ Configured in Claude Desktop config
  - ✅ Using test API key
- [x] **Resend MCP Server** (`mcp__resend__*`) - Email delivery
  - ✅ Installed and configured
  - ✅ API key configured in .env
  - ✅ Ready to use (5 tools: send_email, send_batch_emails, add_to_audience, remove_from_audience, check_email_status)

### MCP Servers to Build (Future)
- [ ] **Adzuna MCP Server** (`mcp__adzuna__*`) - Job search (Phase 2)
- [ ] **LinkedIn MCP Server** (`mcp__linkedin__*`) - Profile scraper (future)

### ✅ Agents Built
- [x] **Full Profile Rewrite Agent** - Multi-step workflow for $97 service
  - ✅ 8-step workflow documented
  - ✅ Quality checks built-in
  - ✅ Error handling for all scenarios
  - ⏳ Ready to deploy when backend endpoints complete

### Agents to Build (Future)
- [ ] **Email Campaign Builder Agent** - Generate nurture sequences
- [ ] **Competitive Research Agent** - Monthly market intelligence
- [ ] **Content Marketing Agent** - Blog posts + social content

### ✅ Skills Built (Slash Commands)
- [x] `/generate-linkedin-headline` - 3 headline options under 220 chars
- [x] `/audit-linkedin-profile` - 0-100 score + 15-20 fixes
- [x] `/rewrite-linkedin-about` - Professional About section (1,500-2,000 chars)

---

## Blockers & Questions

### Technical Blockers
- None currently

### Product Questions
- **Pricing test**: Should we offer $97 one-time AND $19/mo subscription, or just one?
- **Email frequency**: Weekly tips or bi-weekly? (start weekly)
- **Influencer launch order**: Kumud first (most engaged), or all 3 at once?

### Dependencies
- Waiting on Kumud's approval to soft launch with her audience
- Need 3-5 beta users to provide testimonials before full launch

---

## Daily Standup Format

**What I did yesterday:**
- [x] Task 1
- [x] Task 2

**What I'm doing today:**
- [ ] Task 3
- [ ] Task 4

**Blockers:**
- Issue X needs decision from Eric

---

## Session Notes

### March 19, 2026
- ✅ Completed manual input implementation
- ✅ Claude API integration working
- ✅ Created comprehensive documentation structure
- ⏳ Next: Testing with real profiles

### April 5, 2026
- ✅ Built complete infrastructure (20+ files, ~15,300 lines)
- ✅ Created 3 skills (headline, audit, about rewrite)
- ✅ Created 1 agent (Profile Rewrite Agent)
- ✅ Built 2 MCP servers (Stripe ✅ working, Resend ⏳ needs API key)
- ✅ Wrote 2 comprehensive PRDs (Profile Rewrite, Job Board)
- ✅ Created 7 documentation files (APIs, DB, testing, monetization, errors)
- ✅ Installed and tested Stripe MCP (5 tools available)
- ✅ Configured Claude Desktop for MCP servers
- ✅ Resend API key configured and ready
- ✅ `/api/create-checkout-session` implemented with real price ID
- ✅ `/api/webhook` implemented (marks paid, sends email)
- ✅ Deployed to production: https://linkedin-deal-magnet.vercel.app
- ⏳ **Next: Configure Stripe webhook URL, test end-to-end flow**

### April 8, 2026 - Evening Session Complete
**Completed:**
- [x] Verified Anthropic API key configured correctly (local + production)
- [x] Built AI model priority system (Grok primary, preserves Anthropic credits)
- [x] Deployed AI priority system to production
- [x] Audited payment flow - found 3 blockers
- [x] Resolved blocker 1: Email function (already exists at utils/email.js)
- [x] Resolved blocker 2: Database schema (verified - audits table exists)
- [x] Created comprehensive test plan and success criteria
- [x] Documented Stripe setup options (test mode + live mode)

**Current State:**
- Branch: `main`
- Last commit: `c94c162` - AI model priority system
- Uncommitted: Documentation files (will commit after Stripe setup)
- Dev server: May be running on port 3000
- Production: https://linkedin-deal-magnet.vercel.app
- Production status: ✅ AI audits working, ⚠️ Payments untested

**Remaining Blocker (1 of 3):**
- ⚠️ **Stripe webhook secret not configured**
  - Need to set up webhook in Stripe dashboard
  - Need to add STRIPE_WEBHOOK_SECRET to Vercel
  - See: `STRIPE_LIVE_SETUP.md` for instructions

**Progress:** 60% → 75% production-ready

**Next Session Priority (Tomorrow):**
1. **Decide Stripe approach** (5 min)
   - Option A: $1 test product (safest)
   - Option B: $97 straight launch (risky)
   - Option C: You pay $97 first (safest for customers)
   - User prefers: Live keys (no test mode)

2. **Get live Stripe credentials** (10 min)
   - Live secret key: `sk_live_...`
   - Live webhook secret: `whsec_...`
   - Live price ID: `price_...`

3. **Configure webhook** (5 min)
   ```bash
   echo "whsec_XXX" | vercel env add STRIPE_WEBHOOK_SECRET production
   ```

4. **Run real payment test** (15 min)
   - Complete audit flow
   - Test payment (real card)
   - Verify webhook → 200 OK
   - Check database: is_paid = true
   - Confirm email received

5. **Fix issues if any** (30 min buffer)

6. **Launch decision** (go/no-go)

**Files to Review Tomorrow:**
- `SESSION_HANDOFF_APR8.md` - Complete session summary
- `STRIPE_LIVE_SETUP.md` - Webhook setup instructions
- `FIXES_COMPLETE.md` - What was fixed today
- `CRITICAL_ISSUES.md` - Updated with resolutions

**Quick Start Tomorrow:**
```bash
cd ~/Linkedin\ App
cat SESSION_HANDOFF_APR8.md  # Read this first
cat STRIPE_LIVE_SETUP.md     # Then follow this
```

**Decisions Made Today:**
- Use Grok as primary AI (preserves Anthropic credits for CLI)
- Use live Stripe keys (not test mode)
- Test with real payment before public launch
- Follow Build → Test → Ship properly (no more untested deploys)

**Lessons Learned:**
- Always verify before assuming (email function already existed!)
- Database checks are quick - do them early
- Following workflow orchestration catches issues
- Test criteria should be defined BEFORE building

---

**Last Updated:** April 8, 2026 - 10:00 PM
**Next Session:** Continue with Stripe webhook setup and payment testing
**Estimated Time:** 30-45 minutes to launch-ready
