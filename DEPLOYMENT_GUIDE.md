# LinkedIn Deal Magnet - Deployment Guide

**Version**: 1.0
**Last Updated**: March 19, 2026
**Target Platform**: Vercel

---

## Pre-Deployment Checklist

Before deploying to production, ensure all these items are complete:

### Code Readiness
- [ ] All tests pass (see `TESTING_CHECKLIST.md`)
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] Database schema deployed to Supabase
- [ ] Environment variables documented
- [ ] `.env.example` file updated
- [ ] `.gitignore` includes `.env` files

### Documentation
- [ ] README.md updated with project overview
- [ ] API_DOCUMENTATION.md complete
- [ ] CLAUDE.md has session handoff info
- [ ] IMPLEMENTATION_SUMMARY.md up to date

### Legal & Compliance
- [ ] Privacy policy updated (no scraping references)
- [ ] Terms of service updated
- [ ] Cookie policy (if needed)
- [ ] GDPR compliance verified

---

## Vercel Deployment

### Step 1: Install Vercel CLI (If Not Installed)

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Link Project to Vercel

```bash
cd ~/Linkedin\ App
vercel link
```

**Prompts**:
- Set up and deploy: **Yes**
- Which scope: Select your personal account or team
- Link to existing project: **No** (for first deployment)
- Project name: `linkedin-deal-magnet` (or your preferred name)

### Step 4: Configure Environment Variables

Add environment variables via Vercel dashboard or CLI:

```bash
# Add via CLI (one by one)
vercel env add ANTHROPIC_API_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_PRICE_FULL_FIX
vercel env add SESSION_SECRET
vercel env add LINKEDIN_CLIENT_ID
vercel env add LINKEDIN_CLIENT_SECRET
```

**Or via Dashboard**:
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable with values from `.env`

**Important**: Use **production** values, not development values!

### Required Environment Variables

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `ANTHROPIC_API_KEY` | Claude API key | `sk-ant-api03-...` | [console.anthropic.com](https://console.anthropic.com) |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` | Supabase dashboard |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | `eyJhbGc...` | Supabase dashboard → Settings → API |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` | [dashboard.stripe.com](https://dashboard.stripe.com) |
| `STRIPE_PRICE_FULL_FIX` | Stripe price ID | `price_...` | Stripe product page |
| `SESSION_SECRET` | Random secret for sessions | Generate with `openssl rand -hex 32` | Terminal |
| `LINKEDIN_CLIENT_ID` | LinkedIn OAuth ID | `78bpva284ayh4p` | [LinkedIn Developer Portal](https://www.linkedin.com/developers) |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn OAuth secret | `WPL_AP1...` | LinkedIn Developer Portal |
| `NODE_ENV` | Environment | `production` | Manual entry |

### Optional Environment Variables

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `GROK_API_KEY` | Grok API fallback | - | Only if using Grok |
| `OPENAI_API_KEY` | OpenAI fallback | - | Only if using OpenAI |
| `PORT` | Server port | `3000` | Vercel manages this |

### Step 5: Update vercel.json

Create or update `vercel.json` in project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/auth/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/onboarding",
      "dest": "/onboarding.html"
    },
    {
      "src": "/",
      "dest": "/index.html"
    }
  ]
}
```

### Step 6: Deploy to Production

```bash
vercel --prod
```

**Deployment Steps**:
1. Vercel uploads files
2. Builds the project
3. Deploys to production URL
4. Returns deployment URL

**Expected Output**:
```
Vercel CLI 33.0.0
🔍  Inspect: https://vercel.com/...
✅  Production: https://linkedin-deal-magnet.vercel.app [2m]
```

### Step 7: Update LinkedIn OAuth Redirect URI

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers)
2. Select your app
3. Update **Redirect URLs** to include:
   - `https://your-vercel-url.vercel.app/auth/linkedin/callback`
4. Save changes

### Step 8: Update Stripe Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add new endpoint:
   - URL: `https://your-vercel-url.vercel.app/api/webhook/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`
3. Copy webhook signing secret
4. Add to Vercel env: `STRIPE_WEBHOOK_SECRET`

---

## Database Setup (Supabase)

### Step 1: Create Supabase Project (If Not Exists)

