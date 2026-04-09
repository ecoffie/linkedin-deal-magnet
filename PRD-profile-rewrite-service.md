# PRD: Profile Rewrite Service ($97)

**Product:** Done-for-you LinkedIn profile rewrite
**Price:** $97 one-time payment
**Timeline:** 24-48 hour delivery
**Includes:** 1 round of revisions

---

## Problem Statement

Users completing the free LinkedIn audit get a score and fixes, but many don't have time or confidence to implement changes themselves. They want a "just do it for me" option.

**User pain points:**
- "I don't know what to write about myself"
- "I'm not a good writer"
- "I don't have time to rewrite everything"
- "I want it done right, not mediocre"

---

## Solution

Professional LinkedIn profile rewrite service that delivers:
1. **Optimized headline** (under 220 chars, keyword-rich)
2. **Rewritten About section** (1,500-2,000 chars, compelling story)
3. **Top 3 experience role descriptions** (quantified achievements, bullet format)

Delivered as a formatted PDF with copy-paste instructions.

---

## User Journey

### Step 1: User Completes Free Audit
- User gets audit results (score + fixes)
- Sees CTA card: "Get Your Profile Professionally Rewritten - $97"

### Step 2: User Clicks "Get Started"
- Modal opens explaining what's included
- "What you'll get:" section with 3 deliverables listed
- "How it works:" 3 steps (Pay → We rewrite → You update)
- CTA button: "Get Started - $97"

### Step 3: Stripe Checkout
- Redirect to Stripe hosted checkout
- Pre-filled with user email from audit
- Payment methods: Card, Apple Pay, Google Pay
- Success → Redirect to confirmation page

### Step 4: Confirmation Page
- "Payment received! ✅"
- "Your profile rewrite will be delivered to [email] within 24-48 hours"
- "What to expect:" timeline explanation
- CTA: "Go to Dashboard" (where they can track status)

### Step 5: Delivery Email (24-48 hours later)
- Email with PDF attached
- Subject: "Your LinkedIn Profile Rewrite is Ready! 🎉"
- Body: What's included, next steps, revision policy
- CTA: "Questions? Reply to this email"

### Step 6: Customer Updates Profile
- User copies content from PDF to LinkedIn
- Takes ~15 minutes to update all sections
- Optional: Re-run free audit to see new score

### Step 7 (Optional): Revision Request
- Customer replies to email with feedback
- We make revisions within 24 hours
- Deliver updated PDF
- Note: 1 revision included, additional $29

---

## Deliverable Specifications

### 1. Optimized Headline (under 220 characters)

**Format:** `[Role/Expertise] | [Value Proposition] | [Target Audience/Outcome]`

