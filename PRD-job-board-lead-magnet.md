# PRD: Job Board Lead Magnet (Phase 2)

**Product:** Free job search tool with email capture
**Timeline:** 2-3 weeks after Phase 1 launch
**Goal:** Build email list, upsell Profile Optimizer

---

## Problem Statement

Users who complete the free LinkedIn audit want their next step: finding jobs that match their newly optimized profile.

**User needs:**
- "Where do I find jobs that fit my skills?"
- "I want remote-friendly roles"
- "I'm changing careers - what roles match my transferable skills?"
- "Send me alerts when relevant jobs are posted"

**Business goal:**
- Capture emails from users not ready to pay $97
- Build marketing list for future upsells
- Position as helpful resource (not just sales funnel)

---

## Solution

Free job board integrated into LinkedIn Deal Magnet that:
1. Aggregates jobs from multiple sources (Adzuna API)
2. Offers smart filters (remote, salary, experience level)
3. Captures email for job alerts
4. Upsells Profile Optimizer with "Tailor your profile for this job"

**Niche Positioning:**
- Focus on career changers, remote workers, professionals seeking growth
- Partner with Olga's audience: "Second Chapter Careers"
- Highlight work-life balance, remote-friendly companies

---

## User Journey

### Step 1: Entry Points

**From Audit Results:**
- After completing audit, see: "Want to put your optimized profile to work? Search jobs →"

**From Landing Page:**
- Navigation: "Find Jobs" menu item
- Hero CTA: "Search 100K+ Remote-Friendly Jobs"

**From Email:**
- Weekly email to audit users: "New jobs matching your skills"

---

### Step 2: Job Search Page (`/jobs`)

**Search Interface:**
```
[Search bar: "Job title, keywords, or company"]
[Location: "Remote, City, or Anywhere"]
[Filters: Remote Only | Full-Time | $80K+ | Entry/Mid/Senior]

[Search Jobs]
```

**Email Capture Modal (First Search):**
```
Get Job Alerts 📧

Enter your email to:
✅ Save your search
✅ Get weekly alerts for new matching jobs
✅ Access salary data and company reviews

[Email input field]
[☑️ I want weekly LinkedIn tips too]

[Get Alerts - Free]

No spam. Unsubscribe anytime.
```

---

### Step 3: Search Results

**Layout:**
```
[Filter sidebar]          [Job listings]
Remote Only: ☑️          ┌─────────────────────────────┐
Salary: $80K+            │ Senior Product Manager      │
Experience: Mid-Senior   │ Acme Corp • Remote • $120K  │
Date Posted: Last 7 days │ Posted 2 days ago          │
                         │ [Save] [View Details]       │
                         └─────────────────────────────┘
```

**Job Card Components:**
- Job title (bold, clickable)
- Company name + logo (if available)
- Location (Remote/City)
- Salary range (if available)
- Posted date
- Save button (requires email if not captured)
- "View Details" button

**Results Per Page:** 20
**Pagination:** Load more (infinite scroll)

---

### Step 4: Job Detail Page (`/jobs/:id`)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ Senior Product Manager                          │
│ Acme Corp • Remote • $100K-$140K               │
│ Posted 2 days ago • 15 applicants              │
│                                                 │
│ [Apply on Company Site] [Save Job]             │
│                                                 │
│ ─────────────────────────────────────────────  │
│                                                 │
│ 🎯 Optimize Your Profile for This Job          │
│ Get AI-powered suggestions to tailor your      │
│ LinkedIn profile for this specific role.       │
│ [Get Profile Tips - $97] [Learn More]          │
│                                                 │
│ ─────────────────────────────────────────────  │
│                                                 │
│ Job Description                                 │
│ [Full description from API]                     │
│                                                 │
│ Requirements                                    │
│ [Requirements from description]                 │
│                                                 │
│ About [Company Name]                            │
│ [Company description if available]              │
│                                                 │
│ Similar Jobs                                    │
│ [3-5 similar job cards]                         │
└─────────────────────────────────────────────────┘
```

**Upsell CTA:**
- Prominent card above job description
- "Optimize Your Profile for This Job"
- Links to Profile Optimizer with job context pre-filled
- AI can tailor suggestions based on job requirements

---

### Step 5: Saved Jobs (`/jobs/saved`)

**Requires:** Email capture

**Layout:**
```
My Saved Jobs (12)

[Filter by: All | Remote | $80K+ | Applied]

┌─────────────────────────────────┐
│ Senior PM • Acme • Remote      │
│ Saved 3 days ago               │
│ [View] [Remove] [Mark Applied]  │
└─────────────────────────────────┘
```

**Features:**
- Save jobs for later review
- Mark as "Applied"
- Remove from saved list
- Export to spreadsheet (CSV)

---

### Step 6: Job Alerts Email (Weekly)

**Trigger:** Every Monday 9am (user's timezone)

**Email Template:**
```
Subject: 🎯 12 New Jobs Matching Your Skills

Hi [Name],

Here are 12 new jobs posted this week that match your search for "[keywords]":

1. Senior Product Manager at Acme Corp
   Remote • $120K-$150K • Posted yesterday
   [View Job →]

2. Product Lead at BetaCo
   San Francisco • $140K-$170K • Posted 2 days ago
   [View Job →]

[... 10 more jobs]

[View All Jobs →]

────────────────────────────

💡 Pro Tip: Optimize your LinkedIn profile for these roles
Get AI-powered suggestions for just $97
[Optimize My Profile →]

