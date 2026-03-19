# Phase 2: Job Board Lead Magnet - Specification

## Overview
A niche job board that serves as a traffic driver and email capture tool, funneling users to the LinkedIn Profile Optimizer and future career tools.

---

## Strategic Purpose

```
Job Board (Free) → Email Capture → Profile Optimizer Upsell → Career Tools/Courses
```

**Same playbook as GovCon Giants**: `govcongiants.org/jobs` drives traffic → training/tools upsell

---

## Target Positioning

### Option A: "Fresh Start Careers" (For Olga's Audience)
- Women leaving corporate
- Career changers 35+
- Starting over after life changes
- Remote-friendly, flexible roles

### Option B: "CareerLift Jobs" (General)
- All professionals seeking growth
- Emphasis on career advancement
- Skills-based matching

### Option C: "Second Chapter Jobs" (Niche)
- Career changers specifically
- Reentering workforce
- Pivoting industries

**Recommendation**: Start with Option A for Olga's audience, can generalize later.

---

## Job API Selection

### Primary: Adzuna API
- **Coverage**: 16 countries, millions of jobs
- **Cost**: Free tier available
- **Quality**: Good data, salary estimates
- **Setup**: Register at developer.adzuna.com

### Backup: Fantastic.jobs API
- **Coverage**: 10M+ jobs/month from 54 ATS platforms
- **Quality**: Direct from employers (Workday, Greenhouse, Lever)
- **Cost**: Free tier available

### Filters to Implement
| Filter | API Parameter | User Value |
|--------|---------------|------------|
| Remote | `where=remote` | Work from home |
| Location | `where=city,state` | Local jobs |
| Salary Min | `salary_min=X` | Fair compensation |
| Category | `category=X` | Industry focus |
| Full/Part Time | `full_time=1` | Schedule flexibility |
| Posted Date | `max_days_old=7` | Fresh listings |

---

## User Journey

### 1. Landing Page (`/jobs`)
```
Hero: "Find Your Next Chapter"
Subhead: "Jobs curated for professionals ready for something new"

Search Box:
[What] [Where] [Remote Only ☑] [Search]

Featured Categories:
- Remote & Flexible
- Career Change Friendly
- Women-Led Companies
- Work-Life Balance

Email Capture:
"Get jobs matching your skills delivered weekly"
[Email] [Subscribe]
```

### 2. Search Results (`/jobs/search`)
```
Filters Sidebar:
- Salary Range
- Experience Level
- Job Type (Full/Part/Contract)
- Remote Options
- Posted Within

Results:
[Job Card]
- Title
- Company + Logo
- Location / Remote
- Salary Range
- Posted Date
- [Apply] [Save]
```

### 3. Job Detail (`/jobs/:id`)
```
- Full job description
- Company info
- Apply button (external link)
- Similar jobs
- CTA: "Optimize your profile for this role" → Profile Optimizer
```

### 4. Email Capture Points
1. After 3rd job view: "Want jobs like this in your inbox?"
2. Save job without account: "Create free account to save"
3. Exit intent: "Don't miss out - get weekly job alerts"

---

## Technical Implementation

### API Integration: Adzuna

**Endpoint**: `https://api.adzuna.com/v1/api/jobs/{country}/search/{page}`

**Example Request**:
```javascript
const response = await fetch(
  `https://api.adzuna.com/v1/api/jobs/us/search/1?` +
  `app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}` +
  `&what=product%20manager` +
  `&where=remote` +
  `&salary_min=80000` +
  `&results_per_page=20`
);
```

**Response Shape**:
```json
{
  "results": [
    {
      "id": "123456",
      "title": "Senior Product Manager",
      "company": { "display_name": "TechCorp" },
      "location": { "display_name": "Remote, USA" },
      "salary_min": 120000,
      "salary_max": 150000,
      "description": "We're looking for...",
      "redirect_url": "https://...",
      "created": "2026-03-15T10:00:00Z",
      "category": { "label": "IT Jobs" }
    }
  ],
  "count": 1523
}
```

### Backend Routes

```javascript
// Search jobs
GET /api/jobs/search
  ?q=product+manager
  &location=remote
  &salary_min=80000
  &page=1

// Get single job
GET /api/jobs/:id

// Save job (requires auth)
POST /api/jobs/save
  { jobId: "123456" }

// Get saved jobs
GET /api/jobs/saved

// Subscribe to alerts
POST /api/jobs/subscribe
  { email: "user@example.com", filters: {...} }
```

### Database Schema

```sql
-- Job alerts subscriptions
CREATE TABLE job_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  filters JSONB, -- { keywords, location, salary_min, remote }
  frequency VARCHAR(20) DEFAULT 'weekly', -- daily, weekly
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  last_sent_at TIMESTAMP
);

