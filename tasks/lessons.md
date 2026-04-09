# Lessons Learned

Document mistakes, corrections, and patterns to avoid repeating errors.

---

## Format

Each lesson should follow this structure:

```
## [Date] - [Short Title]

**Context:** What were you trying to do?
**Mistake:** What went wrong?
**Correction:** What was the fix?
**Rule:** "Always X, not Y because Z"
**Related Docs:** Link to any docs updated (design-system.md, etc.)
```

---

## March 19, 2026 - LinkedIn Scraping vs Manual Input

**Context:** Initially planned to scrape LinkedIn profiles using AllOrigins proxy

**Mistake:** Assumed scraping was necessary for good UX, didn't research competitors

**Correction:** Switched to manual input after researching RedactAI, Paje.ai, Teal - all use manual input

**Rule:** "Always research 3-5 competitors before building a feature, not after"

**Why it matters:**
- Saved 20+ hours building unreliable scraping infrastructure
- Avoided LinkedIn ToS violations
- Manual input is actually the industry standard

**Related Docs:**
- Updated `PHASE_1_LINKEDIN_OPTIMIZER.md` with manual input strategy
- Created `COMPETITIVE_POSITIONING.md`

---

## March 19, 2026 - Free vs Paid Tier Scoping

**Context:** Initially planned to gate most fixes behind $97 paywall (show only top 5 free)

**Mistake:** Didn't compare to market baseline (Careerflow gives full audit FREE)

**Correction:** Changed to give full audit free (score + headline + all 15-20 fixes), monetize done-for-you service

**Rule:** "Always match market baseline for free tier, monetize premium services not basic features"

**Why it matters:**
- Gating basic features = users bounce to competitors
- Full free value → trust → higher paid conversion
- $97 rewrite service is differentiated (not available free anywhere)

**Related Docs:**
- Updated `PHASE_1_LINKEDIN_OPTIMIZER.md` monetization section
- Created `MARKET_RESEARCH.md`

---

## March 19, 2026 - Pricing Model Selection

**Context:** Debated between $19/mo subscription vs $97 one-time vs both

**Mistake:** Almost defaulted to subscription without asking user preference

**Correction:** Asked user directly - they prefer one-time payment for immediate need

**Rule:** "Always validate pricing assumptions with target users before implementing"

**Why it matters:**
- User intent: "I need my profile fixed NOW" (not ongoing service)
- One-time = lower friction, higher conversion for cold traffic
- Can still add subscription later for Pro features

**Related Docs:**
- Updated `VISION.md` with pricing rationale
- Added to `PHASE_1_LINKEDIN_OPTIMIZER.md`

---

## [Template for Future Lessons]

**Context:**

**Mistake:**

**Correction:**

**Rule:**

**Why it matters:**

**Related Docs:**

---

**Instructions for Claude:**

After ANY correction from user, immediately:
1. Add lesson to this file
2. Update relevant docs (CLAUDE.md, design-system.md, etc.)
3. Summarize lesson in next message to user

---

**Last Updated:** March 19, 2026
