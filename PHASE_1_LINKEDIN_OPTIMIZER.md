# Phase 1: LinkedIn Profile Optimizer - MVP Specification

## Overview
AI-powered LinkedIn profile audit that gives users a Readiness Score and actionable fixes to improve their professional presence.

---

## User Journey

```
Landing Page → Connect LinkedIn → Paste Profile URL → Loading Animation → Score + Fixes → CTA (Paid Upgrade)
```

### Step 1: Landing Page (`/onboarding`)
- Hero: "Get Your LinkedIn Readiness Score"
- Stats: "3,200+ Profiles Analyzed" | "20+ Personalized Fixes" | "60s Results"
- CTA: "Get Started Free"

### Step 2: Connect LinkedIn
- OAuth flow to get user's name, email, profile picture
- Optional: Fetch last 10 posts to learn writing voice (for future content generator)
- Skip option for users who don't want to connect

### Step 3: Profile URL Input
- User pastes their LinkedIn profile URL
- Validation: `linkedin.com/in/username` format
- Error handling for invalid URLs

### Step 4: Analysis (Loading State)
- Animated loading steps:
  1. "Scraping your profile..." (3s)
  2. "Analyzing with AI..." (5s)
  3. "Generating your score..." (2s)
- Total: ~10-15 seconds

### Step 5: Results Display
- **Readiness Score**: 0-100 with color coding
  - 80-100: Excellent (green)
  - 60-79: Looking Good (light green)
  - 40-59: Getting There (yellow)
  - 0-39: Needs Work (red)
- **AI Headline Suggestion**: Copy-to-clipboard button
- **Prioritized Fixes**: High/Medium/Low priority badges

### Step 6: Conversion (UPDATED - March 19, 2026)
- Free users see: **Full audit** (score + headline + ALL 15-20 fixes)
- Email capture required BEFORE analysis (collected in form)
- Primary CTA: **"Get Your Profile Professionally Rewritten - $97"** (one-time)
  - Includes: Headline + About section + Top 3 experience rewrites
  - Delivered in 24-48 hours with 1 round of revisions
- Secondary CTA: "Complete Setup" (go to dashboard)

**Why give away full audit free?**
- Careerflow gives full audit free - we must match market
- Gating creates friction, users bounce to competitors
- Full free value → trust → paid conversion for DONE-FOR-YOU service

**Why $97 one-time instead of subscription?**
- User decision from planning session (March 19, 2026)
- Lower friction than recurring commitment
- Matches user intent: "I need this fixed NOW"
- Can still add subscription for ongoing features later

---

## Technical Implementation

### API Endpoint: `POST /api/audit-manual` (UPDATED)

**Request**:
```json
{
  "email": "user@example.com",
  "profileUrl": "https://linkedin.com/in/username",
  "headline": "Product Manager at Acme Corp",
  "about": "I help companies build great products...",
  "experience": [
    {
      "title": "Senior Product Manager",
      "company": "Acme Corp",
      "duration": "2020 - Present",
      "description": "Led product strategy for..."
    },
    {
      "title": "Product Manager",
      "company": "Previous Co",
      "duration": "2018 - 2020",
      "description": "Managed product roadmap..."
    }
  ],
  "skills": ["Product Management", "Agile", "SQL"],
  "hasPhoto": true,
  "hasBanner": false,
  "connectionCount": "500+",
  "referrer": "kumud-twitter"
}
```

**Response**:
```json
{
  "success": true,
  "score": 72,
  "scoreLabel": "Looking Good",
  "aiHeadline": "Senior Product Manager | Helping SaaS companies scale from $1M to $10M ARR",
  "currentHeadline": "Product Manager at Acme Corp",
  "fixes": [
    {
      "priority": "high",
      "title": "Optimize Your Headline",
      "description": "Your headline is too generic. Include your value proposition and target audience.",
      "tips": "Use format: [Role] | [Value Prop] | [Target Audience]"
    },
    {
      "priority": "high",
      "title": "Add a Featured Section",
      "description": "You're missing a Featured section. This is prime real estate to showcase your best work.",
      "tips": "Add 3-5 posts, articles, or external links that demonstrate your expertise."
    },
    {
      "priority": "medium",
      "title": "Expand Your About Section",
      "description": "Your About section is only 150 characters. Aim for 1,500-2,000 characters.",
      "tips": "Include: who you help, how you help them, your unique approach, and a CTA."
    }
  ],
  "profileData": {
    "name": "John Smith",
    "headline": "Product Manager at Acme Corp",
    "about": "I help companies build great products...",
    "experience": [...],
    "connections": "500+",
    "hasProfilePhoto": true,
    "hasBanner": false,
    "hasFeatured": false
  }
}
```