-- Saved jobs
CREATE TABLE saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  job_external_id VARCHAR(255), -- Adzuna job ID
  job_data JSONB, -- Cached job info
  saved_at TIMESTAMP DEFAULT NOW()
);

-- Job click tracking
CREATE TABLE job_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  job_external_id VARCHAR(255),
  clicked_at TIMESTAMP DEFAULT NOW()
);
```

---

## Pages & Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/jobs` | Job board landing | Search + featured jobs |
| `/jobs/search` | Search results | Filtered job listings |
| `/jobs/:id` | Job detail | Full description + apply |
| `/jobs/saved` | Saved jobs | User's bookmarked jobs |
| `/jobs/alerts` | Manage alerts | Email subscription settings |

---

## Email Capture Strategy

### Lead Magnet: Weekly Job Digest
- Curated jobs matching their filters
- Sent every Monday morning
- Include 1 tip for job seekers
- CTA to Profile Optimizer

### Email Sequence (After Signup)
1. **Day 0**: Welcome + First job matches
2. **Day 3**: "Is your LinkedIn ready?" → Profile Optimizer CTA
3. **Day 7**: Weekly digest + success story
4. **Day 14**: "Most applied jobs this week" + Pro tips

### Email Tool Options
- **Resend** (recommended): Simple, dev-friendly, $0 for 3K emails/mo
- **SendGrid**: More features, higher volume
- **ConvertKit**: Better for sequences, but pricier

---

## Upsell Integration Points

### 1. Job Detail Page
```
┌─────────────────────────────────────────┐
│ [Job Listing Content]                   │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 💡 Stand out for this role          │ │
│ │                                     │ │
│ │ Your LinkedIn profile is your       │ │
│ │ first impression. Get a free        │ │
│ │ Readiness Score and see what's      │ │
│ │ holding you back.                   │ │
│ │                                     │ │
│ │ [Optimize My Profile - Free]        │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 2. Search Results (After 5th Job)
```
┌─────────────────────────────────────────┐
│ 🎯 Getting interviews starts with      │
│    a strong LinkedIn profile           │
│                                         │
│ 73% of recruiters check LinkedIn       │
│ before reaching out.                   │
│                                         │
│ [Get Your Free Score →]                │
└─────────────────────────────────────────┘
```

### 3. Email Digests
```
---
PS: Your LinkedIn profile is the first thing recruiters see.
Get your free Readiness Score: [link]
---
```

---

## MVP Checklist

### Backend
- [ ] Adzuna API integration
- [ ] Job search endpoint with filters
- [ ] Job detail endpoint
- [ ] Save job endpoint
- [ ] Email subscription endpoint
- [ ] Weekly digest cron job

### Frontend
- [ ] Job board landing page
- [ ] Search results page
- [ ] Job detail page
- [ ] Email capture modal
- [ ] Saved jobs page (logged in)
- [ ] Mobile responsive

### Email
- [ ] Resend integration
- [ ] Welcome email template
- [ ] Weekly digest template
- [ ] Unsubscribe handling

### Analytics
- [ ] Track job views
- [ ] Track apply clicks
- [ ] Track email signups
- [ ] Track Profile Optimizer conversions from job board

---

## Success Metrics

### Traffic
- [ ] 5,000 unique visitors/month (within 3 months)
- [ ] 20% return visitor rate

### Email
- [ ] 500 email signups in month 1
- [ ] 2,000 email signups in month 3
- [ ] 25% open rate on digests

### Conversion
- [ ] 10% of job board users try Profile Optimizer
- [ ] 5% of those convert to paid

### Revenue Attribution
- [ ] Track `?ref=jobboard` on all Profile Optimizer links
- [ ] Measure job board contribution to overall revenue

---

## Timeline

### Week 1-2 (After Phase 1 Launch)
- [ ] Adzuna API integration
- [ ] Basic job search working
- [ ] Job detail pages

### Week 3
- [ ] Email capture + Resend integration
- [ ] Saved jobs functionality
- [ ] Upsell CTAs integrated

### Week 4
- [ ] Weekly digest automation
- [ ] Landing page polish
- [ ] Launch to Olga's audience

---

## Future Enhancements (Phase 2.5)

- [ ] AI job matching based on resume/profile
- [ ] Company reviews integration (Glassdoor API)
- [ ] Salary comparison tools
- [ ] Interview prep for specific jobs
- [ ] "Companies hiring now" featured section
- [ ] Employer partnerships (sponsored listings)

---

*Last Updated: March 18, 2026*
