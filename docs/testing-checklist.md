# Testing Checklist

Pre-launch QA checklist for LinkedIn Deal Magnet.

---

## Pre-Deployment Checklist

### Environment Variables
- [ ] All required env vars set in Vercel dashboard
- [ ] No secrets committed to git
- [ ] `.env.example` file created with placeholders
- [ ] Production API keys tested (not test mode keys)

### API Integrations
- [ ] Anthropic API key works (test with profile audit)
- [ ] Stripe API key works (test checkout creation)
- [ ] Supabase connection works (test query)
- [ ] LinkedIn OAuth works (test login flow)
- [ ] Resend API key works (test email send) - Phase 2

### Database
- [ ] All tables exist (users, audits, payments, email_subscribers)
- [ ] Row-level security enabled
- [ ] Indexes created for performance
- [ ] Sample data inserted successfully

---

## Functional Testing

### Landing Page (`/` or `/onboarding`)
- [ ] Page loads without errors
- [ ] All images load
- [ ] Stats display correctly (3,200+ audits, etc.)
- [ ] "Get Started Free" CTA works
- [ ] Navigation links work
- [ ] Mobile responsive (test on iPhone, Android)

### Onboarding Flow (`/onboarding`)
- [ ] Step 1: LinkedIn OAuth button works
- [ ] Step 1: "Skip for now" works
- [ ] Step 2: Manual input form displays
- [ ] Step 2: Character counters update in real-time
- [ ] Step 2: Email validation works
- [ ] Step 2: Profile URL validation works
- [ ] Step 2: Required fields prevent submission if empty
- [ ] Step 3: Loading animation displays
- [ ] Step 3: Loading text updates ("Processing profile...")
- [ ] Step 4: Results display correctly
  - [ ] Score ring animates
  - [ ] Score label displays (Excellent, Looking Good, etc.)
  - [ ] AI headline displays
  - [ ] Headline copy button works
  - [ ] Fix cards display with priority badges
  - [ ] Fix cards show all fixes (not truncated)
  - [ ] $97 CTA card displays
  - [ ] $97 CTA button is clickable

### API Endpoints

#### `POST /api/audit-manual`
- [ ] Returns 200 status for valid input
- [ ] Returns 400 for missing required fields
- [ ] Returns 500 for AI API failure
- [ ] Score is between 0-100
- [ ] Score label matches score range
- [ ] AI headline is under 220 characters
- [ ] Fixes array has 15-20 items
- [ ] Each fix has priority, title, description, tips
- [ ] Response time <15 seconds
- [ ] Saves to database successfully

#### `POST /api/checkout` (To Build)
- [ ] Creates Stripe checkout session
- [ ] Returns valid session URL
- [ ] Redirects to Stripe hosted checkout
- [ ] Pre-fills email from audit
- [ ] Prevents duplicate payments for same audit

#### `POST /api/webhook/stripe` (To Build)
- [ ] Verifies webhook signature
- [ ] Updates payment status to 'succeeded'
- [ ] Marks audit as paid
- [ ] Triggers email delivery
- [ ] Returns 200 to Stripe

### Payment Flow (End-to-End)
- [ ] Click "$97 CTA" → Redirects to Stripe
- [ ] Enter test card `4242 4242 4242 4242`
- [ ] Payment succeeds
- [ ] Webhook fires and updates database
- [ ] User redirected to success page
- [ ] Email delivered within 1 minute
- [ ] Email contains PDF attachment
- [ ] PDF opens correctly (Mac, Windows, mobile)

### Email Delivery (Resend - Phase 2)
- [ ] Audit results email sends
- [ ] Payment confirmation email sends
- [ ] Weekly LinkedIn tips email sends
- [ ] Job alerts email sends (Phase 2)
- [ ] Unsubscribe link works
- [ ] Emails render correctly (Gmail, Outlook, Apple Mail)

---

## Security Testing

### Input Validation
- [ ] XSS prevention (test `<script>alert('xss')</script>` in text fields)
- [ ] SQL injection prevention (test `'; DROP TABLE users--` in inputs)
- [ ] Email validation (reject invalid formats)
- [ ] URL validation (reject non-LinkedIn URLs)
- [ ] Character limits enforced (headline 220, about 2600)

### Authentication
- [ ] LinkedIn OAuth works
- [ ] Session persists after login
- [ ] Logout works
- [ ] Can't access dashboard without login (future)

### Rate Limiting
- [ ] Max 5 audits per email per day
- [ ] Max 3 payment attempts per hour per IP
- [ ] API returns 429 when rate limited

### Data Privacy
- [ ] User can only see their own audits (RLS)
- [ ] Passwords hashed (if we add password auth later)
- [ ] Sensitive data encrypted at rest (Supabase default)
- [ ] HTTPS enforced in production

---

## Performance Testing

### Page Load Speed
- [ ] Landing page loads <2 seconds (Lighthouse)
- [ ] Onboarding page loads <2 seconds
- [ ] Results page loads <2 seconds
- [ ] All pages score 90+ on Lighthouse Performance