### Profile Data Collection Strategy (UPDATED - March 19, 2026)

**✅ IMPLEMENTED: Manual Input (Primary Method)**
- User copies/pastes data from their LinkedIn profile
- Form fields:
  - Email (required for results)
  - Profile URL (validation only)
  - Headline (220 char max with counter)
  - About section (2600 char max with counter)
  - Last 2-3 Experience roles (title, company, duration, description)
  - Skills (optional, comma-separated)
  - Profile completeness (photo, banner, connection count)

**Why Manual Input?**
- ✅ LinkedIn ToS compliant (user-provided data)
- ✅ 100% reliable (no scraping failures)
- ✅ Works for all profiles (public/private)
- ✅ Matches competitor approaches (RedactAI, Paje.ai, Teal)
- ❌ Requires 2-3 minutes of user effort (acceptable trade-off)

**❌ NOT IMPLEMENTED: Scraping**
- LinkedIn explicitly prohibits automated scraping in ToS
- AllOrigins proxy unreliable (20-40% success rate)
- Legal and technical risks outweigh benefits
- Competitors don't scrape either

### AI Analysis Prompt

```
You are a LinkedIn optimization expert. Analyze this LinkedIn profile and provide:

1. A score from 0-100 based on:
   - Headline quality (20 points)
   - About section completeness (20 points)
   - Experience descriptions (20 points)
   - Profile completeness (photo, banner, featured) (20 points)
   - Engagement signals (recommendations, skills endorsements) (20 points)

2. An optimized headline suggestion that:
   - Is under 220 characters
   - Includes their role/expertise
   - Includes their value proposition
   - Includes their target audience

3. 15-20 specific fixes, each with:
   - Priority (high/medium/low)
   - Title (short action item)
   - Description (why it matters)
   - Tips (how to fix it)

Profile data:
{profileData}

Return JSON format.
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  linkedin_id VARCHAR(255),
  name VARCHAR(255),
  profile_picture TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Audits Table
```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  linkedin_url TEXT NOT NULL,
  score INTEGER,
  score_label VARCHAR(50),
  ai_headline TEXT,
  fixes JSONB,
  profile_data JSONB,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  audit_id UUID REFERENCES audits(id),
  stripe_payment_id VARCHAR(255),
  amount INTEGER, -- cents
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Pages & Routes

| Route | Page | Status |
|-------|------|--------|
| `/` | Landing page / Home | Needs update |
| `/onboarding` | 3-step onboarding flow | Built (needs polish) |
| `/dashboard` | User dashboard (post-signup) | Not built |
| `/audit/:id` | Shareable audit results | Not built |
| `/pricing` | Pricing page | Not built |
| `/content-generator` | Content creation tool | Built (GovCon-focused, needs update) |

---

## Monetization (Data-Backed - See MARKET_RESEARCH.md)

### Pricing Strategy Rationale

**Key Research Findings:**
- Careerflow gives FULL LinkedIn audit FREE (our baseline)
- Freemium conversion rate: 2-5% industry average
- Proven SaaS price points: $19/mo, $29/mo
- Charm pricing works: $19 > $20, $29 > $30
- Job seekers pay for: time savings, ATS optimization, visibility

**Our Position:** Match free competitors on audit, monetize ongoing tools

---

### Free Tier (Match Careerflow - Table Stakes)
- Readiness Score (0-100)
- AI headline suggestion (copy button)
- **Full 15-20 fixes** (NOT gated - this is key)
- 1 audit per month per email
- Email capture required

