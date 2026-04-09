# Monetization Strategy

Revenue model and pricing for LinkedIn Deal Magnet.

---

## Revenue Streams

### 1. Profile Rewrite Service ($97 one-time) - PRIMARY
**Product:** Done-for-you LinkedIn profile rewrite
**Deliverable:** Optimized headline + About section + Top 3 experience descriptions (PDF)
**Timeline:** 24-48 hours
**Includes:** 1 free revision

**Pricing Rationale:**
- Below "high-ticket" ($100+) → Feels accessible
- Above "cheap" ($20-50) → Perceived as premium
- Charm pricing ($97 vs $100) → Higher conversion
- One-time payment → Lower friction than subscription

**Target Conversion:** 3-5% of free audit users

**Projections (Conservative):**
| Free Audits/Month | Conversion | Sales | Revenue |
|-------------------|------------|-------|---------|
| 1,000 | 3% | 30 | $2,910 |
| 5,000 | 3% | 150 | $14,550 |
| 10,000 | 4% | 400 | $38,800 |

---

### 2. Pro Subscription ($19/month) - FUTURE
**Product:** Ongoing LinkedIn optimization tools
**Features:**
- Unlimited profile audits (monthly re-checks)
- LinkedIn content generator access
- Resume tailoring per job (Phase 1.5)
- Job alerts with priority access (Phase 2)
- Progress tracking over time
- Priority support

**Pricing Rationale:**
- Resume Worded proven price point ($29/mo)
- Below Jobscan ($49/mo) and Teal ($36/mo effective)
- Above "throwaway" tier ($9/mo)
- Hits "no-brainer" threshold for active job seekers

**Target Conversion:** 2-3% of free users

**Projections:**
| Free Audits/Month | Conversion | Subscribers | MRR |
|-------------------|------------|-------------|-----|
| 1,000 | 2% | 20 | $380 |
| 5,000 | 2% | 100 | $1,900 |
| 10,000 | 3% | 300 | $5,700 |

**Retention Target:** 70% after 3 months

---

### 3. Add-On Services (Phase 1.5)
| Service | Price | Conversion | Revenue/Month (at 1K audits) |
|---------|-------|------------|-------------------------------|
| Resume Rewrite | $49 | 5% | $2,450 |
| Cover Letter Template | $29 | 3% | $870 |
| Profile + Resume Bundle | $129 (save $17) | 4% | $5,160 |

---

### 4. Affiliate Revenue (Phase 2)
**Partners:** Career coaches, resume writers, interview prep services
**Model:** Rev share (30-40% commission to affiliates)

**Example:**
- Kumud promotes to 183K followers
- 0.5% click through = 915 visitors
- 3% conversion = 27 sales × $97 = $2,619
- Kumud's 40% = $1,048
- Our 60% = $1,571

**Affiliate Tracking:**
- UTM parameters in URLs
- Unique promo codes
- Dashboard for affiliates to track conversions

---

### 5. Sponsored Job Listings (Phase 2+)
**Product:** Companies pay to feature jobs on our job board
**Pricing:** $99-$299 per 30-day job listing
**Placement:** Top 3 results in relevant searches

**Target:** 10-20 sponsored jobs/month
**Revenue:** $1,000-$6,000/month

---

## Pricing Psychology

### Why One-Time Payment Works Better Than Subscription (For This Product)

