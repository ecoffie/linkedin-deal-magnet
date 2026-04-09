# Database Schema

Supabase (PostgreSQL) database schema for LinkedIn Deal Magnet.

---

## Tables Overview

| Table | Purpose | Rows (Est. Month 1) |
|-------|---------|---------------------|
| `users` | User accounts from LinkedIn OAuth | 1,000 |
| `audits` | Profile audit results | 1,000 |
| `payments` | Payment transactions | 30 |
| `email_subscribers` | Email list for marketing | 700 |
| `content_library` | Saved LinkedIn posts (future) | 0 |

---

## 1. Users Table

**Purpose**: Store user accounts created via LinkedIn OAuth

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  linkedin_id VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  profile_picture TEXT,
  linkedin_profile_url TEXT,
  access_token_hash TEXT, -- Store hashed token for security

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,

  -- Subscription status
  is_pro BOOLEAN DEFAULT FALSE,
  pro_since TIMESTAMP,
  stripe_customer_id VARCHAR(255),

  -- Preferences
  weekly_tips BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_linkedin_id ON users(linkedin_id);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);
```

### Sample Row
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "linkedin_id": "linkedin_12345",
  "name": "John Smith",
  "profile_picture": "https://media.licdn.com/...",
  "linkedin_profile_url": "https://linkedin.com/in/johnsmith",
  "created_at": "2026-03-19T10:30:00Z",
  "updated_at": "2026-03-19T10:30:00Z",
  "last_login_at": "2026-03-19T10:30:00Z",
  "is_pro": false,
  "weekly_tips": true,
  "email_verified": true
}
```

---

## 2. Audits Table

**Purpose**: Store LinkedIn profile audit results

```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Profile data submitted
  linkedin_url TEXT NOT NULL,
  headline TEXT,
  about_section TEXT,
  experience JSONB, -- Array of experience objects
  skills TEXT[], -- Array of skill strings
  has_photo BOOLEAN,
  has_banner BOOLEAN,
  connection_count VARCHAR(50), -- "1-99", "100-499", "500+"

  -- Audit results
  score INTEGER, -- 0-100
  score_label VARCHAR(50), -- "Excellent", "Looking Good", etc.
  category_scores JSONB, -- Breakdown by category
  ai_headline TEXT, -- Generated headline suggestion
  current_headline TEXT, -- Their current headline
  fixes JSONB, -- Array of fix objects

  -- Metadata
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),

  -- Analytics
  referrer VARCHAR(255), -- utm_source tracking
  session_id VARCHAR(255)
);

-- Indexes
CREATE INDEX idx_audits_user_id ON audits(user_id);
CREATE INDEX idx_audits_created_at ON audits(created_at);
CREATE INDEX idx_audits_score ON audits(score);
CREATE INDEX idx_audits_is_paid ON audits(is_paid);
```

### Sample Row
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "linkedin_url": "https://linkedin.com/in/johnsmith",
  "headline": "Product Manager at Acme Corp",
  "about_section": "I help companies build products...",
  "experience": [
    {
      "title": "Senior Product Manager",
      "company": "Acme Corp",
      "duration": "2020 - Present",
      "description": "Led product strategy..."
    }
  ],
  "skills": ["Product Management", "Agile", "SQL"],
  "has_photo": true,
  "has_banner": false,
  "connection_count": "500+",
  "score": 72,
  "score_label": "Looking Good",
  "category_scores": {
    "headline": 10,
    "about": 15,
    "experience": 18,
    "completeness": 15,
    "engagement": 14
  },
  "ai_headline": "Senior Product Manager | Helping SaaS Startups Scale...",
  "current_headline": "Product Manager at Acme Corp",
  "fixes": [
    {
      "priority": "high",
      "category": "Headline",
      "title": "Optimize Your Headline",
      "description": "Your headline is too generic...",
      "tips": "Use format: [Role] | [Value Prop]...",
      "impact": "Increases profile views by 30-40%",
      "effort": "5 minutes"
    }
  ],
  "is_paid": false,
  "created_at": "2026-03-19T10:45:00Z",
  "referrer": "kumud-twitter"
}
```

---

## 3. Payments Table

**Purpose**: Track all payment transactions

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  audit_id UUID REFERENCES audits(id) ON DELETE SET NULL,

  -- Stripe data
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  stripe_session_id VARCHAR(255),

  -- Payment details
  amount INTEGER NOT NULL, -- In cents (e.g., 9700 = $97.00)
  currency VARCHAR(3) DEFAULT 'usd',
  status VARCHAR(50), -- "succeeded", "pending", "failed", "refunded"
  product_type VARCHAR(100), -- "profile_rewrite", "pro_subscription"

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  refunded_at TIMESTAMP,
  refund_reason TEXT
);

-- Indexes
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
```

