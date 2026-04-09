# Error Patterns & Solutions

Searchable catalog of common errors and their fixes.

---

## Format

```
## [Error Name/Message]

**Symptom:** What the user sees or what breaks
**Cause:** Why it happens
**Solution:** How to fix it
**Prevention:** How to avoid it in the future
**Related:** Links to similar errors or docs
```

---

## API Errors

### Claude API: "Rate Limit Exceeded"

**Symptom:** `/api/audit-manual` returns 429 error, user sees "High demand, please try again"

**Cause:**
- Exceeded Anthropic API rate limits (50 requests/min on Tier 1)
- Too many audits in short time period

**Solution:**
```javascript
// Implement exponential backoff
async function callAnthropicWithRetry(prompt, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await anthropic.messages.create({...});
      return response;
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}
```

**Prevention:**
- Upgrade to Anthropic Tier 2 (1,000 req/min)
- Implement request queuing
- Cache common profile patterns

**Related:** Grok API rate limits, OpenAI rate limits

---

### Stripe API: "No such customer"

**Symptom:** Webhook fails with "No such customer" when trying to retrieve customer data

**Cause:**
- Using test mode customer ID in production
- Customer deleted from Stripe dashboard
- Wrong API key (test vs live)

**Solution:**
```javascript
// Always check if customer exists before using
const customer = await stripe.customers.retrieve(customerId).catch(err => {
  if (err.code === 'resource_missing') {
    // Create new customer
    return stripe.customers.create({ email: userEmail });
  }
  throw err;
});
```

**Prevention:**
- Use environment-specific API keys
- Never hardcode customer IDs
- Always handle missing customer gracefully

**Related:** Stripe payment intent errors

---

### Supabase: "Row-level security policy violation"

**Symptom:** Database query fails with RLS error, user can't see their own data

**Cause:**
- RLS enabled but no policy allows access
- User not authenticated when querying
- Using wrong user ID in query

**Solution:**
```javascript
// Use service role key for backend operations
const { data, error } = await supabase
  .from('audits')
  .select('*')
  .eq('user_id', userId);

// OR ensure user is authenticated
const { data: { user } } = await supabase.auth.getUser();
```

**Prevention:**
- Use service role key in backend (bypasses RLS)
- Test RLS policies with actual user sessions
- Document which operations need service vs anon key

**Related:** Supabase auth errors

---

## Frontend Errors

### Character Counter Not Updating

**Symptom:** User types in headline/about field but character count stays at 0

**Cause:**
- Event listener not attached
- Wrong element ID referenced
- JavaScript not loaded

**Solution:**
```javascript
// Ensure event listener is attached correctly
const headlineInput = document.getElementById('headline-input');
const charCount = document.getElementById('headline-char-count');

headlineInput.addEventListener('input', (e) => {
  const length = e.target.value.length;
  charCount.textContent = `${length}/220`;

  // Update color based on length
  if (length > 220) {
    charCount.classList.add('text-red-500');
  } else {
    charCount.classList.remove('text-red-500');
  }
});
```

**Prevention:**
- Use `DOMContentLoaded` to ensure DOM is ready
- Test character counter on form load
- Add error logging for missing elements

**Related:** Form validation errors

---

### Score Ring Not Animating

**Symptom:** Score ring displays but doesn't animate from 0 to actual score

**Cause:**
- SVG animation not triggered
- CSS animation not loaded
- Score set before animation initialized

**Solution:**
```javascript
// Delay score update to allow animation setup
setTimeout(() => {
  const scoreRing = document.querySelector('.score-ring-fill');
  const radius = scoreRing.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  scoreRing.style.strokeDasharray = circumference;
  scoreRing.style.strokeDashoffset = offset;
}, 100);
```

**Prevention:**
- Test animation in all browsers
- Use CSS transitions instead of JS when possible
- Add fallback for browsers without CSS animation support

**Related:** Loading animation issues

