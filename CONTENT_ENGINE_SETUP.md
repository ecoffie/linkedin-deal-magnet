# Content Engine Setup - Implementation Guide

Complete guide for the Content Engine intake form and backend integration.

## 📋 What's Included

### Frontend (`content-engine-setup.html`)
- ✅ Multi-step form with 7 steps
- ✅ 1-3 questions per page
- ✅ Progress indicator
- ✅ Form validation
- ✅ Beautiful UI matching your brand

### Backend (`server.js`)
- ✅ `/api/content-engine/setup` endpoint
- ✅ Data structure ready for database storage
- ✅ Error handling

## 🎯 Form Flow

**Step 1: Business Basics** (3 questions)
- Name & role
- Business description
- Services/offers

**Step 2: Ideal Customer** (3 questions)
- Customer profile
- Pain points
- Goals

**Step 3: Customer Journey** (3 questions)
- Objections
- Triggers
- Client results

**Step 4: Customer Stories** (2 questions)
- Best customer stories
- Proud wins

**Step 5: Voice & Positioning** (3 questions)
- Positioning statement
- Voice words
- Style examples

**Step 6: Content Sources** (3 questions)
- Website URL
- Content URLs
- Media URLs

**Step 7: Preferences** (3 questions)
- Content types
- Frequency
- Topics to avoid

## 🔧 Integration Steps

### 1. Add Route to Your App

The form is standalone HTML. To integrate:

**Option A: Standalone Page**
- Link to `content-engine-setup.html` from your main app
- After Stripe subscription, redirect users here

**Option B: Embed in Main App**
- Copy the form HTML into your main `index.html`
- Add a route/button to access it

### 2. Update Backend Storage

Currently, the endpoint logs the data. Update to save to database:

```javascript
// In server.js, replace the TODO section:
const contentProfile = { /* ... */ };

// Save to database (example with MongoDB or similar)
await db.contentProfiles.create({
    userId: req.session.userId, // or get from session/token
    ...contentProfile
});
```

### 3. Link from Subscription Flow

After user subscribes to Content Engine ($47/mo):

```javascript
// In your success page or after Stripe checkout
if (subscriptionType === 'content-engine') {
    window.location.href = '/content-engine-setup.html';
}
```

## 📊 Data Structure

The form collects data in this structure:

```json
{
  "business": {
    "nameRole": "...",
    "description": "...",
    "services": "...",
    "results": "..."
  },
  "idealCustomer": {
    "profile": "...",
    "pains": "...",
    "goals": "...",
    "objections": "...",
    "triggers": "..."
  },
  "stories": {
    "customerStories": "...",
    "proudWins": "..."
  },
  "voice": {
    "positioning": "...",
    "words": "...",
    "examples": "..."
  },
  "sources": {
    "website": "...",
    "contentUrls": [...],
    "mediaUrls": [...]
  },
  "preferences": {
    "contentTypes": [...],
    "frequencyPerWeek": 3,
    "avoidTopics": "..."
  }
}
```

## 🚀 Next Steps

1. **Test the Form**
   - Open `content-engine-setup.html` in browser
   - Fill it out and test the flow
   - Verify data is sent to `/api/content-engine/setup`

2. **Add Database Storage**
   - Choose database (MongoDB, PostgreSQL, etc.)
   - Create `contentProfiles` table/collection
   - Update endpoint to save data

3. **Link to Subscription**
   - After Content Engine subscription, redirect to setup form
   - Store user ID with profile

4. **Build Content Generation**
   - Use this data + Grok API to generate posts
   - See `CONTENT_GENERATION_GUIDE.md` (to be created)

## 💡 Usage Flow

1. User subscribes to Content Engine ($47/mo)
2. Redirected to setup form
3. Completes 7-step questionnaire
4. Data saved to database
5. Backend uses data + Grok to generate personalized content
6. User receives content via email/dashboard

## 🎨 Customization

The form uses Tailwind CSS and matches your LinkedIn blue theme. To customize:

- Colors: Change `bg-linkedin-blue` to your brand color
- Steps: Add/remove steps by updating `totalSteps` variable
- Questions: Modify questions in each `step-content` div

## ✅ Features

- ✅ Multi-step navigation
- ✅ Progress indicator
- ✅ Form validation
- ✅ Responsive design
- ✅ Error handling
- ✅ Success message
- ✅ Ready for database integration

The form is production-ready and just needs database storage integration!









