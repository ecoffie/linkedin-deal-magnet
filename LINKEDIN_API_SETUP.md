# LinkedIn API Integration Guide

Complete guide to integrating LinkedIn's official API into your app.

## 🎯 Why Use LinkedIn API?

✅ **Legal & Compliant**: Official, supported by LinkedIn  
✅ **Reliable**: 99%+ success rate (vs 20-40% with scraping)  
✅ **Free Tier**: Available for basic profile data  
✅ **Structured Data**: Clean JSON responses  
✅ **No Rate Limits**: Reasonable limits, much better than scraping  

## 📋 Prerequisites

1. LinkedIn account (personal profile)
2. LinkedIn Developer account (free)
3. OAuth application setup
4. Basic understanding of OAuth flow

## 🚀 Step-by-Step Setup

### Step 1: Create LinkedIn Developer Account

1. Go to https://www.linkedin.com/developers/
2. Sign in with your LinkedIn account
3. Click **"Create app"**
4. Fill in the form:
   - **App name**: "LinkedIn Deal Magnet" (or your app name)
   - **LinkedIn Page**: Select your company page or create one
   - **Privacy policy URL**: Your website's privacy policy (required)
   - **App logo**: Upload your logo (optional but recommended)
   - **App usage**: Select "Marketing" or "Business"
5. Click **"Create app"**
6. Accept the API Terms of Use

### Step 2: Configure OAuth Settings

1. In your app dashboard, go to **"Auth"** tab
2. Under **"Redirect URLs"**, add:
   - `http://localhost:3000/auth/linkedin/callback` (for development)
   - `https://yourdomain.com/auth/linkedin/callback` (for production)
3. Click **"Update"** to save redirect URLs

### Step 2a: Request OAuth Product (Scopes are set automatically)

**Important**: LinkedIn now uses a "Products" system. You don't edit scopes directly - you request a Product that includes the scopes you need.

1. In your app dashboard, find the **"Products"** section (usually in left sidebar or main dashboard)
2. Look for **"Sign In with LinkedIn using OpenID Connect"**
3. Click **"Request"** or **"Request access"**
4. Fill out any required information (why you need access)
5. Submit the request (usually approved immediately or within 24 hours)

**Once approved**, the following scopes are automatically included:
- ✅ `profile` - Basic profile info (name, headline, picture)
- ✅ `email` - Email address (optional)
- ✅ `openid` - Required for OpenID Connect

**Note**: If you don't see a "Products" section, see `LINKEDIN_SCOPES_GUIDE.md` for alternative methods.

**Old method (if you see it)**: Under "OAuth 2.0 scopes", you would select scopes directly, but this is being phased out in favor of Products.

### Step 3: Get Your Credentials

In the **"Auth"** tab, you'll see:
- **Client ID**: Copy this (you'll need it)
- **Client Secret**: Copy this (keep it secret!)

Add these to your `.env` file:
```env
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback
```

### Step 4: Install Required Packages

```bash
npm install express-session passport passport-linkedin-oauth2
```

Or for newer LinkedIn OAuth (OpenID Connect):
```bash
npm install express-session passport passport-oauth2 openid-client
```

## 🔧 Implementation Options

### Option A: Simple OAuth Flow (Recommended for MVP)

Users authorize your app → You get access token → Fetch profile data

### Option B: LinkedIn Sign-In Button

Add LinkedIn's official sign-in button → Users authorize → Get profile

## 📊 LinkedIn API Products Available

### Free Tier (Most Relevant for You)

1. **Profile API** (v2)
   - Name, headline, profile picture
   - Location, summary
   - Skills, education
   - **Free**: Yes, with limits

2. **Basic Profile** (v1 - deprecated but still works)
   - Similar to Profile API
   - **Free**: Yes

### Limitations

- **Rate Limits**: ~5,000 requests/day (more than enough)
- **Data Access**: Only data user authorizes
- **User Consent Required**: Users must explicitly authorize
- **No Bulk Access**: One profile at a time (via user authorization)

## 🎯 Which API Version to Use?

### LinkedIn API v2 (Recommended)

- Modern, actively supported
- Uses OpenID Connect
- Better security
- More reliable

### LinkedIn API v1 (Legacy)

- Still works but deprecated
- Simpler setup
- Less secure

**Recommendation**: Use v2 for new implementations.

## ⚠️ Important Notes

1. **User Authorization Required**: Users must click "Authorize" to share their profile
2. **Token Expiration**: Access tokens expire (usually 60 days)
3. **Refresh Tokens**: Implement token refresh for long-term access
4. **Privacy**: Users control what data they share
5. **Verification**: May need LinkedIn verification for production (for some features)

## 💰 Pricing

**Good News**: Basic profile access is **FREE**!

- Profile data: Free
- Email address: Free  
- Basic company data: Free
- Advanced features: May require partnership

## 🔐 Security Best Practices

1. **Store secrets in environment variables** (never in code)
2. **Use HTTPS in production** (required for OAuth)
3. **Validate state parameter** (prevent CSRF attacks)
4. **Store tokens securely** (encrypted database or session)
5. **Implement token refresh** (don't request new auth every time)

## 📝 Next Steps

1. ✅ Create LinkedIn Developer account
2. ✅ Set up OAuth app
3. ✅ Get Client ID and Secret
4. ✅ Install packages
5. ✅ Implement OAuth flow (see implementation code)
6. ✅ Test with your own profile
7. ✅ Update UI to use "Connect with LinkedIn" button

## 🚫 What You CAN'T Do with API

- ❌ Access profiles without user authorization
- ❌ Scrape LinkedIn data in bulk
- ❌ Access profiles of users who haven't authorized
- ❌ Access private profile data
- ❌ Make requests without OAuth token

## ✅ What You CAN Do

- ✅ Access profile of users who authorize
- ✅ Get structured, reliable data
- ✅ Use profile data for recommendations
- ✅ Build a compliant, legal product
- ✅ Scale without worrying about bans

## 🎯 Implementation Decision

**For Your SaaS**: The LinkedIn API is ideal IF:
- ✅ You're okay with users authorizing access
- ✅ You want 99%+ reliability
- ✅ You want to be 100% compliant
- ✅ You want structured data

**Hybrid Approach** (Best):
1. Try LinkedIn API first (if user authorizes)
2. Fall back to scraping (if they don't want to authorize)
3. Use default recommendations (if both fail)

This gives you the best of all worlds!

