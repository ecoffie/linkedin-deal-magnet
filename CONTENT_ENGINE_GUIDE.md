# Content Engine MVP - Operations Guide

## 🎯 Overview

The Content Engine is your **$47/month subscription** that provides:
- 4 AI-generated LinkedIn posts per month
- Monthly profile re-audits
- Content calendar
- Priority support

---

## 🔄 Monthly Workflow

### When Someone Subscribes:

1. **Stripe sends webhook** → `/api/webhook` logs their info
2. **Check Vercel logs** or Stripe dashboard for new subscriber
3. **Generate their content** using the API (instructions below)
4. **Send Week 1 email** with first post + welcome
5. **Schedule remaining 3 emails** (Weeks 2, 3, 4)
6. **Month-end**: Run re-audit and repeat

---

## 🤖 How to Generate Content

### Step 1: Get Subscriber Info from Stripe

When someone subscribes, you'll see in Stripe Dashboard:
- Customer email
- Customer name
- Subscription ID

### Step 2: Generate 4 Posts

**Option A: Use API (Recommended)**

```bash
curl -X POST https://linkedin-deal-magnet.vercel.app/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "profileData": {
      "name": "John Doe",
      "headline": "Government Contracts Specialist",
      "about": "15 years winning federal contracts"
    },
    "customerInfo": {
      "email": "customer@example.com",
      "subscriptionId": "sub_xxx"
    }
  }'
```

**Option B: Use Grok Directly**

Go to https://grok.x.ai and paste:

```
Generate 4 LinkedIn posts for a government contractor:

Profile: [customer name]
Headline: [their headline]

Post types:
1. Thought leadership on winning contracts
2. Case study or win story
3. Industry commentary
4. Personal lesson learned

Make each 150-250 words with hashtags.
```

### Step 3: Review & Customize

- ✅ Read each post
- ✅ Personalize if needed
- ✅ Ensure quality
- ✅ Add any specific details about their wins

---

## 📧 Email Templates

### Week 1: Welcome + Post 1

**Subject:** Welcome to Deal Magnet Content Engine! 🚀

**Body:**

```
Hi [Name],

Welcome to the Content Engine! 🎉

You're now set up to receive 4 AI-generated LinkedIn posts each month,
plus monthly re-audits to keep your profile optimized.

Here's your FIRST POST for this week:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 POST TYPE: [Type]
⏰ BEST TIME TO POST: [Day/Time]
🏷️ HASHTAGS: [Hashtags]

[POST CONTENT HERE]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 ENGAGEMENT TIP: [Tip]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT'S NEXT:
✅ Post this on LinkedIn this week
✅ Engage with comments within first hour
✅ Watch for Week 2 post next [Day]

NEED HELP?
Reply to this email anytime. We're here to help!

Cheers,
The Deal Magnet Team

P.S. Your content calendar for this month:
- Week 1: [Type] ← You are here
- Week 2: [Type]
- Week 3: [Type] + Monthly Re-audit
- Week 4: [Type]
```

---

### Week 2, 3, 4: Posts Only

**Subject:** Your Week [X] LinkedIn Post is Ready 📝

**Body:**

```
Hi [Name],

Here's your LinkedIn post for Week [X]:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 POST TYPE: [Type]
⏰ BEST TIME TO POST: [Day/Time]
🏷️ HASHTAGS: [Hashtags]

[POST CONTENT HERE]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 ENGAGEMENT TIP: [Tip]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

See you next week with your [next type] post!

Cheers,
The Deal Magnet Team
```

---

### Week 3 Special: Include Re-Audit

Add this section after the post in Week 3 email:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 YOUR MONTHLY RE-AUDIT

Your profile score: [Score]/100

Top 3 improvements to make:
1. [Fix]
2. [Fix]
3. [Fix]

Full report: [Link to audit or PDF]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📅 Content Calendar Template

Include this in Week 1 email:

```
📅 YOUR CONTENT CALENDAR - [Month Year]

Week 1: Thought Leadership
Posted: [ ] Date posted: _______

Week 2: Case Study / Win Story
Posted: [ ] Date posted: _______

Week 3: Industry Commentary
Posted: [ ] Date posted: _______
+ Monthly Profile Re-Audit ✅

Week 4: Personal Story
Posted: [ ] Date posted: _______

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next month starts: [Date]
```

---

## 🔧 Monthly Re-Audit Process

### Week 3 of each month:

1. Visit https://linkedin-deal-magnet.vercel.app
2. Paste subscriber's LinkedIn URL
3. Run audit
4. Copy results
5. Include in Week 3 email

**Or** use API:

```bash
curl -X POST https://linkedin-deal-magnet.vercel.app/api/audit \
  -H "Content-Type: application/json" \
  -d '{"url": "https://linkedin.com/in/subscriber-profile"}'
```

---

## 📊 Tracking Subscribers

### Create a Simple Spreadsheet:

| Customer Email | Name | Subscribe Date | Last Content Sent | Last Audit | Status | Notes |
|---------------|------|----------------|-------------------|------------|--------|-------|
| john@example.com | John Doe | 2025-01-15 | Week 4 - 02/12 | 02/05 | Active | Loves thought leadership posts |

**Update weekly** when you send emails.

---

## ⚡ Quick Reference

### New Subscriber Checklist:
- [ ] Check Stripe for customer details
- [ ] Generate 4 posts using API
- [ ] Send Week 1 welcome email
- [ ] Add to tracking spreadsheet
- [ ] Schedule Week 2-4 reminders

### Weekly Tasks:
- [ ] Monday: Check for new subscribers
- [ ] Check which subscribers need this week's email
- [ ] Send weekly posts
- [ ] Update tracking sheet

### Monthly Tasks (Week 3):
- [ ] Run re-audits for all active subscribers
- [ ] Include audit in Week 3 emails
- [ ] Generate next month's content for active subs

---

## 🚀 Time-Saving Tips

1. **Batch content generation** - Generate posts for all subscribers at once
2. **Use email templates** - Copy/paste with find/replace
3. **Schedule send** - Use Gmail's schedule feature or email service
4. **Automate tracking** - Use Google Sheets with formulas

---

## 📈 Scaling Up (Future)

When you get to 10+ subscribers, consider:
- Email automation (SendGrid, Mailgun)
- Scheduled functions (generate content automatically)
- Simple database (track subscribers)
- Member portal (let them see all their posts)

---

## ❓ FAQ

**Q: What if a post doesn't look good?**
A: Regenerate using the API or edit manually. Quality over speed!

**Q: How long does this take per subscriber?**
A: ~5-10 minutes per subscriber per month once you have templates set up.

**Q: Can I pre-generate content?**
A: Yes! Generate all 4 posts on day 1 and schedule emails.

**Q: What if they cancel?**
A: Stripe webhook will log it. Stop sending emails.

---

## 📞 Support

If customers have questions:
- Reply to their emails personally
- Direct message on LinkedIn
- Email: support@dealmagnet.com (set this up)

---

**Last Updated:** December 15, 2025