**Why give away full fixes?**
- Careerflow already does this for free
- Gating fixes = users go to competitors
- Free value builds trust for paid conversion

---

### Pro Tier: $19/month or $149/year (35% savings)

**Ongoing value (not just "more fixes"):**
- Unlimited audits (monthly re-checks)
- Content Generator access (LinkedIn posts)
- Resume tailoring per job (Phase 1.5)
- Progress tracking over time
- Priority support

**Why $19/mo?**
- Resume Worded proven price point
- Below Jobscan ($49) and Teal ($36/mo effective)
- Above "throwaway" tier ($9)
- Hits "no-brainer" threshold for job seekers

---

### Alternative: Hybrid Model (Test Later)

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | Full audit, 1/month |
| Quick Fix | $29 one-time | PDF export + About section rewrite |
| Pro | $19/mo | Ongoing tools + unlimited audits |

**Test hypothesis:** Some users want one-time, others want subscription

---

### Revenue Projections (Conservative)

**Assumptions:**
- 1,000 free audits/month (from influencer traffic)
- 70% email capture rate = 700 emails
- 3% free-to-paid conversion = 21 Pro subscribers
- $19/mo × 21 = **$399/month** (Month 1)

**Month 3 (with retention):**
- 63 cumulative subscribers (3 months × 21, assume 0 churn)
- $19 × 63 = **$1,197/month**

**Month 6 (optimistic):**
- 126 subscribers
- $19 × 126 = **$2,394/month**

**Break-even analysis:**
- If we need $5K/month for influencer rev share + costs
- Need 263 Pro subscribers
- At 3% conversion = 8,767 free audits/month needed
- Achievable with 3 influencers posting monthly

---

## MVP Checklist

### Backend
- [ ] `POST /api/audit` - Profile scraping + AI analysis
- [ ] `GET /api/audit/:id` - Retrieve saved audit
- [ ] `POST /api/checkout` - Stripe payment flow
- [ ] `POST /api/webhook/stripe` - Handle payment confirmation
- [ ] Database migrations (Supabase)

### Frontend
- [x] Onboarding Step 1: LinkedIn OAuth
- [x] Onboarding Step 2: Profile URL input
- [x] Onboarding Step 3: Score display
- [ ] Loading animation polish
- [ ] Fix cards with expand/collapse
- [ ] Headline copy button
- [ ] Payment modal/redirect
- [ ] Dashboard page
- [ ] Mobile responsive fixes

### Infrastructure
- [ ] Vercel deployment
- [ ] Environment variables configured
- [ ] Stripe products created
- [ ] Custom domain (optional)

### Launch Prep
- [ ] Privacy policy page
- [ ] Terms of service page
- [ ] Error handling / fallbacks
- [ ] Analytics (Plausible or PostHog)
- [ ] Influencer affiliate links setup

---

## Testing Scenarios

### Happy Path
1. User lands on `/onboarding`
2. Clicks "Connect with LinkedIn"
3. Completes OAuth, returns to Step 2
4. Pastes `linkedin.com/in/username`
5. Sees loading animation
6. Gets score (e.g., 68) + headline + 5 fixes
7. Clicks "Unlock Full Report"
8. Pays $97 via Stripe
9. Sees full 20+ fixes

### Edge Cases
- Invalid LinkedIn URL → Show error, don't proceed
- Scraping fails → Fallback to manual input or mock data
- AI API fails → Show generic recommendations
- Payment fails → Show error, allow retry
- User already has audit → Load existing, offer re-audit

---

## Timeline

### Week 1
- [ ] Finalize `/api/audit` endpoint
- [ ] Profile scraping working reliably
- [ ] AI analysis returning quality results
- [ ] Database storing audits

### Week 2
- [ ] Payment flow with Stripe
- [ ] Gated content (free vs paid)
- [ ] Dashboard page
- [ ] Mobile polish

### Week 3
- [ ] Testing with real profiles
- [ ] Bug fixes
- [ ] Soft launch with Kumud's audience
- [ ] Iterate based on feedback

---

*Last Updated: March 18, 2026*