---

### Stripe Checkout Redirect Fails

**Symptom:** Click "$97 CTA" but nothing happens, no redirect to Stripe

**Cause:**
- `sessionUrl` is undefined
- CORS blocking redirect
- Stripe publishable key missing

**Solution:**
```javascript
async function purchaseProfileRewrite() {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auditId: currentAuditId,
        email: userEmail
      })
    });

    const { sessionUrl } = await response.json();

    if (!sessionUrl) {
      throw new Error('No checkout session URL returned');
    }

    window.location.href = sessionUrl;
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Payment failed. Please try again.');
  }
}
```

**Prevention:**
- Always check for `sessionUrl` before redirecting
- Log errors to Supabase for debugging
- Test payment flow end-to-end before launch

**Related:** Payment webhook errors

---

## Backend Errors

### "Cannot read property 'experience' of undefined"

**Symptom:** `/api/audit-manual` crashes when processing profile data

**Cause:**
- User didn't fill out experience section
- Request body parsing failed
- Malformed JSON

**Solution:**
```javascript
// Validate all required fields
app.post('/api/audit-manual', async (req, res) => {
  const { email, profileUrl, headline, about, experience } = req.body;

  // Check required fields
  if (!email || !profileUrl || !headline || !about) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }

  // Check experience array
  if (!experience || !Array.isArray(experience) || experience.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Please provide at least 2 work experiences'
    });
  }

  // Continue processing...
});
```

**Prevention:**
- Validate all inputs at API boundary
- Use TypeScript for type safety
- Add frontend validation before submission

**Related:** Form validation errors

---

### Webhook Signature Verification Failed

**Symptom:** Stripe webhook returns 400, payment confirmation doesn't trigger

**Cause:**
- Wrong webhook secret
- Stripe sending to wrong endpoint
- Raw body not available for verification

**Solution:**
```javascript
// Ensure raw body is available for Stripe signature verification
app.post('/api/webhook/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Process event...
    res.json({ received: true });
  }
);
```

**Prevention:**
- Use `express.raw()` middleware for webhook endpoint
- Store webhook secret in environment variables
- Test webhooks using Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook/stripe`

**Related:** Payment processing errors

---

## Database Errors

### "Duplicate key value violates unique constraint"

**Symptom:** Can't create user or audit, database insert fails

**Cause:**
- Email already exists in users table
- Same audit submitted twice
- Unique constraint on column

**Solution:**
```javascript
// Use upsert instead of insert
const { data, error } = await supabase
  .from('users')
  .upsert({
    email: userEmail,
    linkedin_id: linkedinId,
    updated_at: new Date()
  }, {
    onConflict: 'email'
  });

if (error) {
  console.error('Upsert error:', error);
}
```

**Prevention:**
- Use `upsert` for idempotency
- Check for existing records before insert
- Handle unique constraint errors gracefully

**Related:** RLS policy errors

---

### Query Timeout (Statement Timeout)

**Symptom:** Database query takes >30s and times out

**Cause:**
- Missing index on queried column
- Querying large table without filters
- Complex JOIN or aggregation

**Solution:**
```sql
-- Add index to frequently queried columns
CREATE INDEX idx_audits_user_id ON audits(user_id);
CREATE INDEX idx_audits_created_at ON audits(created_at);
CREATE INDEX idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);

