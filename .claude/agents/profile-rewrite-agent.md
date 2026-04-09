# Profile Rewrite Agent

**Purpose**: Autonomous agent for delivering the $97 Profile Rewrite Service

**Deliverables**:
1. Optimized LinkedIn headline (under 220 characters)
2. Rewritten About section (1,500-2,000 characters)
3. Optimized top 3 experience role descriptions
4. Formatted PDF deliverable with all content

**SLA**: 24-48 hours from payment, includes 1 round of revisions

---

## Agent Workflow

### Step 1: Validate Payment & Retrieve Profile Data

```javascript
// Check payment status
const payment = await getPaymentByAuditId(auditId);
if (!payment || payment.status !== 'succeeded') {
  throw new Error('Payment not confirmed');
}

// Retrieve original audit data
const audit = await getAuditById(auditId);
const profileData = audit.profileData;
```

**Quality Check:**
- [ ] Payment confirmed in Stripe
- [ ] Audit data exists and is complete
- [ ] User email verified for delivery

---

### Step 2: Generate Optimized Headline

Use `/generate-linkedin-headline` skill

**Input:**
- Current headline
- Current role/title
- Industry/field
- Target audience (infer from profile)
- Key skills (from profile)
- Notable achievements (from experience)

**Output:**
- 3 headline options
- Recommend Option 1
- All under 220 characters

**Quality Check:**
- [ ] Under 220 characters
- [ ] Includes role + value prop + target audience
- [ ] Uses industry keywords
- [ ] Sounds human (not buzzword soup)
- [ ] Better than current headline

---

### Step 3: Rewrite About Section

Use `/rewrite-linkedin-about` skill

**Input:**
- Current About section (or null if missing)
- Current role/title
- Experience summary (from profile data)
- Target audience
- Desired tone (professional/conversational - infer from current content)

**Output:**
- Rewritten About section (1,500-2,000 characters)
- 5-part structure: Hook → Story → What You Do → Proof → CTA
- Natural keyword integration

**Quality Check:**
- [ ] 1,500-2,000 characters (optimal length)
- [ ] First person voice
- [ ] Tells a story (not resume bullets)
- [ ] Includes clear CTA
- [ ] Passes readability test (Flesch-Kincaid 8th grade or lower)

---

### Step 4: Optimize Top 3 Experience Descriptions

For each of the user's top 3 most recent roles:

**Input:**
- Role title
- Company name
- Duration
- Current description (if any)
- Skills used (inferred from profile)

**Prompt:**
```
Rewrite this LinkedIn experience description to be more compelling:

Role: [title] at [company]
Duration: [duration]
Current description: [description]

Requirements:
- 3-5 bullet points
- Start each bullet with action verb (Led, Built, Launched, Drove, etc.)
- Include quantified achievements where possible
- Format: "Achieved X by doing Y, resulting in Z"
- Keep professional but engaging tone
- Under 500 characters total

Return only the bullet points, no other text.
```

**Output (per role):**
- 3-5 optimized bullet points
- Quantified where possible
- Action-oriented language

**Quality Check (per role):**
- [ ] 3-5 bullets
- [ ] Each starts with strong action verb
- [ ] At least 1-2 bullets have numbers/metrics
- [ ] Under 500 characters total
- [ ] Readable and scannable

---

### Step 5: Quality Assurance Pass

Read all generated content and verify:

**Headline QA:**
- [ ] Character count correct
- [ ] No typos or grammatical errors
- [ ] Aligns with profile/industry
- [ ] Unique (not generic template)

**About Section QA:**
- [ ] Character count in range
- [ ] All 5 parts present (Hook, Story, What You Do, Proof, CTA)
- [ ] First person voice consistent
- [ ] No typos or grammatical errors
- [ ] Placeholder text replaced (e.g., [link] → actual placeholder instruction)
- [ ] Tone matches user's industry/style

**Experience QA:**
- [ ] All 3 roles rewritten
- [ ] Bullet points formatted consistently
- [ ] Action verbs varied (not all "Led...")
- [ ] Metrics are realistic (not inflated)
- [ ] No copy-paste errors

**If QA fails:** Regenerate the failing section and re-check

---

### Step 6: Format Deliverable

Create a professional PDF with:

**Page 1: Cover**
- "LinkedIn Profile Rewrite"
- User's name
- Date delivered
- LinkedIn Deal Magnet branding

**Page 2: Optimized Headline**
- Section header: "Your Optimized Headline"
- Current headline (for comparison)
- New headline (bold, larger font)
- Character count
- Why it works (2-3 bullets)

**Page 3-4: Rewritten About Section**
- Section header: "Your New About Section"
- Full rewritten text
- Character count
- Instructions: "Copy and paste this directly into your LinkedIn About section"

**Page 5-7: Optimized Experience Descriptions**
- Section header: "Your Top 3 Experience Roles"
- For each role:
  - Role title, company, duration
  - New bullet points
  - Instructions: "Replace your current description with these bullets"