### Sample Row
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "audit_id": "660e8400-e29b-41d4-a716-446655440001",
  "stripe_payment_intent_id": "pi_3abcdef123456",
  "stripe_customer_id": "cus_abc123",
  "stripe_session_id": "cs_test_xyz789",
  "amount": 9700,
  "currency": "usd",
  "status": "succeeded",
  "product_type": "profile_rewrite",
  "created_at": "2026-03-19T11:00:00Z",
  "updated_at": "2026-03-19T11:00:00Z"
}
```

---

## 4. Email Subscribers Table

**Purpose**: Email list for marketing campaigns (separate from users for flexibility)

```sql
CREATE TABLE email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Nullable if email-only signup

  -- Preferences
  subscribed_to_weekly_tips BOOLEAN DEFAULT FALSE,
  subscribed_to_job_alerts BOOLEAN DEFAULT FALSE,
  subscribed_to_promotions BOOLEAN DEFAULT TRUE,

  -- Metadata
  source VARCHAR(100), -- "audit_form", "job_board", "landing_page"
  referrer VARCHAR(255),
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  email_verified BOOLEAN DEFAULT FALSE,

  -- Engagement tracking
  last_email_sent_at TIMESTAMP,
  last_email_opened_at TIMESTAMP,
  last_email_clicked_at TIMESTAMP,
  total_emails_sent INTEGER DEFAULT 0,
  total_emails_opened INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_email_subscribers_user_id ON email_subscribers(user_id);
CREATE INDEX idx_email_subscribers_subscribed_at ON email_subscribers(subscribed_at);
```

### Sample Row
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "email": "john@example.com",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "subscribed_to_weekly_tips": true,
  "subscribed_to_job_alerts": false,
  "subscribed_to_promotions": true,
  "source": "audit_form",
  "referrer": "kumud-twitter",
  "subscribed_at": "2026-03-19T10:45:00Z",
  "email_verified": true,
  "total_emails_sent": 3,
  "total_emails_opened": 2
}
```

---

## 5. Content Library Table (Future - Phase 1.5)

**Purpose**: Save generated LinkedIn posts for Pro users

```sql
CREATE TABLE content_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Content
  content_type VARCHAR(50), -- "linkedin_post", "article_idea", "comment"
  title VARCHAR(255),
  body TEXT NOT NULL,
  hashtags TEXT[],

  -- Metadata
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Analytics (if published)
  linkedin_post_id VARCHAR(255),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX idx_content_library_user_id ON content_library(user_id);
CREATE INDEX idx_content_library_created_at ON content_library(created_at);
```

---

## Row-Level Security (RLS)

Enable RLS for user privacy:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_library ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY audits_select_own ON audits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY payments_select_own ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY content_library_select_own ON content_library
  FOR SELECT USING (auth.uid() = user_id);

-- Service role (backend) can access all
-- No policy needed - service role bypasses RLS
```

---

## Database Migrations

### Migration 1: Initial Schema (March 19, 2026)
```sql
-- Run in Supabase SQL Editor
-- Create all tables as defined above
```

### Migration 2: Add Referrer Tracking (Planned)
```sql
ALTER TABLE audits ADD COLUMN utm_campaign VARCHAR(255);
ALTER TABLE audits ADD COLUMN utm_medium VARCHAR(255);
ALTER TABLE audits ADD COLUMN utm_source VARCHAR(255);
```

### Migration 3: Add Job Board Tables (Phase 2)
```sql
CREATE TABLE saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_external_id VARCHAR(255) NOT NULL,
  job_title VARCHAR(255),
  company_name VARCHAR(255),
  job_url TEXT,
  saved_at TIMESTAMP DEFAULT NOW()
);
```

---

## Backup & Recovery

### Automated Backups
- Supabase: Daily automated backups (retained 7 days on free tier)
- Upgrade to Pro: Point-in-time recovery (PITR)

### Manual Backup
```bash
# Export to CSV (via Supabase dashboard)
# Or use pg_dump
pg_dump -h db.krpyelfrbicmvsmwovti.supabase.co -U postgres -d postgres > backup.sql
```

---

## Analytics Queries

### Top 10 Highest Scores
```sql
SELECT
  u.email,
  u.name,
  a.score,
  a.created_at
FROM audits a
JOIN users u ON a.user_id = u.id
ORDER BY a.score DESC
LIMIT 10;
```

### Conversion Rate (Free → Paid)
```sql
SELECT
  COUNT(DISTINCT user_id) FILTER (WHERE is_paid = true) * 100.0 /
  COUNT(DISTINCT user_id) AS conversion_rate_percent
FROM audits
WHERE created_at > NOW() - INTERVAL '30 days';
```

### Revenue by Month
```sql
SELECT
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS sales,
  SUM(amount) / 100 AS revenue_usd
FROM payments
WHERE status = 'succeeded'
GROUP BY month
ORDER BY month DESC;
```

### Average Score by Referrer
```sql
SELECT
  referrer,
  COUNT(*) AS audits,
  AVG(score) AS avg_score,
  COUNT(*) FILTER (WHERE is_paid = true) AS paid_conversions
FROM audits
WHERE referrer IS NOT NULL
GROUP BY referrer
ORDER BY audits DESC;
```

---

**Last Updated:** March 19, 2026
