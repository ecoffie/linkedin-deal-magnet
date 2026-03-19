# LinkedIn Deal Magnet - Testing Checklist

**Version**: 1.0
**Last Updated**: March 19, 2026

---

## Pre-Launch Testing Checklist

This document outlines all testing that must be completed before launching the LinkedIn Deal Magnet MVP.

---

## 1. Profile Analysis Testing

### Test with 5 Real LinkedIn Profiles

Test the full audit flow with diverse profile types to validate AI analysis quality.

#### Profile Type 1: Junior Professional (0-2 years)

- [ ] **Profile Selection**: Choose a real junior professional LinkedIn profile
- [ ] **Data Input**: Fill form with accurate data from profile
- [ ] **Submit**: Complete the audit process
- [ ] **Validate Results**:
  - [ ] Score is appropriate (likely 30-50 range)
  - [ ] AI headline suggestion is relevant to junior level
  - [ ] Fixes address common junior mistakes (lack of metrics, generic descriptions)
  - [ ] Fixes are actionable and specific
  - [ ] Priority levels make sense (high = critical gaps)
- [ ] **Screenshot**: Save results for documentation
- [ ] **Notes**: Document any issues or improvements needed

#### Profile Type 2: Mid-Level Professional (3-7 years)

- [ ] **Profile Selection**: Choose mid-level professional profile
- [ ] **Data Input**: Fill form with profile data
- [ ] **Submit**: Complete audit
- [ ] **Validate Results**:
  - [ ] Score is appropriate (likely 50-70 range)
  - [ ] AI headline reflects mid-level positioning
  - [ ] Fixes address mid-career optimization (value prop, metrics)
  - [ ] Recommendations are specific to experience level
- [ ] **Screenshot**: Save results
- [ ] **Notes**: Document observations

#### Profile Type 3: Senior Professional (8+ years)

- [ ] **Profile Selection**: Choose senior professional profile
- [ ] **Data Input**: Fill form with profile data
- [ ] **Submit**: Complete audit
- [ ] **Validate Results**:
  - [ ] Score is appropriate (likely 60-80 range)
  - [ ] AI headline emphasizes leadership/expertise
  - [ ] Fixes are sophisticated (thought leadership, executive presence)
  - [ ] Recommendations match senior expectations
- [ ] **Screenshot**: Save results
- [ ] **Notes**: Document observations

#### Profile Type 4: Career Changer (Different Industries)

- [ ] **Profile Selection**: Choose profile with industry transitions
- [ ] **Data Input**: Fill form with profile data
- [ ] **Submit**: Complete audit
- [ ] **Validate Results**:
  - [ ] Score reflects transition challenges
  - [ ] AI headline bridges old and new career paths
  - [ ] Fixes address transferable skills positioning
  - [ ] Recommendations help with career pivot narrative
- [ ] **Screenshot**: Save results
- [ ] **Notes**: Document observations

#### Profile Type 5: Executive/C-Level

- [ ] **Profile Selection**: Choose executive profile
- [ ] **Data Input**: Fill form with profile data
- [ ] **Submit**: Complete audit
- [ ] **Validate Results**:
  - [ ] Score reflects executive standards (70-90 range)
  - [ ] AI headline emphasizes strategic impact
  - [ ] Fixes are executive-level (board positioning, industry authority)
  - [ ] Recommendations match C-level expectations
- [ ] **Screenshot**: Save results
- [ ] **Notes**: Document observations

### AI Quality Validation