### API Response Times
- [ ] `/api/audit-manual` responds <15 seconds (AI API call)
- [ ] `/api/checkout` responds <1 second
- [ ] `/api/jobs/search` responds <2 seconds (Phase 2)

### Database Query Performance
- [ ] Audit retrieval by email <100ms
- [ ] Payment lookup by stripe_payment_id <100ms
- [ ] All queries use indexes (check EXPLAIN in Supabase)

---

## Mobile Testing

### iOS Safari
- [ ] Landing page displays correctly
- [ ] Onboarding form works (input fields, buttons)
- [ ] Character counters update
- [ ] Results page scrollable
- [ ] CTA buttons tappable (not too small)
- [ ] Stripe checkout works

### Android Chrome
- [ ] Landing page displays correctly
- [ ] Onboarding form works
- [ ] Character counters update
- [ ] Results page scrollable
- [ ] CTA buttons tappable
- [ ] Stripe checkout works

### Responsive Breakpoints
- [ ] Mobile (320px-768px)
- [ ] Tablet (768px-1024px)
- [ ] Desktop (1024px+)

---

## Browser Compatibility

### Chrome (Latest)
- [ ] All features work
- [ ] No console errors

### Safari (Latest)
- [ ] All features work
- [ ] No console errors

### Firefox (Latest)
- [ ] All features work
- [ ] No console errors

### Edge (Latest)
- [ ] All features work
- [ ] No console errors

---

## Error Handling

### API Errors
- [ ] AI API timeout → Show friendly error
- [ ] AI API 500 error → Fallback to Grok/OpenAI
- [ ] Stripe API error → Show retry option
- [ ] Database connection error → Show maintenance message

### User Errors
- [ ] Empty form submission → Show validation errors
- [ ] Invalid email → Show "Please enter valid email"
- [ ] Invalid LinkedIn URL → Show "Please enter valid LinkedIn profile URL"
- [ ] Network error → Show "Connection lost, please try again"

### Fallback Behavior
- [ ] If Claude API fails → Try Grok
- [ ] If Grok fails → Try OpenAI
- [ ] If all AI APIs fail → Show error, offer refund if paid
- [ ] If PDF generation fails → Send content as email

---

## Accessibility (A11y)

### Keyboard Navigation
- [ ] All buttons/links keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators visible

### Screen Readers
- [ ] Images have alt text
- [ ] Form inputs have labels
- [ ] Buttons have descriptive text
- [ ] ARIA labels where needed

### Color Contrast
- [ ] Text meets WCAG AA standards (4.5:1 ratio)
- [ ] CTAs have high contrast
- [ ] Error messages readable

---

## Analytics & Monitoring

### Tracking Events
- [ ] Landing page view
- [ ] Audit started
- [ ] Audit completed
- [ ] Payment initiated
- [ ] Payment succeeded
- [ ] Email opened (Resend tracking)
- [ ] Email clicked (Resend tracking)

### Error Logging
- [ ] API errors logged to Supabase
- [ ] Frontend errors logged (Sentry or similar)
- [ ] 500 errors trigger alerts

### Conversion Funnel
- [ ] Track: Landing → Audit → Payment
- [ ] Identify drop-off points
- [ ] Calculate conversion rate per step

---

## Deployment Testing

### Vercel Deployment
- [ ] `vercel --prod` succeeds
- [ ] Environment variables loaded correctly
- [ ] No build errors
- [ ] No runtime errors in logs
- [ ] Deployment URL works

### Custom Domain (Optional)
- [ ] DNS configured correctly
- [ ] SSL certificate active
- [ ] HTTPS redirect works
- [ ] www → non-www redirect (or vice versa)

### Post-Deployment Smoke Test
- [ ] Visit landing page → Works
- [ ] Complete audit → Works
- [ ] Initiate payment → Works (test mode)
- [ ] Check database → Data saved
- [ ] Check logs → No errors

---

## Regression Testing (After Updates)

Run this checklist after any major code changes:

- [ ] Re-run functional tests
- [ ] Re-run API endpoint tests
- [ ] Re-run payment flow test
- [ ] Check for new console errors
- [ ] Verify no performance degradation

---

## Launch Day Checklist

**24 Hours Before:**
- [ ] All tests passing
- [ ] Production env vars configured
- [ ] Stripe in live mode (not test mode)
- [ ] Database backed up
- [ ] Monitoring/alerts configured
- [ ] Support email monitored (hello@linkedindealmagnet.com)

**Launch:**
- [ ] Deploy to production
- [ ] Smoke test all critical flows
- [ ] Monitor error logs for 1 hour
- [ ] Share launch post with influencers

**Post-Launch (First Week):**
- [ ] Check analytics daily
- [ ] Respond to support emails <24 hours
- [ ] Monitor conversion rates
- [ ] Fix any bugs reported
- [ ] Collect user feedback

---

**Last Updated:** March 19, 2026
