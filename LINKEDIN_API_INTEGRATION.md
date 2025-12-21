# LinkedIn API Integration - Quick Implementation Guide

This guide shows you how to add LinkedIn API support to your existing app.

## 🎯 Integration Strategy

**Recommended Hybrid Approach:**
1. Offer LinkedIn API as primary method (users authorize)
2. Keep scraping as fallback (for users who don't want to authorize)
3. Use default recommendations if both fail

## 📦 Step 1: Install Dependencies

```bash
npm install express-session passport passport-linkedin-oauth2
```

## 🔑 Step 2: Add Environment Variables

Add to your `.env` file:

```env
# LinkedIn API OAuth
LINKEDIN_CLIENT_ID=your_client_id_from_linkedin_dev_portal
LINKEDIN_CLIENT_SECRET=your_client_secret_from_linkedin_dev_portal
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback
SESSION_SECRET=your-random-secret-key-for-sessions
```

## 🔧 Step 3: Update server.js

Add this to your `server.js`:

```javascript
// At the top with other requires
const session = require('express-session');
const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

// After other middleware, before routes
app.use(session({
    secret: process.env.SESSION_SECRET || 'change-this-in-production',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// LinkedIn OAuth Strategy
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    passport.use(new LinkedInStrategy({
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: process.env.LINKEDIN_REDIRECT_URI,
        scope: ['r_liteprofile', 'r_emailaddress'],
        state: true
    }, async (accessToken, refreshToken, profile, done) => {
        // Store access token for later API calls
        return done(null, { profile, accessToken, refreshToken });
    }));

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    // OAuth Routes
    app.get('/auth/linkedin', passport.authenticate('linkedin'));

    app.get('/auth/linkedin/callback',
        passport.authenticate('linkedin', { failureRedirect: '/?error=auth_failed' }),
        async (req, res) => {
            // Fetch full profile data
            try {
                const profileData = await fetchLinkedInProfileAPI(req.user.accessToken);
                // Store in session or process immediately
                req.session.linkedinProfile = profileData;
                res.redirect(`/?linkedin_auth=success&profile_id=${profileData.id}`);
            } catch (error) {
                console.error('LinkedIn API error:', error);
                res.redirect('/?error=api_failed');
            }
        }
    );
}

// Helper function to fetch profile from LinkedIn API
async function fetchLinkedInProfileAPI(accessToken) {
    try {
        // Try v2 API first (OpenID Connect)
        const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return {
            name: `${response.data.given_name} ${response.data.family_name}`,
            headline: response.data.headline || '',
            about: response.data.summary || '',
            email: response.data.email || '',
            profileUrl: response.data.profile || '',
            apiSource: 'linkedin-api-v2'
        };
    } catch (error) {
        // Fallback to v1 API
        const v1Response = await axios.get('https://api.linkedin.com/v1/people/~:(id,firstName,lastName,headline,summary)', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return {
            name: `${v1Response.data.firstName} ${v1Response.data.lastName}`,
            headline: v1Response.data.headline || '',
            about: v1Response.data.summary || '',
            apiSource: 'linkedin-api-v1'
        };
    }
}
```

## 🎨 Step 4: Update Frontend (index.html)

Add a "Connect with LinkedIn" button:

```html
<!-- In your audit form section -->
<div class="mb-4">
    <button 
        type="button"
        onclick="connectWithLinkedIn()"
        class="bg-linkedin-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-linkedin-dark transition flex items-center gap-2"
    >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        Connect with LinkedIn (Recommended)
    </button>
    <p class="text-sm text-gray-600 mt-2">
        Get more accurate recommendations by connecting your LinkedIn account
    </p>
</div>

<div class="text-center text-gray-500 my-4">OR</div>
```

Add JavaScript:

```javascript
// In script.js
function connectWithLinkedIn() {
    // Redirect to LinkedIn OAuth
    window.location.href = '/auth/linkedin';
}

// Check if user just authorized
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('linkedin_auth') === 'success') {
        // Fetch profile data and run audit
        fetch('/api/linkedin-profile')
            .then(res => res.json())
            .then(profileData => {
                // Run audit with API data
                runAuditWithData(profileData);
            })
            .catch(err => {
                console.error('Error fetching LinkedIn profile:', err);
            });
    }
});

async function runAuditWithData(profileData) {
    // Send profile data to audit endpoint
    const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            source: 'linkedin-api',
            profileData: profileData 
        })
    });
    
    const data = await response.json();
    displayResults(data);
}
```

## 🔄 Step 5: Update Audit Endpoint

Modify your `/api/audit` endpoint to accept API data:

```javascript
app.post('/api/audit', async (req, res) => {
    try {
        let profileData;

        // Check if data came from LinkedIn API
        if (req.body.source === 'linkedin-api' && req.body.profileData) {
            profileData = req.body.profileData;
            console.log('Using LinkedIn API data');
        } else {
            // Fallback to scraping
            const { url } = req.body;
            if (!url || !url.includes('linkedin.com')) {
                return res.status(400).json({ error: 'Invalid LinkedIn URL' });
            }
            profileData = await scrapeLinkedInProfile(url);
        }

        // Analyze with Grok (same as before)
        const analysis = await analyzeWithGrok(profileData);

        res.json({
            score: analysis.score,
            currentHeadline: profileData.headline,
            aiHeadline: analysis.aiHeadline,
            fixes: analysis.fixes,
            source: profileData.apiSource || 'scraping',
            sessionId: Date.now().toString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to analyze profile' });
    }
});
```

## ✅ Testing Checklist

1. [ ] Create LinkedIn Developer app
2. [ ] Get Client ID and Secret
3. [ ] Add to `.env` file
4. [ ] Install npm packages
5. [ ] Update server.js with OAuth code
6. [ ] Update frontend with "Connect" button
7. [ ] Test OAuth flow locally
8. [ ] Verify profile data is retrieved
9. [ ] Test audit with API data
10. [ ] Test fallback to scraping still works

## 🎯 User Flow

### Option A: LinkedIn API (Recommended)
1. User clicks "Connect with LinkedIn"
2. Redirects to LinkedIn authorization
3. User authorizes your app
4. Redirects back with profile data
5. Run audit with API data ✅

### Option B: URL Input (Fallback)
1. User pastes LinkedIn URL
2. System attempts to scrape
3. If successful: Run audit ✅
4. If fails: Use default recommendations ✅

## 📊 Benefits of This Approach

- ✅ **99%+ Success Rate**: LinkedIn API is reliable
- ✅ **Legal Compliance**: Official, supported method
- ✅ **Better Data**: Structured, complete profile data
- ✅ **User Choice**: Users can choose API or URL method
- ✅ **Graceful Fallback**: Still works if user doesn't authorize
- ✅ **Best of Both Worlds**: API when possible, scraping as backup

## ⚠️ Important Notes

1. **User Authorization Required**: Users must click "Authorize" - this is mandatory
2. **HTTPS Required**: In production, you MUST use HTTPS (LinkedIn requires it)
3. **Token Management**: Access tokens expire (usually 60 days) - implement refresh
4. **Privacy**: Users control what data they share
5. **Rate Limits**: ~5,000 requests/day (plenty for your use case)

## 🚀 Going Live

1. **Update Redirect URI**: Change to production URL
2. **Enable HTTPS**: LinkedIn requires HTTPS for production
3. **Update Environment Variables**: Use production values
4. **Test Thoroughly**: Test OAuth flow end-to-end
5. **Add Error Handling**: Handle authorization rejections gracefully

## 💡 Pro Tips

1. **Make API Primary**: Position "Connect with LinkedIn" as the recommended option
2. **Explain Benefits**: Tell users API gives more accurate results
3. **Keep URL Option**: Some users prefer not to authorize - keep both options
4. **Session Management**: Store tokens securely, implement refresh
5. **Error Messages**: Clear messages if authorization fails

---

**Next Steps**: Follow the setup guide in `LINKEDIN_API_SETUP.md` to create your LinkedIn Developer app, then implement this integration!









