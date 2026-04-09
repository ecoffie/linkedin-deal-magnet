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

### April 8, 2026 - Session Handoff
**Completed:**
- [x] Verified Anthropic API key is configured correctly (local + production)
  - Local: Present in `.env` file
  - Vercel Production: Set 21 days ago, encrypted and active
  - Server code properly checks for `ANTHROPIC_API_KEY` env var (server.js:1163-1174)

**Current State:**
- Branch: `main`
- Uncommitted changes: Yes (see below)
- Dev server: Running on port 3000
- Last deployment: https://linkedin-deal-magnet.vercel.app

**Uncommitted Changes:**
```
M  DEPLOYMENT_GUIDE.md
M  onboarding.html
M  package-lock.json
M  package.json
M  server.js

?? .claude/
?? IMPLEMENTATION_COMPLETE.md
?? INFRASTRUCTURE_COMPLETE.md
?? LAUNCH_CHECKLIST.md
?? MCP_INSTALLATION_COMPLETE.md
?? MCP_READY_TO_USE.md
?? PRD-job-board-lead-magnet.md
?? PRD-profile-rewrite-service.md
?? PRODUCTION_LIVE.md
?? QUICK_START.md
?? add-env.sh
?? dashboard.html
?? docs/
?? email-templates/
?? mcp-servers/
?? setup-vercel-env.sh
?? tasks/
?? utils/
```

**Next Steps (High Priority):**
1. Stop dev server if not actively testing: `pkill -f "node.*3000"`
2. Commit uncommitted changes (infrastructure files)
3. Test production audit flow end-to-end
4. Configure Stripe webhook URL in Stripe dashboard
5. Test manual input with 5 real LinkedIn profiles

**Notes for Next Session:**
- Anthropic API key is working - if you see warnings, just restart server
- All infrastructure is complete - focus on testing and launch prep
- Stripe checkout and webhook endpoints are implemented but untested
- Consider committing the large batch of documentation files before next major changes

**Decisions Made:**
- Using Anthropic Claude API as primary AI engine (with Grok/OpenAI fallback)
- Manual input approach for MVP (no scraping complexity)
- $97 one-time payment for full profile rewrite
- Vercel for hosting + serverless functions

---

**Last Updated:** April 8, 2026
