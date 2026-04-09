# API Integrations

All external APIs and services used in LinkedIn Deal Magnet.

---

## 1. LinkedIn OAuth API

**Purpose**: User authentication and profile data access

### Endpoints Used
- `POST https://www.linkedin.com/oauth/v2/authorization` - Initiate OAuth flow
- `POST https://www.linkedin.com/oauth/v2/accessToken` - Exchange code for token
- `GET https://api.linkedin.com/v2/userinfo` - Get user profile (OpenID Connect)

### Scopes Required
```javascript
['openid', 'profile', 'email']
```

### Environment Variables
```bash
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback
```

### Data Returned
```json
{
  "sub": "linkedin_user_id",
  "name": "John Smith",
  "email": "john@example.com",
  "picture": "https://media.licdn.com/...",
  "email_verified": true
}
```

### Current Status
- ✅ OAuth flow implemented
- ✅ Basic profile data retrieval
- ❌ Posts/activity retrieval (needs additional scopes)
- ❌ Company pages access (future feature)

### Rate Limits
- **OAuth**: 100 requests/day per app
- **Profile API**: 1,000 requests/day (Community tier)

### Documentation
https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2

---

## 2. Anthropic Claude API

**Purpose**: Primary AI model for profile analysis, headline generation, content creation

### Model Used
- **Primary**: `claude-3-5-sonnet-20241022` (most capable)
- **Fallback**: None currently (could add `claude-3-haiku` for cost savings)

### Endpoints Used
- `POST https://api.anthropic.com/v1/messages` - Text generation

### Environment Variables
```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### Usage Pattern
```javascript
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,
  messages: [{
    role: 'user',
    content: profileAnalysisPrompt
  }]
});
```

### Current Status
- ✅ Profile audit endpoint (`/api/audit-manual`)
- ✅ JSON response parsing
- ⏳ Headline generator (standalone endpoint planned)
- ⏳ About section rewriter (standalone endpoint planned)

### Rate Limits
- **Tier 1**: 50 requests/min, 40K tokens/min
- **Tier 2**: 1,000 requests/min, 80K tokens/min (upgrade if needed)

### Pricing
- Input: $3/million tokens
- Output: $15/million tokens
- **Est. cost per audit**: ~$0.05-0.10

### Documentation
https://docs.anthropic.com/en/api/messages

---

## 3. Stripe API

**Purpose**: Payment processing for $97 profile rewrite service

### Endpoints Used
- `POST /v1/checkout/sessions` - Create checkout session
- `POST /v1/webhook` - Payment confirmation webhook
- `GET /v1/customers` - Retrieve customer
- `GET /v1/payment_intents` - Check payment status

### Environment Variables
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_FULL_FIX=price_1SedI3K5zyiZ50PBOx0luGnq
```

### Products Created
| Product | Price ID | Amount | Type |
|---------|----------|--------|------|
| Profile Rewrite Service | `price_1SedI3K5zyiZ50PBOx0luGnq` | $97 | One-time |
| Pro Subscription (future) | TBD | $19/mo | Recurring |

### Current Status
- ✅ Basic Stripe SDK initialized
- ⏳ Checkout session creation endpoint
- ⏳ Webhook handler for payment confirmation
- ⏳ Customer creation/retrieval

### Rate Limits
- No hard limits (reasonable use)
- Webhook timeout: 30 seconds

### Pricing
- 2.9% + $0.30 per transaction
- **$97 sale**: $3.11 fee → $93.89 revenue

### Documentation
https://stripe.com/docs/api

---

## 4. Supabase (PostgreSQL Database)

**Purpose**: Data persistence for users, audits, payments

### Endpoints Used
- REST API: `https://[project-ref].supabase.co/rest/v1/`
- Auth: `https://[project-ref].supabase.co/auth/v1/`

### Environment Variables
```bash
SUPABASE_URL=https://krpyelfrbicmvsmwovti.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Tables
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User accounts | id, email, linkedin_id, name |
| `audits` | Profile audit results | id, user_id, score, fixes (JSONB) |
| `payments` | Payment records | id, user_id, stripe_payment_id, amount |

### Current Status
- ✅ Database connection configured
- ✅ User model defined
- ⏳ Audit persistence (needs testing)
- ⏳ Payment tracking

### Rate Limits
- Free tier: 500MB database, 2GB bandwidth/month
- Upgrade: $25/mo for 8GB database, 50GB bandwidth

### Documentation
https://supabase.com/docs

---

## 5. Resend (Email Service) - Phase 2

**Purpose**: Email delivery for audit results, job alerts, nurture sequences

### Endpoints Used
- `POST https://api.resend.com/emails` - Send email
- `POST https://api.resend.com/audiences/:id/contacts` - Add to list