**User Intent:**
- "I need my LinkedIn fixed NOW" (urgent, one-time need)
- Not: "I want ongoing LinkedIn help" (that's the Pro tier)

**Conversion Factors:**
- Lower friction (no recurring commitment)
- Immediate value delivery
- Clear ROI (better profile → more opportunities)

**Data-Backed:**
- Career tools: One-time resume rewrites sell 3x better than subscriptions
- TopResume ($149) and ZipJob ($139) use one-time model successfully
- Subscription fatigue is real (users have 5+ subs already)

---

### Freemium Conversion Best Practices

**What We Give Free:**
- Full LinkedIn audit (score + headline + all 15-20 fixes)
- Why? Careerflow already does this - it's table stakes

**What We Charge For:**
- Done-for-you implementation (Profile Rewrite)
- Ongoing tools (Pro subscription)
- Add-on services (resume, cover letter)

**The Upgrade Moment:**
- User sees fixes but thinks "I don't want to do this myself"
- CTA: "Get it done for you in 24 hours - $97"
- Frame as time-saving, not feature-gating

---

## Revenue Projections (6-Month Forecast)

### Conservative Scenario
| Month | Free Audits | Profile Rewrites ($97) | Pro Subs ($19) | Total Revenue |
|-------|-------------|------------------------|----------------|---------------|
| 1 | 500 | 15 ($1,455) | 10 ($190) | $1,645 |
| 2 | 1,000 | 30 ($2,910) | 30 ($570) | $3,480 |
| 3 | 1,500 | 45 ($4,365) | 60 ($1,140) | $5,505 |
| 4 | 2,000 | 70 ($6,790) | 100 ($1,900) | $8,690 |
| 5 | 2,500 | 90 ($8,730) | 140 ($2,660) | $11,390 |
| 6 | 3,000 | 120 ($11,640) | 180 ($3,420) | $15,060 |

**6-Month Total:** $45,770

---

### Optimistic Scenario (With Influencer Launch)
| Month | Free Audits | Profile Rewrites ($97) | Pro Subs ($19) | Total Revenue |
|-------|-------------|------------------------|----------------|---------------|
| 1 | 1,000 | 30 ($2,910) | 20 ($380) | $3,290 |
| 2 | 3,000 | 120 ($11,640) | 90 ($1,710) | $13,350 |
| 3 | 5,000 | 200 ($19,400) | 180 ($3,420) | $22,820 |
| 4 | 7,000 | 280 ($27,160) | 280 ($5,320) | $32,480 |
| 5 | 8,000 | 320 ($31,040) | 360 ($6,840) | $37,880 |
| 6 | 10,000 | 400 ($38,800) | 450 ($8,550) | $47,350 |

**6-Month Total:** $157,170

---

## Cost Structure

### Fixed Costs (Monthly)
| Item | Cost |
|------|------|
| Anthropic API (10K audits × $0.08) | $800 |
| Supabase Pro | $25 |
| Vercel Pro | $20 |
| Resend (50K emails) | $20 |
| Domain + SSL | $10 |
| **Total Fixed** | **$875** |

### Variable Costs (Per Sale)
| Item | Cost |
|------|------|
| Stripe fee (2.9% + $0.30) | $3.11 per $97 sale |
| Affiliate commission (40%) | $38.80 per $97 sale (if referred) |

### Break-Even Analysis
- Fixed costs: $875/month
- Need: 9 sales ($97) = $873 to cover fixed costs
- OR: 46 Pro subs ($19) = $874 to cover fixed costs

**Break-even at:** <100 free audits/month (assuming 3% conversion)

---

## Pricing Tests to Run (Post-Launch)

### A/B Test #1: Profile Rewrite Price
- **Control:** $97
- **Variant A:** $79 (lower barrier)
- **Variant B:** $127 (higher perceived value)
- **Hypothesis:** $97 converts best (charm pricing sweet spot)

### A/B Test #2: Pro Subscription Price
- **Control:** $19/month
- **Variant A:** $29/month (higher value perception)
- **Variant B:** $9/month (impulse buy)
- **Hypothesis:** $19 converts best (Resume Worded proven)

### A/B Test #3: Bundle Pricing
- **Control:** $97 profile + $49 resume = $146 separate
- **Variant:** $129 bundle (save $17)
- **Hypothesis:** Bundle increases AOV (average order value)

### A/B Test #4: Free Tier Scope
- **Control:** Full audit free (all fixes)
- **Variant:** Top 5 fixes free, rest gated
- **Hypothesis:** Full free converts better (trust-building)

---

## Upsell Paths

### Path 1: Free Audit → Profile Rewrite ($97)
**Trigger:** After user sees audit results
**CTA:** "Get Your Profile Professionally Rewritten - $97"
**Value Prop:** Save 3+ hours, done by experts, delivered in 24-48 hours

### Path 2: Free Audit → Pro Subscription ($19/mo)
**Trigger:** After user sees audit results
**CTA:** "Want Ongoing Optimization? Try Pro"
**Value Prop:** Monthly re-audits, content generator, job alerts

### Path 3: Job Search → Profile Optimizer
**Trigger:** User views job detail page
**CTA:** "Optimize Your Profile for This Job - $97"
**Value Prop:** AI tailors your profile to match job requirements

### Path 4: Profile Rewrite → Resume Rewrite (+$49)
**Trigger:** In payment confirmation email
**CTA:** "Complete Your Job Search Toolkit - Add Resume Rewrite"
**Value Prop:** Bundled discount, one-stop solution

---

## Referral Program (Future)

**Concept:** "Refer 3 friends, get your next audit free"
- User shares unique referral link
- Friends complete audits using link
- User earns credits toward Pro subscription or services

**Incentive Structure:**
- 1 referral = $10 credit
- 3 referrals = Free month of Pro ($19 value)
- 10 referrals = Free profile rewrite ($97 value)

**Viral Coefficient Target:** 0.5 (each user refers 0.5 new users on average)

---

## Lifetime Value (LTV) Calculation

### One-Time Customer
- Initial: $97 profile rewrite
- Upsell: $49 resume (30% take rate)
- **LTV:** $97 + ($49 × 0.3) = **$111.70**

### Pro Subscriber
- Month 1: $19
- Retention: 70% after 3 months, 50% after 6 months
- **LTV:** $19 × 4.2 months avg = **$79.80**

### Hybrid Customer (Profile Rewrite + Pro)
- Initial: $97 profile rewrite
- Subscribe: $19/month for 6 months
- **LTV:** $97 + ($19 × 6) = **$211**

**Goal:** Convert 20% of one-time buyers to Pro subscribers

---

## Success Metrics

### Month 1
- [ ] $1,500+ revenue
- [ ] 3%+ conversion (free → paid)
- [ ] 10+ Pro subscribers

### Month 3
- [ ] $5,000+ revenue
- [ ] 4%+ conversion
- [ ] 50+ Pro subscribers
- [ ] 70%+ Pro retention

### Month 6
- [ ] $15,000+ revenue
- [ ] 5%+ conversion
- [ ] 150+ Pro subscribers
- [ ] $200+ LTV per customer

---

**Last Updated:** March 19, 2026