-- Use EXPLAIN to analyze slow queries
EXPLAIN ANALYZE SELECT * FROM audits WHERE user_id = 'uuid';
```

**Prevention:**
- Add indexes during schema creation
- Use `EXPLAIN ANALYZE` to test queries
- Limit result sets (pagination)

**Related:** Performance issues

---

## Environment & Deployment Errors

### "Environment variable is undefined"

**Symptom:** App crashes on startup with "Cannot read property of undefined" for `process.env.X`

**Cause:**
- Missing `.env` file locally
- Environment variable not set in Vercel
- Typo in variable name

**Solution:**
1. **Local:** Create `.env` file with all required vars
```bash
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_test_...
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...
```

2. **Production:** Set in Vercel dashboard
   - Go to project Settings → Environment Variables
   - Add all required vars
   - Redeploy after adding

**Prevention:**
- Create `.env.example` with all var names (no values)
- Document required vars in README
- Use `dotenv` package and check vars on startup

**Related:** Deployment failures

---

### Vercel Deployment Fails: "Build Error"

**Symptom:** `vercel --prod` fails during build step

**Cause:**
- Syntax error in code
- Missing dependency in package.json
- Build script fails

**Solution:**
```bash
# Test build locally first
npm run build

# Check build logs
vercel --prod --debug

# Common fixes:
npm install --save missing-package
```

**Prevention:**
- Always test build locally before deploying
- Use CI/CD to catch errors pre-deploy
- Pin dependency versions in package.json

**Related:** Node.js version mismatches

---

## Performance Issues

### Audit Takes >30 Seconds

**Symptom:** User waits forever, loading spinner spins indefinitely

**Cause:**
- AI API slow to respond
- Large profile data (very long About section)
- Network latency

**Solution:**
```javascript
// Set timeout on API calls
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 25000); // 25s timeout

try {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal: controller.signal,
    headers: { ... },
    body: JSON.stringify({ ... })
  });

  clearTimeout(timeout);
  return response;
} catch (error) {
  if (error.name === 'AbortError') {
    // Retry with fallback model or show error
    throw new Error('Request timed out');
  }
}
```

**Prevention:**
- Set aggressive timeouts (15-20s max for UX)
- Show progress updates during loading
- Optimize prompts to reduce token count

**Related:** API timeout errors

---

## Common User Errors

### "Please enter a valid LinkedIn URL"

**Symptom:** User can't submit form, validation blocks them

**Cause:**
- User pasted wrong URL format
- Copied custom URL instead of /in/username

**Solution:**
```javascript
// Accept multiple URL formats
function validateLinkedInUrl(url) {
  const patterns = [
    /linkedin\.com\/in\/[\w-]+/,           // /in/username
    /linkedin\.com\/pub\/[\w-]+/,          // /pub/username
    /linkedin\.com\/profile\/view\?id=/    // legacy format
  ];

  return patterns.some(pattern => pattern.test(url));
}
```

**Prevention:**
- Show example URLs in placeholder text
- Auto-correct common mistakes (remove trailing slashes)
- Allow paste from clipboard

**Related:** Form validation errors

---

### Email Not Received After Payment

**Symptom:** User paid but didn't get delivery email

**Cause:**
- Email in spam folder
- Resend API failed
- Wrong email address entered
- Webhook didn't fire

**Solution:**
1. Check Stripe webhook logs for failed events
2. Check Resend dashboard for delivery status
3. Manually resend email from support

```javascript
// Add email to database even if send fails
await supabase.from('pending_emails').insert({
  user_email: email,
  email_type: 'profile_rewrite_delivery',
  audit_id: auditId,
  status: 'pending'
});

// Retry failed emails via cron job
```

**Prevention:**
- Send confirmation immediately, then delivery later
- Use transactional email provider (Resend, SendGrid)
- Add support email in all communications
- Monitor delivery rates

**Related:** Webhook failures

---

## Monitoring & Alerts

### Set Up Alerts For:

1. **API Error Rate >5%**
   - Alert: Slack/email
   - Action: Check API status, switch to fallback

2. **Payment Failures >10% of attempts**
   - Alert: Immediate email
   - Action: Check Stripe dashboard, verify webhook

3. **Page Load Time >3s**
   - Alert: Daily digest
   - Action: Optimize images, reduce JS bundle

4. **Audit Completion Rate <80%**
   - Alert: Weekly report
   - Action: Check for UX blockers, improve form

---

**Last Updated:** March 19, 2026
