# LinkedIn Deal Magnet - API Documentation

**Version**: 1.0
**Last Updated**: March 19, 2026

---

## Base URL

- **Local Development**: `http://localhost:3000`
- **Production**: `https://your-domain.vercel.app` (TBD)

---

## Authentication

Currently, the API does not require authentication for the audit endpoint. Email is used for identification and result delivery.

**Future**: May add API keys for programmatic access or rate limiting.

---

## Endpoints

### 1. Profile Audit (Manual Input)

Creates a comprehensive LinkedIn profile audit based on user-provided data.

**Endpoint**: `POST /api/audit-manual`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "profileUrl": "https://linkedin.com/in/username",
  "headline": "Product Manager | Helping SaaS companies scale from $1M to $10M ARR",
  "about": "I'm a product manager with 8 years of experience...",
  "experience": [
    {
      "title": "Senior Product Manager",
      "company": "Acme Corp",
      "duration": "Jan 2020 - Present",
      "description": "Led product strategy for B2B SaaS platform serving 10,000+ users..."
    },
    {
      "title": "Product Manager",
      "company": "Previous Co",
      "duration": "May 2018 - Dec 2019",
      "description": "Managed product roadmap for mobile app..."
    }
  ],
  "skills": ["Product Management", "Agile", "SQL", "Data Analysis"],
  "hasPhoto": true,
  "hasBanner": false,
  "connectionCount": "500+",
  "referrer": "kumud-twitter"
}
```

**Request Parameters**:

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `email` | string | Yes | User's email address | Valid email format |
| `profileUrl` | string | Yes | LinkedIn profile URL | Must contain "linkedin.com" |
| `headline` | string | Yes | Current LinkedIn headline | Max 220 characters |
| `about` | string | Yes | About section content | Min 50 characters |
| `experience` | array | Yes | Work experience entries | Min 2 entries |
| `experience[].title` | string | Yes | Job title | - |
| `experience[].company` | string | Yes | Company name | - |
| `experience[].duration` | string | Yes | Time period | - |
| `experience[].description` | string | No | Role description | - |
| `skills` | array | No | List of skills | - |
| `hasPhoto` | boolean | No | Has profile photo | Default: false |
| `hasBanner` | boolean | No | Has banner image | Default: false |
| `connectionCount` | string | No | Connection range | Options: "0-50", "50-500", "500+", "500+ shown" |
| `referrer` | string | No | Traffic source | For analytics |

**Success Response (200 OK)**:
```json
{
  "success": true,
  "score": 72,
  "scoreLabel": "Looking Good",
  "currentHeadline": "Product Manager at Acme Corp",
  "aiHeadline": "Product Manager | Helping SaaS companies scale from $1M to $10M ARR | Expert in Growth Strategy",
  "fixes": [
    {
      "priority": "high",
      "title": "Optimize Your Headline",
      "description": "Your headline is too generic and doesn't showcase your unique value proposition.",
      "tips": "Include: [Role] | [Value Prop] | [Target Audience]. Example: 'Product Manager | Helping SaaS companies scale from $1M to $10M ARR'"
    },
    {
      "priority": "high",
      "title": "Add Featured Section",
      "description": "You're missing a Featured section. This is prime real estate to showcase your best work.",
      "tips": "Add 3-5 posts, articles, or external links that demonstrate your expertise in product management."
    },
    {
      "priority": "medium",
      "title": "Expand Your About Section",
      "description": "Your About section could be more impactful with specific metrics and results.",
      "tips": "Include quantifiable achievements, your unique approach, and a clear call-to-action."
    }
  ],
  "profileData": {
    "headline": "Product Manager at Acme Corp",
    "aboutLength": 287,
    "experienceCount": 2,
    "hasPhoto": true,
    "hasBanner": false,
    "connectionCount": "500+",
    "skillsCount": 4,
    "manualInput": true
  },
  "sessionId": "1710845123456",
  "auditId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Response Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the audit was successful |
| `score` | integer | Overall profile score (0-100) |
| `scoreLabel` | string | Score category: "Excellent" (80+), "Looking Good" (60-79), "Getting There" (40-59), "Needs Work" (0-39) |
| `currentHeadline` | string | User's current headline |
| `aiHeadline` | string | AI-generated optimized headline (≤220 chars) |
| `fixes` | array | List of 15-20 actionable recommendations |
| `fixes[].priority` | string | "high", "medium", or "low" |
| `fixes[].title` | string | Fix category/title |
| `fixes[].description` | string | What's wrong and why it matters |
| `fixes[].tips` | string | How to fix it |
| `profileData` | object | Summary of profile data analyzed |
| `sessionId` | string | Unique session identifier |
| `auditId` | string | Database audit ID (for retrieval) |

**Error Responses**:

**400 Bad Request** - Invalid input:
```json
{
  "success": false,
  "error": "Valid email is required"
}
```

**400 Bad Request** - Missing required fields:
```json
{
  "success": false,
  "error": "At least 2 work experiences are required"
}
```

**500 Internal Server Error** - Analysis failed:
```json
{
  "success": false,
  "error": "Failed to analyze profile",
  "message": "AI service timeout"
}
```

**Error Codes**:

| Status | Error Message | Cause | Solution |
|--------|---------------|-------|----------|
| 400 | "Valid email is required" | Invalid email format | Provide valid email with @ symbol |
| 400 | "Valid LinkedIn profile URL is required" | URL doesn't contain "linkedin.com" | Provide valid LinkedIn URL |
| 400 | "Headline is required" | Empty or missing headline | Provide headline text |
| 400 | "About section must be at least 50 characters" | About too short | Provide longer About section |
| 400 | "At least 2 work experiences are required" | < 2 experience entries | Add at least 2 work experiences |
| 500 | "Failed to analyze profile" | AI service error | Retry request or check logs |

---

### 2. Create Checkout Session

Creates a Stripe checkout session for purchasing the $97 profile rewrite service.

**Endpoint**: `POST /api/create-checkout-session`

**Request Body**:
```json
{
  "priceId": "price_1SedI3K5zyiZ50PBOx0luGnq",
  "mode": "payment",
  "successUrl": "https://your-domain.com/success?session_id={CHECKOUT_SESSION_ID}&rewrite=true",
  "cancelUrl": "https://your-domain.com/onboarding?canceled=true",
  "referrer": "kumud-twitter",
  "email": "user@example.com"
}
```

**Success Response (200 OK)**:
```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Error Response (500)**:
```json
{
  "error": "Checkout session creation failed"
}
```

---

### 3. Get LinkedIn Profile (OAuth)

Retrieves authenticated user's LinkedIn profile data from session.

**Endpoint**: `GET /api/linkedin/profile`

**Authentication**: Requires active session after LinkedIn OAuth

**Success Response (200 OK)**:
```json
{
  "success": true,
  "profile": {
    "id": "abc123",
    "name": "John Smith",
    "email": "john@example.com",
    "picture": "https://media.licdn.com/...",
    "headline": "Product Manager at Acme Corp",
    "posts": []
  }
}
```

**Error Response (401)**:
```json
{
  "success": false,
  "error": "No LinkedIn profile found in session"
}
```

---

### 4. Health Check

Checks if the API is running.

**Endpoint**: `GET /api/health`

**Success Response (200 OK)**:
```json
{
  "status": "ok",
  "timestamp": "2026-03-19T12:00:00.000Z"
}
```

---

## Rate Limiting

**Current**: No rate limiting implemented

**Planned**:
- 10 audits per email per day (free tier)
- 100 requests per IP per hour
- Paid users: unlimited

---

## Data Persistence

### Audit Storage

All audits are saved to Supabase `audits` table:

```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  linkedin_url TEXT,
  score INTEGER,
  score_label VARCHAR(50),
  ai_headline TEXT,
  fixes JSONB,
  profile_data JSONB,
  is_paid BOOLEAN DEFAULT FALSE,
  referrer VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Retrieving Past Audits

**Coming Soon**: `GET /api/audit/:id` endpoint to retrieve saved audits

---

## AI Analysis

### Provider Chain

1. **Primary**: Claude API (Anthropic)
   - Model: `claude-sonnet-4-20250514`
   - Max tokens: 4000
   - Timeout: 60s

2. **Fallback 1**: Grok API (xAI)
   - Model: `grok-3`
   - Max tokens: 4000
   - Timeout: 60s

3. **Fallback 2**: OpenAI
   - Model: `gpt-4o-mini`
   - Max tokens: 4000
   - Timeout: 60s

### Analysis Criteria

Score is calculated based on:
- **Headline quality** (20 points): Clear role, value prop, target audience
- **About section** (20 points): Storytelling, metrics, CTA
- **Experience descriptions** (20 points): Results-focused, quantifiable
- **Profile completeness** (20 points): Photo, banner, featured section
- **Professional presence** (20 points): Brand clarity, engagement signals

---

## WebHooks

### Stripe Webhook

**Endpoint**: `POST /api/webhook/stripe`

**Purpose**: Handle payment confirmation for profile rewrite purchases

**Events Handled**:
- `checkout.session.completed`
- `payment_intent.succeeded`

**Verification**: Validates Stripe signature header

---

## Integration Examples

### JavaScript (Fetch API)

```javascript
async function analyzeProfile(profileData) {
  try {
    const response = await fetch('/api/audit-manual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Analysis failed');
    }

    const result = await response.json();
    console.log(`Score: ${result.score}/100 (${result.scoreLabel})`);
    console.log(`AI Headline: ${result.aiHeadline}`);
    console.log(`${result.fixes.length} fixes recommended`);

    return result;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}
```

### cURL

```bash
curl -X POST http://localhost:3000/api/audit-manual \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "profileUrl": "https://linkedin.com/in/username",
    "headline": "Product Manager at Acme Corp",
    "about": "I help companies build great products...",
    "experience": [
      {
        "title": "Senior Product Manager",
        "company": "Acme Corp",
        "duration": "2020 - Present",
        "description": "Led product strategy..."
      },
      {
        "title": "Product Manager",
        "company": "Previous Co",
        "duration": "2018 - 2020",
        "description": "Managed roadmap..."
      }
    ],
    "skills": ["Product Management", "Agile"],
    "hasPhoto": true,
    "hasBanner": false,
    "connectionCount": "500+"
  }'
```

### Python

```python
import requests

def analyze_profile(profile_data):
    url = "http://localhost:3000/api/audit-manual"
    headers = {"Content-Type": "application/json"}

    response = requests.post(url, json=profile_data, headers=headers)

    if response.status_code == 200:
        result = response.json()
        print(f"Score: {result['score']}/100 ({result['scoreLabel']})")
        print(f"AI Headline: {result['aiHeadline']}")
        return result
    else:
        error = response.json()
        raise Exception(error.get('error', 'Analysis failed'))
```

---

## Best Practices

### Request Optimization

1. **Validate data client-side** before sending to API
2. **Trim whitespace** from all text fields
3. **Limit experience entries** to 3 (more won't improve analysis)
4. **Cache results** by email to avoid duplicate audits

### Error Handling

1. **Always check `success` field** in response
2. **Display error.message** to users when available
3. **Implement retry logic** for 500 errors (max 2 retries)
4. **Log failed requests** with request body for debugging

### Performance

- **Expected response time**: 10-15 seconds
- **Timeout recommendation**: 30 seconds
- **Max payload size**: 50KB

---

## Changelog

### v1.0 (March 19, 2026)
- Initial API release
- Added `/api/audit-manual` endpoint
- Manual input approach (no scraping)
- Claude API integration
- Supabase persistence

### Planned (v1.1)
- `GET /api/audit/:id` - Retrieve past audits
- `GET /api/audit/by-email/:email` - Get all audits for email
- Rate limiting implementation
- API key authentication

---

## Support

**Issues**: Report bugs at [GitHub Issues](https://github.com/your-repo/issues)
**Questions**: Contact hello@yourdomain.com
**Status**: Check API status at [status.yourdomain.com](https://status.yourdomain.com)

---

*Last Updated: March 19, 2026*
