# Metrics & KPIs

## North Star Metric

**Monthly Recurring Revenue (MRR)**

Everything we do should drive MRR. All other metrics are leading indicators.

---

## Funnel Metrics

```
Visitors → Audit Started → Audit Completed → Email Captured → Pro Converted → Retained
```

### Acquisition (Top of Funnel)

| Metric | Definition | Target | Source |
|--------|------------|--------|--------|
| **Unique Visitors** | Visitors to /onboarding | 5,000/mo | Analytics |
| **Traffic by Referrer** | Breakdown by influencer | Track each | `?ref=` param |
| **Audit Start Rate** | % visitors who click "Start" | 60%+ | Analytics |

### Activation (Middle of Funnel)

| Metric | Definition | Target | Source |
|--------|------------|--------|--------|
| **Audit Completion Rate** | % who finish full audit | 70%+ | Database |
| **Email Capture Rate** | % who provide email | 70%+ | Database |
| **Time to Results** | Seconds from URL submit to results | < 15s | Logs |
| **Error Rate** | % audits that fail | < 5% | Logs |

### Revenue (Bottom of Funnel)

| Metric | Definition | Target | Source |
|--------|------------|--------|--------|
| **Free-to-Paid Conversion** | % free users who upgrade | 3-5% | Stripe |
| **MRR** | Monthly recurring revenue | $1,000+ (Month 1) | Stripe |
| **ARPU** | Average revenue per user | $19 | Stripe |
| **CAC** | Cost to acquire paid user | < $50 | Calculated |

### Retention

| Metric | Definition | Target | Source |
|--------|------------|--------|--------|
| **Month 1 Retention** | % Pro users still active after 30 days | 80%+ | Stripe |
| **Churn Rate** | % users who cancel per month | < 10% | Stripe |
| **Re-audit Rate** | % free users who audit again | 20%+ | Database |
| **NPS Score** | Net Promoter Score | > 30 | Survey |

---

## Influencer-Specific Metrics

Track separately for each influencer:

| Metric | Kumud | Sibel | Olga |
|--------|-------|-------|------|
| Visitors | ? | ? | ? |
| Audits | ? | ? | ? |
| Emails | ? | ? | ? |
| Pro Conversions | ? | ? | ? |
| Revenue | ? | ? | ? |
| Rev Share Owed | ? | ? | ? |

**Tracking**: Use `?ref=kumud`, `?ref=sibel`, `?ref=olga` parameters

---

## Product Quality Metrics

| Metric | Definition | Target | Action if Below |
|--------|------------|--------|-----------------|
| **Score Accuracy** | User agrees with score (survey) | 80%+ | Improve AI prompt |
| **Fix Relevance** | Fixes rated helpful (survey) | 80%+ | Improve AI prompt |
| **Headline Quality** | User uses suggested headline | 30%+ | Improve generation |
| **Page Load Time** | Time to interactive | < 2s | Optimize frontend |
| **API Response Time** | /api/audit response | < 10s | Optimize scraping/AI |

---

## Weekly Dashboard

### Must-Track (Check Daily)
1. Audits completed (cumulative + daily)
2. Pro conversions (cumulative + daily)
3. MRR (current)
4. Error rate

### Review Weekly
1. Conversion rates by funnel stage
2. Referrer breakdown
3. NPS/feedback themes
4. Feature requests

### Review Monthly
1. Cohort retention
2. LTV calculations
3. Influencer performance
4. Revenue vs targets

---

## Targets by Phase

### Phase 1A: Soft Launch (Week 1)
| Metric | Target |
|--------|--------|
| Audits | 500 |
| Completion rate | 60%+ |
| Critical bugs | 0 |

### Phase 1B: Full Launch (Week 2-4)
| Metric | Target |
|--------|--------|
| Audits | 3,000 |
| Emails | 2,100 |
| Pro subscribers | 90 |
| MRR | $1,710 |

### Phase 1C: Month 2-3
| Metric | Target |
|--------|--------|
| Audits | 5,000/mo |
| Emails | 3,500/mo |
| Pro subscribers | 150 (cumulative) |
| MRR | $2,850 |
| Churn | < 10% |

### Phase 2: Job Board (Month 3-4)
| Metric | Target |
|--------|--------|
| Job board visits | 10,000/mo |
| Job alert signups | 1,000/mo |
| Optimizer upsells from job board | 100/mo |

---

## Analytics Setup

### Required Tools
1. **Plausible or PostHog** - Privacy-friendly web analytics
2. **Stripe Dashboard** - Revenue, subscriptions, churn
3. **Supabase Dashboard** - Database metrics
4. **Custom Dashboard** - Funnel visualization

### Event Tracking

```javascript
// Key events to track
track('audit_started', { ref: 'kumud' });
track('audit_completed', { score: 72, ref: 'kumud' });
track('email_captured', { ref: 'kumud' });
track('pro_clicked', { ref: 'kumud' });
track('pro_converted', { plan: 'monthly', ref: 'kumud' });
track('headline_copied');
track('fix_expanded', { fix_id: 'headline' });
```

### Attribution
- First-touch attribution via `?ref=` parameter
- Store in localStorage + database
- Carry through to Stripe metadata

---

## Alerting

### Critical Alerts (Immediate)
- Error rate > 10%
- API down > 5 minutes
- Stripe webhook failures
- Database connection errors

### Warning Alerts (Daily Review)
- Completion rate drops > 20%
- Conversion rate drops > 50%
- Unusual traffic spike/drop

---

## Reporting Cadence

| Report | Frequency | Audience |
|--------|-----------|----------|
| Daily metrics email | Daily | Founders |
| Weekly dashboard review | Weekly | Founders |
| Influencer performance | Weekly | Founders + Influencers |
| Monthly business review | Monthly | All stakeholders |

---

*Last Updated: March 18, 2026*