────────────────────────────

Update your job search preferences:
[Change Filters] | [Pause Alerts] | [Unsubscribe]
```

**Frequency Options:**
- Daily (for active job seekers)
- Weekly (default)
- Bi-weekly
- Pause

---

## Technical Implementation

### API Selection: Adzuna

**Why Adzuna:**
- Free tier: 1,000 API calls/month
- Global coverage (50+ countries)
- Salary data included
- Job deduplication built-in
- No auth required for basic tier

**Alternatives Considered:**
| API | Pros | Cons |
|-----|------|------|
| Adzuna | Free tier, good data | 1K/month limit |
| JSearch (RapidAPI) | LinkedIn/Indeed aggregation | $25/mo for 10K |
| Fantastic.jobs | 10M+ jobs/month | Paid only |
| Indeed API | Official Indeed | Application required |

**Decision:** Start with Adzuna free tier, upgrade to JSearch if needed

---

### Backend Endpoints

#### 1. `GET /api/jobs/search`
**Purpose:** Search for jobs

**Query Parameters:**
- `what`: Keywords (e.g., "product manager")
- `where`: Location (e.g., "remote", "San Francisco")
- `salary_min`: Minimum salary (e.g., 80000)
- `full_time`: Boolean (1 = full-time only)
- `page`: Page number (default: 1)
- `results_per_page`: Results (default: 20)

**Request:**
```
GET /api/jobs/search?what=product+manager&where=remote&salary_min=100000&page=1
```

**Response:**
```json
{
  "count": 450,
  "results": [
    {
      "id": "adzuna_12345",
      "title": "Senior Product Manager",
      "company": "Acme Corp",
      "location": "Remote",
      "salary_min": 120000,
      "salary_max": 150000,
      "description": "...",
      "created": "2026-03-15T10:00:00Z",
      "redirect_url": "https://...",
      "category": "IT Jobs"
    }
  ]
}
```

---

#### 2. `GET /api/jobs/:id`
**Purpose:** Get job details

**Response:**
```json
{
  "id": "adzuna_12345",
  "title": "Senior Product Manager",
  "company": "Acme Corp",
  "location": "Remote",
  "salary_min": 120000,
  "salary_max": 150000,
  "description": "Full job description...",
  "created": "2026-03-15T10:00:00Z",
  "redirect_url": "https://www.acmecorp.com/careers/123",
  "category": "IT Jobs",
  "contract_type": "permanent"
}
```

---

#### 3. `POST /api/jobs/save`
**Purpose:** Save job to user's list

**Request:**
```json
{
  "email": "user@example.com",
  "jobId": "adzuna_12345",
  "jobData": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "savedJobId": "uuid"
}
```

---

#### 4. `POST /api/jobs/subscribe`
**Purpose:** Subscribe to job alerts

**Request:**
```json
{
  "email": "user@example.com",
  "searchParams": {
    "what": "product manager",
    "where": "remote",
    "salary_min": 100000
  },
  "frequency": "weekly"
}
```

**Response:**
```json
{
  "success": true,
  "subscriptionId": "uuid"
}
```

---

### Database Schema

#### Saved Jobs Table
```sql
CREATE TABLE saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  job_external_id VARCHAR(255) NOT NULL,
  job_data JSONB NOT NULL, -- Full job object from API
  is_applied BOOLEAN DEFAULT FALSE,
  applied_at TIMESTAMP,
  saved_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_email, job_external_id)
);

CREATE INDEX idx_saved_jobs_user_email ON saved_jobs(user_email);
CREATE INDEX idx_saved_jobs_saved_at ON saved_jobs(saved_at);
```

#### Job Alerts Table
```sql
CREATE TABLE job_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  search_params JSONB NOT NULL, -- { what, where, salary_min, etc. }
  frequency VARCHAR(50) DEFAULT 'weekly', -- daily, weekly, biweekly
  is_active BOOLEAN DEFAULT TRUE,
  last_sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_email, search_params)
);

CREATE INDEX idx_job_alerts_user_email ON job_alerts(user_email);
CREATE INDEX idx_job_alerts_is_active ON job_alerts(is_active);
```

---

## Monetization Strategy

### 1. Profile Optimizer Upsell (Primary)
- CTA on every job detail page
- "Optimize Your Profile for This Job - $97"
- AI tailors profile suggestions to job requirements
- **Target conversion:** 2-5% of job viewers

### 2. Premium Job Features (Future)
- Priority job alerts (get notified first)
- Exclusive jobs from partner companies
- Resume tailoring per application
- **Pricing:** $19/mo or included in Pro subscription

### 3. Sponsored Job Listings (Future)
- Companies pay to feature their jobs
- "Sponsored" badge on listings
- Higher placement in search results
- **Pricing:** $99-$299 per job post (30-day listing)

---

## Success Metrics (Month 1)

- [ ] 2,000+ job searches performed
- [ ] 500+ email captures (25% of searchers)
- [ ] 50+ jobs saved
- [ ] 100+ job alert subscriptions
- [ ] 10+ conversions to Profile Optimizer from job board (2%)

---

## Future Enhancements (Phase 3)

- [ ] Resume tailoring per job ("AI Resume Builder")
- [ ] Cover letter generator per job
- [ ] Application tracker (track where you applied)
- [ ] Interview prep for specific companies
- [ ] Salary negotiation calculator
- [ ] Company reviews aggregated from Glassdoor API

---

**Last Updated:** March 19, 2026