- [ ] **All 5 profiles analyzed successfully** (no errors)
- [ ] **Response time < 15 seconds** for each audit
- [ ] **Fixes are unique** (not generic boilerplate)
- [ ] **Headline suggestions < 220 characters** for all profiles
- [ ] **Priority distribution** is reasonable (mix of high/medium/low)
- [ ] **No hallucinations** (AI didn't make up facts about the person)
- [ ] **Tone is professional** and encouraging (not harsh)

---

## 2. Form Validation Testing

### Email Field

- [ ] **Valid email accepted**: test@example.com
- [ ] **Invalid email rejected**: "test" (no @ symbol)
- [ ] **Invalid email rejected**: "test@" (incomplete)
- [ ] **Empty email rejected**: Shows error message
- [ ] **Error message is clear**: "Please enter a valid email address"

### Profile URL Field

- [ ] **Valid LinkedIn URL accepted**: https://linkedin.com/in/username
- [ ] **Valid short URL accepted**: linkedin.com/in/username
- [ ] **Invalid URL rejected**: https://google.com
- [ ] **Empty URL rejected**: Shows error message
- [ ] **Error message is clear**: "Valid LinkedIn profile URL is required"

### Headline Field

- [ ] **Text input works**: Can type and paste
- [ ] **Character counter updates**: Shows current count
- [ ] **220 character limit enforced**: Can't exceed
- [ ] **Counter turns orange** at 200 characters (90% warning)
- [ ] **Counter turns red** at 220 characters (at limit)
- [ ] **Empty headline rejected**: Shows error message

### About Section Field

- [ ] **Textarea works**: Can type and paste multi-line text
- [ ] **Character counter updates**: Shows current count
- [ ] **2600 character limit enforced**: Can't exceed
- [ ] **Counter turns orange** at 2400 characters (90% warning)
- [ ] **Counter turns red** at 2600 characters (at limit)
- [ ] **Short text rejected**: < 50 characters shows error
- [ ] **Empty about rejected**: Shows error message

### Experience Fields (2-3 roles)

#### Role 1 (Required)
- [ ] **Title field works**: Can enter job title
- [ ] **Company field works**: Can enter company name
- [ ] **Duration field works**: Can enter time period
- [ ] **Description field works**: Multi-line text input
- [ ] **All 4 fields required**: Error if any missing

#### Role 2 (Required)
- [ ] **All fields work** (same as Role 1)
- [ ] **At least 2 roles enforced**: Error if only 1 provided

#### Role 3 (Optional)
- [ ] **Optional fields work**: Can leave blank
- [ ] **Can add 3rd role**: All fields work if provided
- [ ] **Partial entry handled**: Won't break if only some fields filled

### Skills Field (Optional)

- [ ] **Text input works**: Can enter comma-separated skills
- [ ] **Can be left empty**: No error if blank
- [ ] **Long list accepted**: 10+ skills doesn't break

### Profile Completeness

- [ ] **Photo checkbox works**: Can check/uncheck
- [ ] **Banner checkbox works**: Can check/uncheck
- [ ] **Connection dropdown works**: All 4 options selectable
- [ ] **Weekly tips checkbox** defaults to checked
- [ ] **All optional fields** can be submitted empty

### Submit Button

- [ ] **Disabled until form valid** (optional - currently not implemented)
- [ ] **Shows loading state** after click
- [ ] **Prevents double submission**: Can't click twice
- [ ] **Error handling works**: Shows errors if API fails

---

## 3. User Experience Testing

### Loading State

- [ ] **Loading animation appears**: After form submission
- [ ] **Step 1 activates**: "Processing your profile..." shows
- [ ] **Step 2 activates** after ~3 seconds: "Analyzing with AI..."
- [ ] **Step 3 activates** after ~8 seconds: "Generating your score..."
- [ ] **All steps complete** after analysis finishes
- [ ] **Smooth transitions**: No jarring changes
- [ ] **User can't submit again**: Button disabled during loading

### Results Display

- [ ] **Score animates**: Counts up from 0 to actual score
- [ ] **Score ring fills**: Circle progress matches score
- [ ] **Score color is correct**:
  - [ ] 80-100: Green (#16a34a) "Excellent"
  - [ ] 60-79: Light green (#22c55e) "Looking Good"
  - [ ] 40-59: Orange (#f59e0b) "Getting There"
  - [ ] 0-39: Red (#dc2626) "Needs Work"
- [ ] **AI headline displays**: Shows optimized headline
- [ ] **Copy button works**: Copies headline to clipboard
- [ ] **Copy button feedback**: Shows "Copied!" message
- [ ] **Fixes list displays**: All 15-20 fixes shown
- [ ] **Priority badges correct**: High/Medium/Low colors match priority

### $97 Profile Rewrite CTA

- [ ] **CTA card displays**: Green gradient card visible
- [ ] **Value proposition clear**: "Done-For-You" badge prominent
- [ ] **What's included visible**: 4 bullet points listed
- [ ] **Price visible**: $97 clearly shown
- [ ] **Button works**: Clicking initiates Stripe checkout
- [ ] **Money-back guarantee** mentioned

---

## 4. Stripe Payment Testing

### Checkout Flow

- [ ] **Click "Get Your Profile Professionally Rewritten - $97"**
- [ ] **Stripe checkout opens**: New page/modal
- [ ] **Price is correct**: $97 shown
- [ ] **Test card works**: Use `4242 4242 4242 4242`
- [ ] **Any expiry date** (future date)
- [ ] **Any CVC** (3 digits)
- [ ] **Success redirect works**: Goes to `/success?session_id=...&rewrite=true`
- [ ] **Cancel redirect works**: Goes to `/onboarding?canceled=true`

### Success Page

- [ ] **Success page exists**: `/success` route works
- [ ] **Shows confirmation**: Payment successful message
- [ ] **Shows next steps**: What happens now
- [ ] **Email confirmation sent** (if implemented)

### Error Handling

- [ ] **Declined card shows error**: Use `4000 0000 0000 0002`
- [ ] **Insufficient funds shows error**: Use `4000 0000 0000 9995`
- [ ] **Network error handled**: Unplug internet, try payment
- [ ] **User can retry**: Returns to form after error

---

## 5. Database Testing

### Audit Persistence

- [ ] **Connect to Supabase**: Access your Supabase dashboard
- [ ] **Check `audits` table exists**: Schema matches `db/schema.sql`
- [ ] **Submit test audit**: Complete full flow
- [ ] **Verify audit saved**:
  - [ ] New row appears in `audits` table
  - [ ] `email` field populated correctly
  - [ ] `linkedin_url` saved
  - [ ] `score` is correct integer
  - [ ] `score_label` matches score range
  - [ ] `ai_headline` populated
  - [ ] `fixes` is valid JSONB array
  - [ ] `profile_data` is valid JSONB
  - [ ] `is_paid` defaults to `false`
  - [ ] `created_at` timestamp is correct
  - [ ] `referrer` captured if provided

### Data Integrity

- [ ] **UUID generated**: `id` field is valid UUID
- [ ] **No duplicate audits**: Same email can audit multiple times
- [ ] **JSONB valid**: Can query `fixes` and `profile_data` fields
- [ ] **Indexes work** (if created): Query performance is fast

### Query Testing

- [ ] **Find audits by email**: `SELECT * FROM audits WHERE email = 'test@example.com'`
- [ ] **Order by date**: `SELECT * FROM audits ORDER BY created_at DESC`
- [ ] **Filter by score**: `SELECT * FROM audits WHERE score >= 80`
- [ ] **Count audits**: `SELECT COUNT(*) FROM audits`

---

## 6. Mobile Responsive Testing

### iOS Testing

#### iPhone 12/13/14 (Standard)
- [ ] **Safari**: Open `/onboarding` on iPhone Safari
- [ ] **Form displays correctly**: All fields visible
- [ ] **Text inputs work**: Keyboard opens properly
- [ ] **Textareas expand**: Multi-line input works
- [ ] **Character counters visible**: Not cut off
- [ ] **Buttons are tappable**: Large enough for fingers
- [ ] **Score ring displays**: Circular progress visible
- [ ] **Fixes list readable**: Cards not cramped
- [ ] **CTA button accessible**: Not hidden below fold

#### iPhone SE (Small Screen)
- [ ] **All elements fit**: No horizontal scrolling
- [ ] **Font sizes readable**: Text isn't too small
- [ ] **Buttons remain accessible**: Not too small to tap

### Android Testing

#### Chrome on Android (Pixel/Samsung)
- [ ] **Form renders correctly**: Layout matches iOS
- [ ] **Input fields work**: Keyboard behavior correct
- [ ] **Buttons functional**: Touch targets adequate
- [ ] **Animations smooth**: No lag or jank
- [ ] **Score display correct**: Ring and text visible

### Tablet Testing

#### iPad (Optional)
- [ ] **Layout adapts**: Uses more screen space
- [ ] **Form not too wide**: Max-width constraint works
- [ ] **Touch targets adequate**: Larger tap areas

---

## 7. Cross-Browser Testing

### Desktop Browsers

#### Chrome
- [ ] **Latest version**: Test on Chrome 120+
- [ ] **Form works**: All interactions functional
- [ ] **Animations smooth**: No visual glitches
- [ ] **API calls succeed**: Network tab shows 200 responses

#### Firefox
- [ ] **Latest version**: Test on Firefox 120+
- [ ] **Form works**: All interactions functional
- [ ] **Character counters work**: JavaScript executes
- [ ] **API calls succeed**: Network requests complete

#### Safari (macOS)
- [ ] **Latest version**: Test on Safari 17+
- [ ] **Form works**: All interactions functional
- [ ] **Fetch API works**: Modern APIs supported
- [ ] **No console errors**: Check developer console

#### Edge
- [ ] **Latest version**: Test on Edge 120+
- [ ] **Form works**: Chromium-based, should match Chrome
- [ ] **No compatibility issues**: Polyfills not needed

---

## 8. Performance Testing

### Load Times

- [ ] **Server starts < 5 seconds**: `npm start` completes quickly
- [ ] **Page loads < 2 seconds**: `/onboarding` renders fast
- [ ] **API response < 15 seconds**: `/api/audit-manual` completes
- [ ] **No memory leaks**: Can submit multiple audits without slowdown

### Concurrent Users

- [ ] **5 simultaneous audits**: Open 5 tabs, submit all at once
- [ ] **All complete successfully**: No errors
- [ ] **Response times acceptable**: < 20 seconds each
- [ ] **Server doesn't crash**: No out-of-memory errors

---

## 9. Security Testing

### Input Validation

- [ ] **XSS protection**: Try entering `<script>alert('xss')</script>` in fields
- [ ] **SQL injection**: Try `'; DROP TABLE audits; --` in text fields
- [ ] **Long inputs**: Try 100KB of text in About section
- [ ] **Special characters**: Test with emojis, unicode, symbols

### API Security

- [ ] **No API keys exposed**: Check client-side code
- [ ] **Environment variables secure**: Not in public repo
- [ ] **CORS configured**: Only allowed origins can access
- [ ] **Rate limiting** (if implemented): Can't spam requests

---

## 10. Error Handling Testing

### Network Errors

- [ ] **Offline submission**: Disconnect internet, try submitting
- [ ] **Shows clear error**: "No internet connection" or similar
- [ ] **Can retry**: After reconnecting, can submit again

### API Errors

- [ ] **Claude API timeout**: Kill server mid-request
- [ ] **Shows user-friendly error**: Not raw error stack
- [ ] **Allows retry**: User can attempt again

### Database Errors

- [ ] **Supabase connection fails**: Disconnect from database
- [ ] **Audit still returns results**: Response works even if save fails
- [ ] **Error logged**: Console shows database error

---

## 11. Accessibility Testing

### Keyboard Navigation

- [ ] **Tab through form**: All fields accessible via keyboard
- [ ] **Submit with Enter**: Can submit without mouse
- [ ] **Focus indicators visible**: Clear outline on focused elements

### Screen Reader Testing (Optional)

- [ ] **VoiceOver (macOS)**: Labels are read correctly
- [ ] **NVDA (Windows)**: Form structure is clear
- [ ] **Error messages announced**: Screen reader speaks errors

---

## 12. Email Testing (If Implemented)

### Audit Results Email

- [ ] **Email sent**: User receives results via email
- [ ] **Subject line clear**: "Your LinkedIn Readiness Score"
- [ ] **Content renders**: HTML email displays correctly
- [ ] **Links work**: CTAs are clickable
- [ ] **Unsubscribe works**: Opt-out link functions

### Weekly Tips Email (If Opted In)

- [ ] **Email sent**: User receives weekly tips
- [ ] **Frequency correct**: Only once per week
- [ ] **Unsubscribe works**: Can opt out

---

## Test Environment Setup

### Local Development

```bash
cd ~/Linkedin\ App
npm install
npm start
# Open http://localhost:3000/onboarding
```

### Environment Variables Required

- [ ] `ANTHROPIC_API_KEY` set
- [ ] `SUPABASE_URL` set
- [ ] `SUPABASE_SERVICE_KEY` set
- [ ] `STRIPE_SECRET_KEY` set (test mode)
- [ ] `STRIPE_PRICE_FULL_FIX` set

---

## Testing Sign-Off

### Testing Completed By

- **Name**: ___________________________
- **Date**: ___________________________
- **Environment**: Local / Production

### Test Results Summary

- **Total Tests**: _____ / _____
- **Pass Rate**: _____ %
- **Critical Issues**: _____
- **Minor Issues**: _____
- **Blockers**: _____

### Approval for Launch

- [ ] **All P0 tests pass** (critical functionality)
- [ ] **No security vulnerabilities** found
- [ ] **Mobile experience acceptable**
- [ ] **AI analysis quality validated**
- [ ] **Payment flow works** end-to-end

**Approved By**: ___________________________

**Date**: ___________________________

---

## Known Issues Log

Track any bugs or issues found during testing:

| Issue # | Description | Severity | Status | Notes |
|---------|-------------|----------|--------|-------|
| 1 | | P0/P1/P2 | Open/Fixed | |
| 2 | | P0/P1/P2 | Open/Fixed | |

---

*Last Updated: March 19, 2026*
