# LinkedIn API - Quick Start

Want to use LinkedIn's official API instead of scraping? Here's the fastest way to get started.

## 🚀 5-Minute Setup

### 1. Create LinkedIn Developer App (2 minutes)
1. Go to https://www.linkedin.com/developers/
2. Click "Create app"
3. Fill in basic info (name, privacy policy URL)
4. Get your **Client ID** and **Client Secret**

### 2. Add to .env (30 seconds)
```env
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_secret_here
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback
```

### 3. Install Package (1 minute)
```bash
npm install express-session passport passport-linkedin-oauth2
```

### 4. Follow Integration Guide (2 minutes)
See `LINKEDIN_API_INTEGRATION.md` for complete code to add to your server.

## ✅ Benefits

- **99%+ Success Rate** (vs 20-40% scraping)
- **100% Legal** (official API)
- **Free** (basic profile access)
- **Better Data** (structured JSON)

## 📚 Full Documentation

- **Setup Guide**: `LINKEDIN_API_SETUP.md` - Complete setup instructions
- **Integration Guide**: `LINKEDIN_API_INTEGRATION.md` - Code implementation
- **Reference**: `linkedin-api-server.js` - Example code

## 🎯 Recommendation

**Hybrid Approach** (Best):
1. Offer LinkedIn API as primary option
2. Keep URL scraping as fallback
3. Use defaults if both fail

This gives you maximum reliability and user choice!









