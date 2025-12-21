# LinkedIn OAuth Scopes - Where to Find and Edit Them

If you can't find the OAuth 2.0 scopes edit section, here's how to locate it in LinkedIn's developer portal.

## 🔍 Finding OAuth Scopes in LinkedIn Developer Portal

### Method 1: Auth Tab (Most Common Location)

1. Go to https://www.linkedin.com/developers/
2. Select your app
3. Click on **"Auth"** tab at the top
4. Look for **"OAuth 2.0 scopes"** or **"Products"** section

**Note**: LinkedIn's interface has changed. Scopes are now often tied to **Products** rather than a simple list.

---

### Method 2: Products Section (New LinkedIn Interface)

LinkedIn now uses a "Products" system instead of direct scope selection:

1. Go to your app in https://www.linkedin.com/developers/
2. Look for **"Products"** tab or section
3. You'll see available products like:
   - **Sign In with LinkedIn using OpenID Connect** (Recommended - this is what you want)
   - **Share on LinkedIn**
   - **Marketing Developer Platform**
   - etc.

4. Click **"Request access"** or **"Request"** for:
   - **"Sign In with LinkedIn using OpenID Connect"** (This gives you profile access)

---

### Method 3: Check if Scopes Are Pre-Set by Products

When you select a Product (like "Sign In with LinkedIn"), the scopes are automatically included. You may not need to edit them manually.

**For "Sign In with LinkedIn using OpenID Connect" product:**
- Automatically includes: `profile`, `email`, `openid`
- These are the scopes you need!

---

## ✅ What You Actually Need

For your LinkedIn Deal Magnet app, you need:

**Product**: **"Sign In with LinkedIn using OpenID Connect"**

This product automatically includes:
- `profile` - Access to basic profile information
- `email` - Access to email address (optional)
- `openid` - Required for OpenID Connect

**These are exactly what you need!** No manual scope editing required.

---

## 🎯 Step-by-Step: Using Products (Recommended)

1. **Go to your app**: https://www.linkedin.com/developers/apps

2. **Click on your app**

3. **Find "Products" section** (usually on the left sidebar or main dashboard)

4. **Look for "Sign In with LinkedIn using OpenID Connect"**

5. **Click "Request"** or **"Request access"**

6. **Fill out any required information** (they may ask why you need it)

7. **Submit request** - Usually approved immediately or within 24 hours

8. **Once approved**, the product is active and scopes are automatically configured

---

## 🔧 Alternative: Check Auth Tab for Scopes

If you still see an "Auth" tab:

1. Click **"Auth"** tab
2. Scroll down to **"OAuth 2.0 scopes"** or **"Requested permissions"**
3. You may see scopes already listed if you've requested a product
4. If there's an **"Edit"** or **"Request permissions"** button, click it

---

## 📋 What Scopes Do You Need?

For basic profile access (what you need for LinkedIn Deal Magnet):

**Required:**
- ✅ `profile` - Basic profile info (name, headline, picture)
- ✅ `openid` - Required for OpenID Connect

**Optional but Recommended:**
- ✅ `email` - Email address

**Old API (if using v1 - deprecated):**
- ❌ `r_liteprofile` - Old scope, being phased out
- ❌ `r_basicprofile` - Old scope, being phased out

---

## 🚨 Common Issues

### Issue 1: "I don't see scopes option"

**Solution**: LinkedIn uses Products now. You don't edit scopes directly - you request Products that include the scopes you need.

### Issue 2: "Products section shows no available products"

**Solution**: 
- Make sure your app is fully created
- Check if you need to verify your LinkedIn account
- Try refreshing the page
- Some products may require verification

### Issue 3: "I see products but don't know which one"

**Solution**: Use **"Sign In with LinkedIn using OpenID Connect"** - this is the modern way to get profile data.

---

## ✅ Verification: How to Check Your Scopes

Once you've requested the product:

1. Go to **"Auth"** tab
2. Look at your **Redirect URLs** section
3. Below that, you should see **"OAuth 2.0 scopes"** or **"Requested permissions"**
4. You should see: `profile`, `email`, `openid` listed

If you see these, you're all set!

---

## 🔄 If You Still Can't Find It

### Option 1: Contact LinkedIn Developer Support
- Go to: https://www.linkedin.com/help/linkedin
- Select "Developer Program"
- Ask about OAuth scopes for your app

### Option 2: Use Default Scopes
- Some apps get default scopes automatically
- Try using the API - if it works, you have the right scopes

### Option 3: Start with Basic Product Request
- Request the "Sign In with LinkedIn" product
- Test if it works
- The scopes will be automatically configured

---

## 💡 Pro Tip

**LinkedIn's interface changes frequently.** The current standard is:

1. **Request Products** (not edit scopes directly)
2. **"Sign In with LinkedIn using OpenID Connect"** = the product you need
3. **Scopes are automatically included** when product is approved

---

## 📝 Updated Setup Instructions

Here's the simplified process:

1. ✅ Create app (done)
2. ✅ Set redirect URLs (done)
3. ✅ Request "Sign In with LinkedIn using OpenID Connect" product
4. ✅ Wait for approval (usually instant)
5. ✅ Use Client ID and Secret in your app
6. ✅ Scopes are automatically configured: `profile`, `email`, `openid`

**You don't need to manually edit scopes anymore!**

---

## 🎯 Quick Check: Do You Have the Right Access?

To verify you have the right scopes:

1. Go to Auth tab
2. Look for any section mentioning "scopes", "permissions", or "products"
3. If you see `profile` or `openid` mentioned, you're good
4. If not, request the "Sign In with LinkedIn using OpenID Connect" product

**Bottom line**: If you can't edit scopes, that's normal! Request the Product instead, and scopes will be automatically configured. 🚀









