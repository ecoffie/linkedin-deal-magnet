/**
 * LinkedIn API Integration Example
 * This is an optional enhancement to add LinkedIn OAuth API support
 * 
 * To use this:
 * 1. Create LinkedIn Developer app (see LINKEDIN_API_SETUP.md)
 * 2. Install: npm install express-session passport passport-linkedin-oauth2
 * 3. Add credentials to .env
 * 4. Merge this code into your main server.js or use as reference
 */

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

// LinkedIn OAuth Configuration
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3000/auth/linkedin/callback';

// Configure Passport with LinkedIn Strategy
passport.use(new LinkedInStrategy({
    clientID: LINKEDIN_CLIENT_ID,
    clientSecret: LINKEDIN_CLIENT_SECRET,
    callbackURL: LINKEDIN_REDIRECT_URI,
    scope: ['r_liteprofile', 'r_emailaddress'],
    state: true
}, (accessToken, refreshToken, profile, done) => {
    // This is called after successful authorization
    // profile contains the user's LinkedIn data
    return done(null, { profile, accessToken, refreshToken });
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Helper function to fetch profile data from LinkedIn API
async function fetchLinkedInProfile(accessToken) {
    const axios = require('axios');
    
    try {
        // Fetch profile data using v2 API
        const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        // For v1 API (if v2 doesn't work)
        // const profileResponse = await axios.get('https://api.linkedin.com/v1/people/~:(id,firstName,lastName,headline,summary,location,industry,positions)', {
        //     headers: {
        //         'Authorization': `Bearer ${accessToken}`,
        //         'Content-Type': 'application/json'
        //     }
        // });

        return {
            name: `${profileResponse.data.given_name} ${profileResponse.data.family_name}`,
            headline: profileResponse.data.headline || '',
            about: profileResponse.data.summary || '',
            email: profileResponse.data.email || '',
            profilePicture: profileResponse.data.picture || '',
            location: profileResponse.data.locale || '',
            profileUrl: profileResponse.data.profile || '',
            // Additional fields from v2 API
            sub: profileResponse.data.sub, // LinkedIn user ID
        };
    } catch (error) {
        console.error('LinkedIn API Error:', error.response?.data || error.message);
        
        // Try v1 API as fallback
        try {
            const v1Response = await axios.get('https://api.linkedin.com/v1/people/~:(id,firstName,lastName,headline,summary,location)', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            return {
                name: `${v1Response.data.firstName} ${v1Response.data.lastName}`,
                headline: v1Response.data.headline || '',
                about: v1Response.data.summary || '',
                location: v1Response.data.location?.name || '',
            };
        } catch (v1Error) {
            throw new Error('Failed to fetch profile from LinkedIn API');
        }
    }
}

// Routes for LinkedIn OAuth
function setupLinkedInRoutes(app) {
    // Initialize session middleware
    app.use(session({
        secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production' }
    }));

    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Start LinkedIn OAuth flow
    app.get('/auth/linkedin', passport.authenticate('linkedin', {
        state: true
    }));

    // LinkedIn OAuth callback
    app.get('/auth/linkedin/callback',
        passport.authenticate('linkedin', { failureRedirect: '/' }),
        async (req, res) => {
            // User has authorized, now fetch their profile
            try {
                const profileData = await fetchLinkedInProfile(req.user.accessToken);
                
                // Store profile data in session or return to frontend
                req.session.linkedinProfile = profileData;
                
                // Redirect to audit results page or return JSON
                res.redirect(`/audit-results?source=linkedin-api&success=true`);
                
                // Or return JSON for API usage:
                // res.json({
                //     success: true,
                //     profile: profileData,
                //     message: 'Profile data retrieved successfully'
                // });
            } catch (error) {
                console.error('Error fetching profile:', error);
                res.redirect('/?error=profile_fetch_failed');
            }
        }
    );

    // API endpoint to get profile data from session
    app.get('/api/linkedin-profile', (req, res) => {
        if (req.session.linkedinProfile) {
            res.json(req.session.linkedinProfile);
        } else {
            res.status(401).json({ error: 'No LinkedIn profile data found. Please authorize first.' });
        }
    });

    // Logout / Clear session
    app.get('/auth/logout', (req, res) => {
        req.logout();
        req.session.destroy();
        res.redirect('/');
    });
}

// Alternative: Simple API endpoint that triggers OAuth flow
app.get('/api/auth/linkedin', (req, res) => {
    // Redirect to LinkedIn OAuth
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}&state=random_state_string&scope=r_liteprofile%20r_emailaddress`;
    res.json({ authUrl });
});

module.exports = {
    setupLinkedInRoutes,
    fetchLinkedInProfile
};