**Requirements:**
- Under 220 characters (LinkedIn's limit)
- Includes industry keywords for searchability
- Shows value proposition or results
- Speaks to target audience

**Example:**
```
Before: "Product Manager at Acme Corp"
After: "Senior Product Manager | Helping SaaS Startups Scale from $1M to $10M ARR | Expert in Data-Driven Growth"
```

---

### 2. Rewritten About Section (1,500-2,000 characters)

**5-Part Structure:**
1. **Hook** (2-3 sentences): Who you help, transformation you provide
2. **Story** (3-4 sentences): Your background, what led you here
3. **What You Do** (4-5 sentences): Approach, methodology, what makes you different
4. **Proof** (2-3 sentences): Social proof, achievements, credibility
5. **CTA** (1-2 sentences): Clear next step for reader

**Requirements:**
- 1,500-2,000 characters (LinkedIn's sweet spot for SEO)
- First person voice
- Natural keyword integration
- Tells a story (not resume bullets)
- Ends with clear call-to-action

**Tone Options:**
- Professional (B2B, executives, consultants)
- Conversational (coaches, creatives, community builders)
- Bold/Direct (founders, thought leaders)
- Warm/Empathetic (healthcare, education, coaching)

---

### 3. Top 3 Experience Role Descriptions

For each of the user's 3 most recent roles:

**Format:**
```
[Role Title] at [Company]
[Duration]

• Achieved X by doing Y, resulting in Z
• Built/Led/Launched [initiative] that [measurable outcome]
• Drove [metric] from X to Y through [approach]
```

**Requirements:**
- 3-5 bullet points per role
- Start with action verbs (Led, Built, Launched, Drove, Achieved)
- Include quantified achievements where possible
- Under 500 characters total per role
- Professional but engaging tone

---

## PDF Deliverable Format

**8-Page Structured PDF:**

1. **Cover Page**
   - "LinkedIn Profile Rewrite"
   - User's name
   - Delivery date
   - Branding

2. **Headline Page**
   - Current vs New (side-by-side comparison)
   - Character count
   - "Why this works" explanation

3-4. **About Section (2 pages)**
   - Full rewritten text
   - Copy-paste instructions
   - Character count

5-7. **Experience Descriptions (3 pages, 1 per role)**
   - Role title, company, duration
   - New bullet points
   - Copy-paste instructions

8. **Next Steps Checklist**
   - Implementation steps
   - Additional optimization tips
   - Reminder about revision policy

**Design:**
- LinkedIn blue branding (#0077B5)
- Clean typography (Inter or similar sans-serif)
- White space for readability
- Professional but approachable

---

## Technical Implementation

### Backend Endpoints

#### 1. `POST /api/checkout`
**Purpose:** Create Stripe checkout session for $97 product

**Request:**
```json
{
  "auditId": "uuid",
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "sessionUrl": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

**Logic:**
1. Validate audit exists
2. Check if already paid (prevent double charging)
3. Create Stripe checkout session
4. Store session_id in payments table
5. Return checkout URL

---

#### 2. `POST /api/webhook/stripe`
**Purpose:** Handle Stripe payment confirmation

**Triggered by:** `checkout.session.completed` event from Stripe

**Logic:**
1. Verify webhook signature
2. Extract payment_intent_id, customer_id, session_id
3. Update payments table (status = 'succeeded')
4. Mark audit as paid
5. Trigger profile rewrite agent
6. Send confirmation email to customer

---

#### 3. `POST /api/rewrite/trigger` (Internal - Agent)
**Purpose:** Trigger the Profile Rewrite Agent

**Request:**
```json
{
  "auditId": "uuid",
  "paymentId": "uuid"
}
```

**Logic:**
1. Launch Profile Rewrite Agent (see `.claude/agents/profile-rewrite-agent.md`)
2. Agent generates all content
3. Agent creates PDF
4. Agent sends email with PDF
5. Agent updates database (delivered_at timestamp)

---

### Database Schema Additions

Add to `payments` table:
```sql
ALTER TABLE payments ADD COLUMN fulfillment_status VARCHAR(50);
ALTER TABLE payments ADD COLUMN fulfilled_at TIMESTAMP;
ALTER TABLE payments ADD COLUMN delivery_email_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE payments ADD COLUMN revision_requested BOOLEAN DEFAULT FALSE;
ALTER TABLE payments ADD COLUMN revision_delivered_at TIMESTAMP;
```

Add to `audits` table:
```sql
ALTER TABLE audits ADD COLUMN delivered_at TIMESTAMP;
ALTER TABLE audits ADD COLUMN delivery_status VARCHAR(50); -- 'pending', 'delivered', 'revised'
ALTER TABLE audits ADD COLUMN pdf_url TEXT; -- S3/Supabase storage URL
```

---

## Pricing Rationale

**Why $97?**
- Below "high-ticket" threshold ($100+) → feels accessible
- Above "cheap" tier ($20-50) → perceived as premium quality
- Charm pricing ($97 vs $100) → higher conversion
- One-time payment → lower friction than subscription
- Matches user intent: "I need this fixed NOW"

**Comparable Services:**
- TopResume LinkedIn rewrite: $149-$299
- ZipJob LinkedIn optimization: $139
- Freelance LinkedIn writers on Upwork: $50-$200
- **Our position:** Premium quality at accessible price

**Revenue Projections:**
- 1,000 free audits/month
- 3% conversion to $97 = 30 sales
- 30 × $97 = $2,910/month revenue
- Stripe fees (2.9% + $0.30) = ~$100
- Net: $2,810/month

---

## Quality Assurance

### Before Delivery Checklist:
- [ ] Headline under 220 characters
- [ ] About section 1,500-2,000 characters
- [ ] All 3 experience roles rewritten
- [ ] No typos or grammatical errors
- [ ] No placeholder text (e.g., "[insert link]")
- [ ] PDF renders correctly on Mac/Windows
- [ ] Email delivers successfully
- [ ] Database updated with delivery timestamp

### Customer Satisfaction Metrics:
- **Target:** 95%+ satisfaction
- **Measure via:** Post-delivery email survey (1-10 rating)
- **Track:** Revision request rate (<5% target)

---

## Revision Policy

**Included:**
- 1 free revision within 7 days of delivery
- Covers: tone adjustments, minor rewrites, adding details
- Does not cover: Complete start-over requests

**Additional Revisions:**
- $29 per additional revision
- Same 24-hour turnaround
- Unlimited revisions available for purchase

**How to Request:**
- Reply to delivery email with specific feedback
- We'll confirm scope (free revision vs paid)
- Deliver revised version within 24 hours

---

## Success Metrics (Month 1)

- [ ] 30+ sales ($2,910 revenue)
- [ ] 100% delivered within 48 hours
- [ ] <5% revision requests
- [ ] 4.5+ average satisfaction score (out of 5)
- [ ] 0 refund requests

---

## Future Enhancements (Phase 1.5)

- [ ] Add-on: Resume rewrite (+$49)
- [ ] Add-on: Cover letter template (+$29)
- [ ] Package deal: Profile + Resume + Cover letter ($149, save $26)
- [ ] Recurring service: Monthly profile refresh ($29/mo)
- [ ] Agency tier: 5+ profiles at once ($79/profile)

---

**Last Updated:** March 19, 2026
