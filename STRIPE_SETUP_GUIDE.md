# Stripe Webhook Setup Guide

## Step 1: Configure Webhook Endpoint in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. Enter endpoint URL:
   ```
   https://linkedin-deal-magnet.vercel.app/api/webhook
   ```
4. Under **"Select events to listen to"**, choose:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created` (optional for Pro subscriptions)
   - ✅ `customer.subscription.deleted` (optional for cancellations)
5. Click **"Add endpoint"**

## Step 2: Get Webhook Signing Secret

After creating the endpoint:

1. Click on the endpoint you just created
2. Look for **"Signing secret"** section
3. Click **"Reveal"** or copy the secret
4. It will look like: `whsec_...`

## Step 3: Add Secret to Vercel

Run this command (replace `whsec_XXX` with your actual secret):

```bash
cd /Users/ericcoffie/Linkedin\ App
echo "whsec_YOUR_ACTUAL_SECRET_HERE" | vercel env add STRIPE_WEBHOOK_SECRET production
```

Example:
```bash
echo "whsec_abc123xyz..." | vercel env add STRIPE_WEBHOOK_SECRET production
```

## Step 4: Add Secret to Local .env

Also add it to your local `.env` file for testing:

```bash
echo "STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET_HERE" >> .env
```

## Step 5: Test the Webhook

Stripe provides a test tool:

1. Go to your webhook endpoint in dashboard
2. Click **"Send test webhook"**
3. Choose event type: `checkout.session.completed`
4. Click **"Send test webhook"**
5. Check the response - should show **200 OK**

## Verification Checklist

- [ ] Webhook endpoint URL added in Stripe
- [ ] Events selected: `checkout.session.completed`
- [ ] Signing secret copied
- [ ] Secret added to Vercel production
- [ ] Secret added to local .env
- [ ] Test webhook sent successfully
- [ ] Response shows 200 OK

## Troubleshooting

### Webhook fails with 400 error
- Check that `STRIPE_WEBHOOK_SECRET` is set correctly in Vercel
- Verify the secret matches what's in Stripe dashboard
- Make sure the endpoint URL is exactly: `https://linkedin-deal-magnet.vercel.app/api/webhook`

### Webhook returns 200 but nothing happens
- Check Vercel logs: `vercel logs https://linkedin-deal-magnet.vercel.app --follow`
- Look for database errors or email sending failures

### Email not sending
- Verify `RESEND_API_KEY` is set in Vercel
- Check Resend dashboard for delivery status
- Look for errors in Vercel logs

---

## Next Steps After Setup

Once webhook is configured:

1. Run end-to-end payment test (Stripe test mode)
2. Use test card: `4242 4242 4242 4242`
3. Verify audit marked as paid in database
4. Check email was sent to test address
5. If all passes → ready for production!

---

**Last Updated:** April 8, 2026
