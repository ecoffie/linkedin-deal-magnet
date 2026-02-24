# TODO

## Critical (P0) - Blocking MVP Launch

### Database Integration
- [x] Choose database (PostgreSQL via Supabase)
- [x] Set up database schema (`db/schema.sql`)
- [x] Migrate user data storage from in-memory Map to database (`db/supabase.js` models)
- [x] Implement user data persistence across sessions
- [x] Run `db/schema.sql` in Supabase SQL Editor to create tables

### Onboarding Flow
- [ ] PDF upload and parsing integration
- [ ] Frontend form validation and UX polish
- [ ] Onboarding completion tracking
- [ ] Progress indicators
- [ ] Form validation UI feedback

### Agency Matching Engine
- [ ] Complete USASpending API integration
- [ ] NAICS → Agency matching algorithm
- [ ] Spending data aggregation
- [ ] Small business set-aside analysis
- [ ] Agency matching UI/display

### Export Functionality
- [ ] Copy to clipboard (one-click per variant)
- [ ] Download as text (.txt)
- [ ] Save to library (requires database)
- [ ] Content library UI (search/filter saved posts)

### Content Generator Polish
- [ ] Content quality validation checks
- [ ] Character count enforcement (LinkedIn limits)
- [ ] Content preview rendering
- [ ] Regeneration with different parameters

## Important (P1) - Not Blocking Launch

### Fine-Tuned Model
- [ ] Fine-tuned OpenAI model testing in production
- [ ] A/B testing between Grok and fine-tuned model
- [ ] Performance evaluation

### GEO Booster
- [ ] GEO score calculation
- [ ] GEO optimization checklist validation
- [ ] Visual GEO indicators in UI
- [ ] GEO score display to users
- [ ] Pre/post GEO comparison view

### Export - Advanced
- [ ] Download as image (PNG/JPG LinkedIn post mockup)
- [ ] Download as PDF (formatted with metadata)

### Scheduling
- [ ] LinkedIn API posting integration
- [ ] Schedule queue management
- [ ] Scheduling UI (set date/time)
- [ ] Preview/edit scheduled posts

### Frontend Polish
- [ ] Content generator UI improvements
- [ ] Responsive design refinement
- [ ] Dashboard/homepage
- [ ] Spending statistics visualization
- [ ] Trending analysis (YoY growth)
- [ ] Certification alignment scoring

## Nice to Have (P2) - Post-MVP

- [ ] Content history/versioning
- [ ] API response caching (Redis)
- [ ] Background job processing
- [ ] Email notifications
- [ ] Analytics tracking
- [ ] Logging/monitoring setup
- [ ] Advanced analytics (engagement prediction)
- [ ] Team collaboration features
- [ ] Integration with other social platforms
- [ ] Automated content calendar

## In Progress

- [ ] Fine-tuning integration (90% - dataset ready, code integrated, waiting on OpenAI API)
- [ ] Content generation pipeline (85% - core 3-step process working)
- [ ] Knowledge base (95% - 31 agencies, 24 hooks, 15 templates)

## Done

- [x] LinkedIn OAuth integration (Passport.js)
- [x] LinkedIn profile data fetching
- [x] User session management
- [x] Company information input API
- [x] NAICS codes, certifications, past agencies storage
- [x] Capabilities statement text input
- [x] Agency knowledge base (31 agencies with pain points)
- [x] Agency lookup API
- [x] 3-step content generation pipeline (pain points → stats/GEO → voice)
- [x] Viral hooks integration (24 templates)
- [x] 15 content templates
- [x] Multi-variant generation (3-5 variants)
- [x] GEO optimization toggle (boolean flag)
- [x] GEO prompt enhancements, stats injection, source citations
- [x] Grok API integration
- [x] OpenAI API integration
- [x] Fine-tuning dataset (26 examples)
- [x] Stripe payment integration
- [x] Express.js server setup
- [x] CORS configuration
- [x] Vercel deployment config
- [x] NAICS-based agency lookup endpoint (USASpending)