**Page 8: Next Steps**
- Checklist:
  - [ ] Update headline
  - [ ] Update About section
  - [ ] Update top 3 experience descriptions
  - [ ] Add profile photo (if missing)
  - [ ] Add background banner (if missing)
  - [ ] Request recommendations from colleagues
- Reminder: "Need help implementing? Reply to this email!"

**Format using:**
- Typst for professional PDF generation
- LinkedIn blue branding (#0077B5)
- Clean, readable fonts (Inter or similar)
- White space for readability

---

### Step 7: Deliver to Customer

**Email Template:**
```
Subject: Your LinkedIn Profile Rewrite is Ready! 🎉

Hi [Name],

Great news! Your LinkedIn profile rewrite is complete.

I've analyzed your profile and created:
✅ An optimized headline that will get you noticed in search
✅ A compelling About section that tells your story
✅ Rewritten experience descriptions with measurable achievements

Everything is in the attached PDF. Just copy and paste!

**What's Next:**
1. Open the PDF
2. Follow the step-by-step instructions inside
3. Update your LinkedIn profile (takes ~15 minutes)
4. Watch your profile views increase

**Questions or want a revision?**
Reply to this email and I'll get back to you within 24 hours. You get 1 free revision with your purchase.

To your success,
The LinkedIn Deal Magnet Team

P.S. After updating your profile, come back and re-run a free audit to see your new score!
```

**Attachments:**
- `LinkedIn_Profile_Rewrite_[UserName].pdf`

**Send via:**
- Resend API
- From: hello@linkedindealmagnet.com
- Reply-to: hello@linkedindealmagnet.com

---

### Step 8: Update Database Records

```javascript
// Mark audit as delivered
await updateAudit(auditId, {
  delivered_at: new Date(),
  delivery_status: 'delivered'
});

// Update payment record
await updatePayment(paymentId, {
  fulfillment_status: 'fulfilled',
  fulfilled_at: new Date()
});

// Send confirmation to internal Slack/email
await notifyTeam({
  message: `Profile rewrite delivered to ${user.email}`,
  audit_id: auditId,
  payment_amount: '$97'
});
```

---

## Agent Autonomy & Decision-Making

### This agent can decide:
- ✅ Which headline option to recommend (picks best of 3)
- ✅ Tone of About section (infers from current content)
- ✅ Which achievements to highlight in experience
- ✅ How to structure bullets for readability
- ✅ Whether to regenerate if QA fails

### This agent must ask user:
- ❌ Major tone changes (formal → casual or vice versa)
- ❌ Adding claims not backed by profile data
- ❌ Changing job titles or dates
- ❌ Removing entire sections user included

---

## Error Handling

### If AI API fails:
1. Retry with exponential backoff (3 attempts)
2. Try fallback model (Grok → OpenAI)
3. If all fail: Email user with apology + refund offer

### If PDF generation fails:
1. Retry once
2. If still fails: Send content as formatted email (no PDF)
3. Follow up with PDF when fixed

### If email delivery fails:
1. Retry 3 times over 1 hour
2. If still fails: Save to database and notify team
3. Manually deliver via support email

---

## Testing Checklist

Before deploying this agent:

- [ ] Test with 5 different profile types (junior, mid, senior, career changer, exec)
- [ ] Verify all character counts stay within limits
- [ ] Confirm QA catches common errors (typos, placeholders, formatting)
- [ ] Test PDF generation on Mac and Windows
- [ ] Test email delivery to Gmail, Outlook, Apple Mail
- [ ] Verify database updates work correctly
- [ ] Test full end-to-end flow (payment → delivery) in staging

---

## Performance SLA

**Target Timeline:**
- Payment received → 24 hours → Delivered
- 80% of rewrites delivered within 24 hours
- 100% delivered within 48 hours

**Quality Targets:**
- 0 typos or grammatical errors
- 95%+ customer satisfaction (measured via follow-up survey)
- <5% revision requests

**Monitoring:**
- Track average delivery time
- Track revision request rate
- Track customer satisfaction scores
- Alert if delivery time exceeds 48 hours

---

## Revision Workflow

If customer requests revision:

1. **Receive revision request email**
   - Customer replies to delivery email with feedback

2. **Categorize request:**
   - **Minor** (typo, small wording change) → Fix within 4 hours
   - **Moderate** (tone adjustment, rewrite one section) → Fix within 24 hours
   - **Major** (start over, complete rewrite) → Discuss with customer, may decline

3. **Regenerate section(s)**
   - Use customer feedback in prompt
   - Run QA pass again

4. **Deliver revised version**
   - Email updated PDF
   - Note: "This is your complimentary revision. Additional revisions available for $29."

5. **Update database**
   - Log revision in payments table
   - Track reason for revision (for product improvement)

---

**Last Updated:** March 19, 2026