### Environment Variables
```bash
RESEND_API_KEY=re_...
```

### Email Templates Needed
- **Audit Results Email** - Send after free audit completion
- **Payment Confirmation** - Send after $97 purchase
- **Weekly LinkedIn Tips** - Nurture sequence for free users
- **Job Alerts** - Phase 2 job board feature

### Current Status
- ❌ Not implemented yet (Phase 2)
- ⏳ API key obtained
- ⏳ Templates to be created

### Rate Limits
- Free tier: 100 emails/day
- Paid: $20/mo for 50K emails

### Pricing
- $0.001 per email after free tier

### Documentation
https://resend.com/docs

---

## 6. Adzuna Job Search API - Phase 2

**Purpose**: Job board lead magnet

### Endpoints Used
- `GET https://api.adzuna.com/v1/api/jobs/{country}/search/{page}` - Search jobs

### Environment Variables
```bash
ADZUNA_APP_ID=your_app_id
ADZUNA_API_KEY=your_api_key
```

### Parameters
- `what`: Job title/keywords (e.g., "product manager")
- `where`: Location (e.g., "San Francisco")
- `salary_min`: Minimum salary filter
- `full_time`: 1 for full-time only
- `results_per_page`: 10-50

### Current Status
- ❌ Not implemented yet (Phase 2)
- ⏳ API key to be obtained (free tier available)

### Rate Limits
- Free tier: 1,000 calls/month
- Paid: $250/mo for 50K calls

### Documentation
https://developer.adzuna.com/docs

---

## 7. Grok API (Fallback) - Optional

**Purpose**: Backup AI model if Claude fails

### Endpoints Used
- `POST https://api.x.ai/v1/chat/completions` - Text generation

### Environment Variables
```bash
GROK_API_KEY=xai-...
```

### Current Status
- ⏳ Implemented in code but not actively used
- ⏳ Can be enabled as fallback chain: Claude → Grok → OpenAI

### Documentation
https://docs.x.ai/

---

## 8. OpenAI API (Fallback) - Optional

**Purpose**: Secondary fallback AI model

### Endpoints Used
- `POST https://api.openai.com/v1/chat/completions` - Text generation

### Environment Variables
```bash
OPENAI_API_KEY=sk-...
```

### Current Status
- ⏳ Implemented in code but not actively used
- ⏳ Last resort fallback if Claude and Grok fail

### Documentation
https://platform.openai.com/docs

---

## API Error Handling Strategy

### 1. Primary → Fallback Chain
```
Claude API (primary)
  ↓ (if 500/503 error)
Grok API (fallback 1)
  ↓ (if error)
OpenAI API (fallback 2)
  ↓ (if error)
Generic error message to user
```

### 2. Rate Limit Handling
- Implement exponential backoff
- Queue requests if rate limited
- Show user-friendly message: "High demand, please wait 30 seconds"

### 3. Timeout Handling
- Set 30s timeout for all API calls
- If timeout, retry once, then fail gracefully

### 4. Monitoring
- Log all API errors to Supabase
- Track: endpoint, error type, timestamp, user_id
- Weekly review for patterns

---

## Cost Monitoring

### Monthly Cost Estimates (1,000 audits/month)

| Service | Usage | Cost |
|---------|-------|------|
| Claude API | 1,000 audits × $0.08 | $80 |
| Stripe fees | 15 sales × $3.11 | $47 |
| Supabase | Free tier | $0 |
| Vercel hosting | Free tier | $0 |
| LinkedIn API | Free tier | $0 |
| **Total** | | **$127** |

### Scale (10,000 audits/month)
| Service | Usage | Cost |
|---------|-------|------|
| Claude API | 10,000 audits × $0.08 | $800 |
| Stripe fees | 150 sales × $3.11 | $467 |
| Supabase | Pro plan | $25 |
| Vercel hosting | Pro plan | $20 |
| **Total** | | **$1,312** |

**Revenue at 10K audits**: 150 sales × $97 = $14,550
**Profit margin**: 91%

---

## Security Best Practices

1. **Never expose API keys in frontend code**
   - All API calls from backend only
   - Use environment variables

2. **Validate all inputs**
   - Sanitize profile URLs
   - Check email format
   - Limit text field lengths

3. **Rate limit endpoints**
   - Max 5 audits per email per day
   - Max 3 failed payment attempts per hour

4. **Encrypt sensitive data**
   - Supabase handles encryption at rest
   - Use HTTPS for all API calls

5. **Webhook verification**
   - Verify Stripe webhook signatures
   - Reject unsigned requests

---

**Last Updated:** March 19, 2026