1. Go to [supabase.com](https://supabase.com)
2. Click **New Project**
3. Choose organization
4. Name: `linkedin-deal-magnet`
5. Database password: Generate strong password
6. Region: Choose closest to your users
7. Wait for project creation (~2 minutes)

### Step 2: Run Schema Migration

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy contents of `db/schema.sql`
4. Paste and click **Run**

**Verify**:
- Go to **Table Editor**
- Check tables exist: `audits`, `users`, `payments` (if in schema)

### Step 3: Create Indexes (Performance)

```sql
-- Index for finding audits by email
CREATE INDEX idx_audits_email ON audits(email);

-- Index for sorting by date
CREATE INDEX idx_audits_created_at ON audits(created_at DESC);

-- Index for filtering by score
CREATE INDEX idx_audits_score ON audits(score);
```

### Step 4: Enable Row Level Security (Optional)

```sql
-- Enable RLS on audits table
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for creating audits)
CREATE POLICY "Allow anonymous inserts" ON audits
  FOR INSERT
  WITH CHECK (true);

-- Allow users to read their own audits
CREATE POLICY "Users can read own audits" ON audits
  FOR SELECT
  USING (email = current_setting('request.jwt.claims')::json->>'email');
```

### Step 5: Get API Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → Not needed for server-side
   - **service_role key** → `SUPABASE_SERVICE_KEY` (⚠️ Keep secret!)

---

## Custom Domain Setup (Optional)

### Step 1: Add Custom Domain in Vercel

1. Go to Vercel dashboard → Your project
2. Go to **Settings** → **Domains**
3. Click **Add**
4. Enter your domain: `app.yourdomain.com`
5. Click **Add**

### Step 2: Configure DNS

Vercel will provide DNS records to add:

**Option A: CNAME Record** (Recommended)
```
Type: CNAME
Name: app (or your subdomain)
Value: cname.vercel-dns.com
TTL: Automatic
```

**Option B: A Record** (If root domain)
```
Type: A
Name: @ (root)
Value: 76.76.21.21 (Vercel's IP)
TTL: Automatic
```

### Step 3: Wait for DNS Propagation

- **Propagation time**: 5 minutes to 48 hours
- **Check status**: Vercel dashboard shows when verified
- **Test**: Visit `https://app.yourdomain.com`

### Step 4: Update OAuth and Webhooks

- **LinkedIn**: Add `https://app.yourdomain.com/auth/linkedin/callback`
- **Stripe**: Add `https://app.yourdomain.com/api/webhook/stripe`

---

## SSL Certificate

Vercel automatically provisions SSL certificates for all domains:

- **Automatic**: SSL enabled by default
- **Free**: Let's Encrypt certificates
- **Auto-renewal**: Certificates renew automatically
- **HTTPS redirect**: HTTP → HTTPS automatic

**Verify SSL**:
- Visit `https://your-domain.com`
- Check for padlock icon in browser
- Certificate should show as valid

---

## Post-Deployment Verification

### Step 1: Check Deployment URL

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Navigate to `/onboarding`
3. Verify page loads correctly

### Step 2: Test Health Endpoint

```bash
curl https://your-project.vercel.app/api/health
```

**Expected Response**:
```json
{"status":"ok","timestamp":"2026-03-19T..."}
```

### Step 3: Test Form Submission

1. Fill out onboarding form completely
2. Submit for analysis
3. Verify:
   - [ ] Loading animation appears
   - [ ] API completes in <15 seconds
   - [ ] Results display correctly
   - [ ] Database saves audit (check Supabase)

### Step 4: Test Stripe Checkout

1. Click "$97 Profile Rewrite" button
2. Verify Stripe checkout opens
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify success page redirect

### Step 5: Check Logs

```bash
vercel logs --prod
```

Look for:
- [ ] No errors in logs
- [ ] Successful API requests
- [ ] Database connections successful
- [ ] Claude API responses working

### Step 6: Mobile Testing

- [ ] Test on iPhone Safari
- [ ] Test on Android Chrome
- [ ] Verify responsive layout
- [ ] Check form usability

---

## Rollback Procedure

If deployment has issues, rollback to previous version:

### Via Dashboard
1. Go to Vercel dashboard → Your project
2. Click **Deployments** tab
3. Find previous working deployment
4. Click **⋮** → **Promote to Production**

### Via CLI
```bash
vercel rollback
```

---

## Monitoring & Alerts

### Vercel Analytics

Enable Vercel Analytics:
1. Go to project dashboard
2. **Analytics** tab
3. Enable Web Analytics
4. View real-time traffic

### Error Tracking (Optional)

**Option A: Vercel Logs**
```bash
vercel logs --prod --follow
```

**Option B: Sentry Integration**
1. Create Sentry account
2. Install SDK: `npm install @sentry/node`
3. Add to `server.js`:
```javascript
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

### Uptime Monitoring (Optional)

**Option A: UptimeRobot**
- Free tier: 50 monitors
- Check every 5 minutes
- Monitor: `https://your-domain.com/api/health`

**Option B: Pingdom**
- Paid service
- More detailed monitoring

---

## Scaling Considerations

### Vercel Limits (Hobby Plan)

- **Bandwidth**: 100 GB/month
- **Serverless executions**: 100 GB-hours
- **Build time**: Unlimited
- **Team members**: 1

**If you exceed**: Upgrade to Pro ($20/month)

### Database Scaling (Supabase)

**Free Tier Limits**:
- **Database size**: 500 MB
- **API requests**: 500k/month
- **Bandwidth**: 5 GB/month

**If you exceed**: Upgrade to Pro ($25/month)

### AI API Limits

**Anthropic Claude**:
- Check your usage at [console.anthropic.com](https://console.anthropic.com)
- Monitor token usage
- Set budget alerts

**Rate Limiting**: Consider implementing rate limits:
```javascript
// Example: 10 audits per IP per hour
const rateLimit = require('express-rate-limit');
const auditLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'Too many audits from this IP'
});
app.post('/api/audit-manual', auditLimiter, async (req, res) => {
  // ...
});
```

---

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

1. **Connect GitHub repo**:
   - Go to Vercel dashboard
   - **Settings** → **Git**
   - Connect GitHub repository

2. **Configure branches**:
   - **Production branch**: `main`
   - **Preview branches**: All other branches

3. **Push to deploy**:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel will automatically:
- Build the project
- Run any build scripts
- Deploy to production
- Update DNS

---

## Troubleshooting

### Deployment Fails

**Error**: "Build failed"
- **Check**: `vercel logs` for error details
- **Common causes**:
  - Missing dependencies in `package.json`
  - Syntax errors in code
  - Environment variables missing

**Error**: "Function timeout"
- **Cause**: `/api/audit-manual` takes >10 seconds
- **Solution**: Upgrade to Pro for 60s timeout

### Database Connection Fails

**Error**: "Connection refused"
- **Check**: `SUPABASE_URL` is correct
- **Check**: `SUPABASE_SERVICE_KEY` is set
- **Check**: Supabase project is active

### Stripe Webhook Not Working

**Error**: "Signature verification failed"
- **Check**: `STRIPE_WEBHOOK_SECRET` is correct
- **Check**: Webhook endpoint URL is correct
- **Test**: Use Stripe CLI to test locally:
```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

---

## Maintenance

### Regular Tasks

**Weekly**:
- [ ] Check Vercel logs for errors
- [ ] Monitor Supabase database size
- [ ] Review Stripe payments

**Monthly**:
- [ ] Update dependencies: `npm update`
- [ ] Review and optimize database
- [ ] Check AI API costs
- [ ] Review user feedback

**Quarterly**:
- [ ] Security audit
- [ ] Performance optimization
- [ ] Update privacy policy if needed
- [ ] Backup database

---

## Backup & Recovery

### Database Backups

**Automatic Backups** (Supabase Pro):
- Daily backups retained for 7 days
- Point-in-time recovery

**Manual Backup**:
```bash
# Export audits table
curl -X GET \
  "https://your-project.supabase.co/rest/v1/audits?select=*" \
  -H "apikey: YOUR_SERVICE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_KEY" \
  > audits_backup.json
```

### Code Backups

- **GitHub**: Primary backup
- **Vercel**: Deployment history
- **Local**: Keep local copy updated

---

## Launch Announcement

### Before Announcing

- [ ] Test all critical flows
- [ ] Verify analytics tracking
- [ ] Prepare support email
- [ ] Update social media profiles
- [ ] Create launch post templates

### Launch Checklist

- [ ] Tweet announcement
- [ ] Post on LinkedIn
- [ ] Email influencer partners (Kumud, Sibel, Olga)
- [ ] Update README with live URL
- [ ] Monitor for bugs/issues

---

## Support Contacts

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)
- **Stripe Support**: [support.stripe.com](https://support.stripe.com)
- **Anthropic Support**: [support@anthropic.com](mailto:support@anthropic.com)

---

*Last Updated: March 19, 2026*
