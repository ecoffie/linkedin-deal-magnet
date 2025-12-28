require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;

// Knowledge base path
const KB_PATH = path.join(__dirname, 'bootcamp', 'agencies');
const KB_INDEX_PATH = path.join(KB_PATH, 'index.json');
const VIRAL_HOOKS_PATH = path.join(__dirname, 'bootcamp', 'viral-hooks.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// LinkedIn OAuth Configuration
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3000/auth/linkedin/callback';

// Configure LinkedIn OAuth2 Strategy
passport.use('linkedin', new OAuth2Strategy({
    authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
    clientID: LINKEDIN_CLIENT_ID,
    clientSecret: LINKEDIN_CLIENT_SECRET,
    callbackURL: LINKEDIN_REDIRECT_URI,
    scope: ['openid', 'profile', 'email'],
    state: true
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Fetch user profile with access token
        const userProfile = await fetchLinkedInProfile(accessToken);

        // Attach access token to profile for later use
        userProfile.accessToken = accessToken;

        return done(null, userProfile);
    } catch (error) {
        return done(error, null);
    }
}));

// Fetch LinkedIn profile data
async function fetchLinkedInProfile(accessToken) {
    try {
        // Get basic profile info
        const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const profile = {
            id: profileResponse.data.sub,
            name: profileResponse.data.name,
            email: profileResponse.data.email,
            picture: profileResponse.data.picture,
            headline: profileResponse.data.locale || ''
        };

        // Try to get posts (this requires different scopes and endpoints)
        // For MVP, we'll start with basic profile
        profile.posts = [];

        return profile;
    } catch (error) {
        console.error('Error fetching LinkedIn profile:', error.message);
        throw error;
    }
}

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// LinkedIn OAuth Routes
app.get('/auth/linkedin', passport.authenticate('linkedin'));

app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/onboarding?error=auth_failed' }),
    (req, res) => {
        // Successful authentication
        // Store LinkedIn data in session
        req.session.linkedinProfile = req.user;

        // Redirect back to onboarding with success flag
        res.redirect('/onboarding?linkedin_connected=true');
    }
);

// Get LinkedIn profile data (for onboarding step 1)
app.get('/api/linkedin/profile', (req, res) => {
    if (!req.session.linkedinProfile) {
        return res.status(401).json({
            success: false,
            error: 'Not authenticated with LinkedIn'
        });
    }

    res.json({
        success: true,
        profile: req.session.linkedinProfile
    });
});

// Logout/disconnect LinkedIn
app.post('/api/linkedin/disconnect', (req, res) => {
    req.session.linkedinProfile = null;
    res.json({ success: true, message: 'LinkedIn disconnected' });
});

// Serve the Onboarding page
app.get('/onboarding', (req, res) => {
    res.sendFile(path.join(__dirname, 'onboarding.html'));
});

// Serve the Opportunity Scout page
app.get('/opportunity-scout', (req, res) => {
    res.sendFile(path.join(__dirname, 'content-engine-test.html'));
});

// Serve the Target Market Report page
app.get('/target-market-report', (req, res) => {
    res.sendFile(path.join(__dirname, 'target-market-report.html'));
});

// Serve the Comprehensive Market Report page (8 report types)
app.get('/comprehensive-market-report', (req, res) => {
    res.sendFile(path.join(__dirname, 'comprehensive-market-report.html'));
});

// Serve the Content Generator page
app.get('/content-generator', (req, res) => {
    res.sendFile(path.join(__dirname, 'content-generator.html'));
});

// Get available post templates
app.get('/api/content-generator/templates', (req, res) => {
    const templatesList = Object.entries(POST_TEMPLATES).map(([key, template]) => ({
        key: key,
        name: template.name,
        description: template.description
    }));
    res.json({ success: true, templates: templatesList });
});

// Legacy route redirect for backwards compatibility
app.get('/contract-finder', (req, res) => {
    res.redirect(301, '/opportunity-scout');
});

// In-memory user data storage (for MVP - replace with database later)
const usersData = new Map();

// Post Template Definitions
const POST_TEMPLATES = {
    'story-driven': {
        name: 'Story-Driven',
        description: 'Personal narrative connecting your experience to agency challenges',
        prompt: `Write a story-based LinkedIn post that:
- Opens with a relatable scenario or personal anecdote
- Connects to the agency pain point naturally
- Shows empathy and understanding
- Transitions to how your solution helps
- Ends with a thought-provoking question or call-to-action
- Uses conversational, authentic tone
- 200-300 words`
    },
    'stat-heavy': {
        name: 'Data-Driven',
        description: 'Statistics-focused post with hard numbers and sources',
        prompt: `Write a data-heavy LinkedIn post that:
- Opens with a striking statistic
- Lists 3-4 key data points with sources
- Uses bullet points for scannability
- Cites authoritative sources (GAO, agency reports)
- Connects numbers to real-world impact
- Ends with how your capabilities address the data
- Professional, authoritative tone
- 150-250 words`
    },
    'question-based': {
        name: 'Question-Based',
        description: 'Starts with provocative question (GEO optimized)',
        prompt: `Write a question-based LinkedIn post that:
- Opens with a thought-provoking question related to the pain point
- Provides 2-3 insights that answer the question
- Uses "What if..." or "Why do..." or "How can..." format
- Optimized for AI search engines (clear Q&A structure)
- Includes supporting statistics
- Ends with a call to discuss or share thoughts
- Engaging, conversational tone
- 150-200 words`
    },
    'case-study': {
        name: 'Case Study',
        description: 'Problem → Solution → Result format',
        prompt: `Write a case study-style LinkedIn post that:
- Problem: Describe the agency's specific challenge
- Solution: Explain your approach or capability
- Result: Share expected outcomes or impact
- Uses clear section headers or emojis (📌 Problem, ✅ Solution, 🎯 Impact)
- Includes relevant statistics
- Shows concrete value proposition
- Professional, results-oriented tone
- 200-250 words`
    },
    'thought-leadership': {
        name: 'Thought Leadership',
        description: 'Industry insight with forward-looking perspective',
        prompt: `Write a thought leadership LinkedIn post that:
- Provides unique industry perspective on the pain point
- Discusses trends and future implications
- Positions you as an expert/advisor
- References current events or recent reports
- Offers actionable insights
- Avoids sales pitch, focuses on value
- Ends with invitation to connect or discuss
- Authoritative, visionary tone
- 250-300 words`
    },
    'list-tips': {
        name: 'List/Tips',
        description: 'Numbered insights or actionable recommendations',
        prompt: `Write a list-based LinkedIn post that:
- Opens with context for why this matters
- Provides 3-5 numbered tips or insights
- Each point is actionable and specific
- Relates to agency pain points and priorities
- Includes mini-statistics within tips
- Easy to scan and share
- Ends with "Which resonates with you?" or similar
- Clear, helpful tone
- 200-250 words`
    },
    'contrarian': {
        name: 'Contrarian Take',
        description: 'Challenges common assumptions with fresh perspective',
        prompt: `Write a contrarian LinkedIn post that:
- Starts by challenging a common belief or approach
- Uses "Everyone says X, but..." or "Unpopular opinion:" format
- Backs up the contrarian view with data
- Shows alternative perspective on agency challenges
- Remains respectful and professional
- Sparks discussion and engagement
- Ends with "Change my mind" or "Agree or disagree?"
- Bold, confident tone
- 150-250 words`
    },
    'actionable': {
        name: 'Actionable How-To',
        description: 'Step-by-step guide showing how to do something specific',
        prompt: `Write an actionable how-to LinkedIn post that:
- Opens with the problem or goal ("Want to win more government contracts?")
- Provides 3-5 clear, numbered steps
- Each step is concrete and implementable
- Relates steps to agency pain points and opportunities
- Includes mini-tips or warnings within steps
- Uses action verbs (Start, Create, Build, Submit, etc.)
- Ends with encouragement to take action
- Helpful, empowering tone
- 200-300 words`
    },
    'motivational': {
        name: 'Motivational Story',
        description: 'Inspire action through personal story or anecdote',
        prompt: `Write a motivational LinkedIn post that:
- Opens with a relatable challenge or setback
- Tells a short story with a turning point
- Connects to broader lesson about government contracting
- Shows vulnerability and authenticity
- Relates to agency challenges or opportunities
- Builds to an inspiring conclusion
- Ends with call to action or encouragement
- Warm, authentic, uplifting tone
- 250-300 words`
    },
    'analytical': {
        name: 'Analytical Teardown',
        description: 'Deep analysis of a company, trend, or strategy',
        prompt: `Write an analytical teardown LinkedIn post that:
- Opens with what you're analyzing (agency strategy, contract type, etc.)
- Breaks down 3-4 key components or observations
- Provides critical but fair analysis
- Backs up analysis with data and examples
- Explains what others can learn from it
- Uses clear section structure or bullet points
- Ends with key takeaway or lesson
- Thoughtful, analytical, educational tone
- 250-300 words`
    },
    'contrarian-v2': {
        name: 'Contrarian Opinion',
        description: 'Share unpopular opinion different from status quo',
        prompt: `Write a contrarian opinion LinkedIn post that:
- Opens with "Unpopular opinion:" or "Hot take:"
- States a belief that goes against common wisdom
- Explains why you think differently with evidence
- Addresses counterarguments respectfully
- Relates to government contracting challenges
- Backs up with data or experience
- Invites thoughtful debate
- Confident but open-minded tone
- 200-250 words`
    },
    'observation': {
        name: 'Observation & Insight',
        description: 'Share something interesting you\'ve noticed',
        prompt: `Write an observation-based LinkedIn post that:
- Opens with "I've noticed something interesting..."
- Describes a trend, pattern, or phenomenon you've observed
- Provides 2-3 specific examples
- Explains why this matters for government contractors
- Relates to agency behaviors or market trends
- Connects to broader implications
- Ends with question or food for thought
- Observant, curious, insightful tone
- 200-250 words`
    },
    'x-vs-y': {
        name: 'X vs. Y Comparison',
        description: 'Compare two situations for interesting insights',
        prompt: `Write a comparison LinkedIn post that:
- Opens by setting up the comparison (X vs. Y)
- Uses side-by-side structure or clear sections
- Compares 3-4 key differences or similarities
- Provides unexpected insights from the comparison
- Relates to agency contracting or business strategies
- Uses specific examples for each side
- Ends with which is better or key lesson
- Analytical, balanced, insightful tone
- 250-300 words`
    },
    'present-future': {
        name: 'Present vs. Future',
        description: 'Contrast current state with future predictions',
        prompt: `Write a present vs. future LinkedIn post that:
- Opens with "Here's how things work today..."
- Describes current state of agency contracting/challenges
- Transitions to "But here's where we're heading..."
- Paints vision of future (next 1-3 years)
- Explains forces driving the change
- Includes implications for contractors
- Ends with how to prepare or adapt
- Forward-thinking, visionary tone
- 250-300 words`
    },
    'listicle': {
        name: 'Listicle (Use Sparingly)',
        description: 'Curated list of resources, tools, or recommendations',
        prompt: `Write a listicle LinkedIn post that:
- Opens with context for the list
- Provides 3-7 items in numbered format
- Each item has brief but specific description
- Items are genuinely valuable and relevant
- Relates to government contracting resources
- Avoids generic or overly promotional content
- Ends with invitation to share others
- Helpful, generous, curated tone
- 200-250 words
- NOTE: Use sparingly - these are often less engaging`
    }
};

// Content Generator API: 3-Step Prompt Chain with Template System
app.post('/api/content-generator/generate', async (req, res) => {
    try {
        const { userId, targetAgencies, numPosts = 3, geoBoost = true, templates = [] } = req.body;

        console.log(`[Content Generator] Request for user: ${userId}`);

        // Get user data
        let userData = usersData.get(userId);

        // Fallback to localStorage data if not in server memory
        if (!userData && req.body.userData) {
            userData = req.body.userData;
        }

        if (!userData) {
            return res.status(404).json({
                success: false,
                error: 'User data not found. Please complete onboarding first.'
            });
        }

        // STEP 1: Identify agency pain points
        console.log('[Step 1] Identifying agency pain points...');

        const agencyPainPoints = [];
        for (const agencyName of targetAgencies) {
            try {
                const indexPath = path.join(__dirname, 'bootcamp', 'agencies', 'index.json');
                const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

                let agencyFile = null;
                for (const [key, value] of Object.entries(indexData.agencies)) {
                    if (key.toLowerCase() === agencyName.toLowerCase() ||
                        value.aliases?.some(alias => alias.toLowerCase() === agencyName.toLowerCase())) {
                        agencyFile = value.file;
                        break;
                    }
                }

                if (agencyFile) {
                    const agencyPath = path.join(__dirname, 'bootcamp', 'agencies', agencyFile);
                    const agencyData = JSON.parse(fs.readFileSync(agencyPath, 'utf8'));
                    agencyPainPoints.push({
                        agency: agencyData.name,
                        painPoints: agencyData.painPoints || [],
                        strategicPriorities: agencyData.strategicPriorities || [],
                        insights: agencyData.insights || []
                    });
                }
            } catch (error) {
                console.error(`Error loading agency ${agencyName}:`, error.message);
            }
        }

        // STEP 2: Inject stats/sources + GEO techniques
        console.log('[Step 2] Injecting stats and GEO optimization...');
        const viralHooksFormatted = formatViralHooksForPrompt('general', 10);

        const step2Prompt = `You are a government contracting expert creating LinkedIn content.

AGENCY PAIN POINTS & PRIORITIES:
${agencyPainPoints.map(ap => `
${ap.agency}:
Pain Points:
${ap.painPoints.slice(0, 5).map(p => `- ${p.point} (Source: ${p.source}) [${p.priority}]`).join('\n')}

Strategic Priorities:
${ap.strategicPriorities.slice(0, 3).map(sp => `- ${sp.priority} ${sp.funding ? `(${sp.funding})` : ''}`).join('\n')}

Market Insights:
${ap.insights.slice(0, 3).map(i => `- ${i}`).join('\n')}
`).join('\n---\n')}

USER CAPABILITIES:
- NAICS Codes: ${userData.company?.naicsCodes?.join(', ')}
- Certifications: ${userData.company?.certifications?.join(', ')}
- Capabilities: ${userData.company?.capabilitiesStatement?.substring(0, 500)}

${viralHooksFormatted}

TASK: Create content angles that:
1. Connect the user's capabilities to specific agency pain points
2. Include exact statistics and sources from the pain points
3. Use authoritative language ("According to GAO...", "DoD reports...", etc.)
4. Structure information clearly with bullet points or numbered lists
${geoBoost ? `5. Optimize for AI/search with clear questions and answers (GEO technique)` : ''}

Generate ${numPosts} distinct content angles. For each angle, provide:
- Main theme/hook (use viral hook patterns from above as inspiration - adapt them naturally to fit the pain point and capability)
- Key pain point to address
- 2-3 relevant statistics with sources
- How the user's certification/capability solves this
- Suggested structure (question format, list format, story format, etc.)

Output as JSON array with this structure:
[
  {
    "angle": "theme description",
    "painPoint": "specific pain point",
    "stats": ["stat 1 with source", "stat 2 with source"],
    "solution": "how user helps",
    "structure": "suggested format"
  }
]`;

        const contentAngles = await callGrokAPI(step2Prompt);
        let angles;
        try {
            // Extract JSON from response
            const jsonMatch = contentAngles.match(/\[[\s\S]*\]/);
            angles = JSON.parse(jsonMatch ? jsonMatch[0] : contentAngles);
        } catch (error) {
            console.error('Failed to parse angles JSON, using fallback');
            angles = [{
                angle: "Agency modernization challenges",
                painPoint: agencyPainPoints[0]?.painPoints[0]?.point || "General agency pain point",
                stats: ["Referenced from agency data"],
                solution: "Our expertise addresses this need",
                structure: "list format"
            }];
        }

        // STEP 3: Write in user's voice with templates
        console.log('[Step 3] Writing in user\'s voice with templates...');

        const userPosts = userData.linkedinData?.posts || [];
        const voiceAnalysis = userPosts.length > 0
            ? `ANALYZE THIS USER'S WRITING VOICE from their past posts:\n${userPosts.slice(0, 10).map(p => p.text || p).join('\n---\n')}\n\n`
            : '';

        // Determine which templates to use
        let templatesToUse = templates.length > 0 ? templates : ['actionable', 'observation', 'x-vs-y'];

        // If user wants more posts than templates, cycle through templates
        if (numPosts > templatesToUse.length) {
            const originalTemplates = [...templatesToUse];
            while (templatesToUse.length < numPosts) {
                templatesToUse.push(...originalTemplates);
            }
        }
        templatesToUse = templatesToUse.slice(0, numPosts);

        const posts = [];
        for (let i = 0; i < angles.slice(0, numPosts).length; i++) {
            const angle = angles[i];
            const templateKey = templatesToUse[i] || 'question-based';
            const template = POST_TEMPLATES[templateKey];

            const viralHooksForStep3 = formatViralHooksForPrompt('general', 8);
            const step3Prompt = `${voiceAnalysis}Write a LinkedIn post as ${userData.linkedinData?.name || 'a government contractor'}.

CONTENT ANGLE:
Theme: ${angle.angle}
Pain Point: ${angle.painPoint}
Statistics: ${angle.stats.join('; ')}
Solution: ${angle.solution}

TEMPLATE STYLE: ${template.name}
${template.prompt}

${viralHooksForStep3}

ADDITIONAL REQUIREMENTS:
${voiceAnalysis ? '- Match the writing style, tone, and voice from the sample posts above' : '- Use a professional, conversational tone'}
- Include specific statistics with sources from the pain point data
- Use line breaks for readability
- Start with a COMPELLING HOOK that captures attention (use the viral hook patterns above as inspiration - adapt them naturally, don't use formulaically)
- The hook should be the FIRST LINE and must be engaging and attention-grabbing
${geoBoost && templateKey !== 'question-based' ? '- Optimize for AI search with clear structure and authoritative sources' : ''}
- End with a clear call-to-action or engagement prompt
- Include 3-5 relevant hashtags at the end

Output ONLY the post text, followed by hashtags on separate lines.`;

            const postContent = await callGrokAPI(step3Prompt);

            // Extract hashtags
            const hashtagMatch = postContent.match(/#[\w]+/g);
            const hashtags = hashtagMatch || [];
            const postText = postContent.replace(/#[\w]+/g, '').trim();

            posts.push({
                angle: angle.angle,
                template: template.name,
                templateKey: templateKey,
                content: postText,
                hashtags: hashtags,
                painPointAddressed: angle.painPoint,
                stats: angle.stats
            });
        }

        console.log(`✅ Generated ${posts.length} posts`);

        res.json({
            success: true,
            posts: posts,
            metadata: {
                targetAgencies: targetAgencies,
                userCertifications: userData.company?.certifications || [],
                geoOptimized: geoBoost
            }
        });

    } catch (error) {
        console.error('[Content Generator] Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate content'
        });
    }
});

// Onboarding API: Save user data
app.post('/api/onboarding/save', (req, res) => {
    try {
        const { linkedin, company } = req.body;

        if (!linkedin || !company) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: linkedin and company data'
            });
        }

        // Generate a simple user ID (in production, use proper UUID)
        const userId = linkedin.email || `user_${Date.now()}`;

        // Store user data
        const userData = {
            userId,
            linkedinId: linkedin.id || userId,
            linkedinData: {
                name: linkedin.name,
                email: linkedin.email,
                headline: linkedin.headline,
                posts: linkedin.posts || []
            },
            company: {
                naicsCodes: company.naicsCodes || [],
                certifications: company.certifications || [],
                pastAgencies: company.agencies || [],
                capabilitiesStatement: company.capabilitiesStatement || '',
                otherCertifications: company.otherCertifications || ''
            },
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            onboardingComplete: true
        };

        usersData.set(userId, userData);

        console.log(`[Onboarding] User data saved for: ${userId}`);

        res.json({
            success: true,
            userId,
            message: 'User data saved successfully'
        });

    } catch (error) {
        console.error('[Onboarding] Error saving user data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save user data'
        });
    }
});

// Onboarding API: Get user data
app.get('/api/onboarding/user/:userId', (req, res) => {
    try {
        const { userId } = req.params;

        if (!usersData.has(userId)) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const userData = usersData.get(userId);

        res.json({
            success: true,
            data: userData
        });

    } catch (error) {
        console.error('[Onboarding] Error fetching user data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user data'
        });
    }
});

// Onboarding API: Update user data
app.put('/api/onboarding/user/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        if (!usersData.has(userId)) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const currentData = usersData.get(userId);
        const updatedData = {
            ...currentData,
            ...updates,
            lastUpdated: new Date().toISOString()
        };

        usersData.set(userId, updatedData);

        console.log(`[Onboarding] User data updated for: ${userId}`);

        res.json({
            success: true,
            data: updatedData,
            message: 'User data updated successfully'
        });

    } catch (error) {
        console.error('[Onboarding] Error updating user data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update user data'
        });
    }
});

// Grok API configuration
const GROK_API_KEY = process.env.GROK_API_KEY;
if (!GROK_API_KEY) {
    console.warn('Warning: GROK_API_KEY environment variable not set');
}
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';
const GROK_MODEL = process.env.GROK_MODEL || 'grok-2-1212'; // Use grok-4-latest if available

// Helper function to call Grok API
async function callGrokAPI(prompt, systemPrompt = null) {
    try {
        const messages = [];

        if (systemPrompt) {
            messages.push({
                role: 'system',
                content: systemPrompt
            });
        }

        messages.push({
            role: 'user',
            content: prompt
        });

        const response = await axios.post(GROK_API_URL, {
            model: GROK_MODEL,
            messages: messages,
            temperature: 0.7,
            max_tokens: 2000
        }, {
            headers: {
                'Authorization': `Bearer ${GROK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Grok API Error:', error.response?.data || error.message);
        throw new Error('Failed to generate content with Grok API');
    }
}

// Scraping statistics tracking
let scrapingStats = {
    total: 0,
    successful: 0,
    failed: 0,
    errors: []
};

// LinkedIn scraping function using proxy
async function scrapeLinkedInProfile(url) {
    try {
        // Use allorigins proxy to bypass CORS
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(proxyUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 30000
        });

        const html = response.data.contents;
        
        if (!html || html.length < 100) {
            throw new Error('Insufficient HTML content received');
        }
        
        const $ = cheerio.load(html);

        const profile = {
            name: $('h1.text-heading-xlarge, h1.pv-text-details__left-panel h1').first().text().trim() || 
                   $('h1').first().text().trim(),
            headline: $('.text-body-medium.break-words, .pv-text-details__left-panel .text-body-medium').first().text().trim() ||
                      $('.top-card-layout__headline').first().text().trim() ||
                      '',
            about: $('section.about section p, #about ~ div span').first().text().trim() ||
                   $('.pv-about-section .pv-about__summary-text').text().trim() ||
                   '',
            experience: [],
            location: $('.text-body-small.inline.t-black--light.break-words').first().text().trim() || '',
            connections: $('.pvs-header__container span').text().match(/\d+/)?.[0] || '',
        };

        // Extract experience
        $('.pvs-list__outer-container li, .experience-section li').each((i, elem) => {
            if (i < 3) { // Limit to first 3
                const title = $(elem).find('.t-bold span, .pv-entity__summary-info h3').first().text().trim();
                const company = $(elem).find('.t-14.t-normal span, .pv-entity__secondary-title').first().text().trim();
                if (title || company) {
                    profile.experience.push({ title, company });
                }
            }
        });

        // Validate we got at least some data
        if (!profile.name && !profile.headline && !profile.about) {
            throw new Error('No profile data extracted from HTML');
        }

        scrapingStats.successful++;
        return profile;
    } catch (error) {
        console.error('Scraping error:', error.message);
        scrapingStats.failed++;
        scrapingStats.errors.push({
            timestamp: new Date().toISOString(),
            error: error.message.substring(0, 100) // Store first 100 chars
        });
        
        // Extract name from URL if possible
        const nameMatch = url.match(/linkedin\.com\/in\/([^/?]+)/);
        const extractedName = nameMatch ? nameMatch[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';
        
        // Return minimal profile data for better defaults
        return {
            name: extractedName || 'Profile User',
            headline: '',
            about: '',
            experience: [],
            location: '',
            connections: '',
            scrapingFailed: true // Flag to indicate scraping failed
        };
    }
}

// Load agency pain points from knowledge base
function loadAgencyPainPoints(agencyNames = []) {
    try {
        if (!fs.existsSync(KB_INDEX_PATH)) {
            console.warn('Knowledge base index not found:', KB_INDEX_PATH);
            return [];
        }

        const index = JSON.parse(fs.readFileSync(KB_INDEX_PATH, 'utf8'));
        const allPainPoints = [];

        // If no agency names provided, load pain points from major agencies
        const agenciesToLoad = agencyNames.length > 0 
            ? agencyNames 
            : ['Department of Defense', 'Department of Veterans Affairs', 'Department of Homeland Security', 
               'General Services Administration', 'NASA', 'Department of Energy'];

        agenciesToLoad.forEach(agencyName => {
            let agencyEntry = index.agencies[agencyName];
            if (!agencyEntry) {
                // Try to find by alias
                for (const [key, value] of Object.entries(index.agencies)) {
                    if (value.aliases && value.aliases.some(alias => 
                        alias.toLowerCase().includes(agencyName.toLowerCase()) ||
                        agencyName.toLowerCase().includes(alias.toLowerCase())
                    )) {
                        agencyEntry = value;
                        break;
                    }
                }
            }

            if (agencyEntry && agencyEntry.file) {
                const agencyFile = path.join(KB_PATH, agencyEntry.file);
                if (fs.existsSync(agencyFile)) {
                    try {
                        const agencyData = JSON.parse(fs.readFileSync(agencyFile, 'utf8'));
                        if (agencyData.painPoints && Array.isArray(agencyData.painPoints)) {
                            agencyData.painPoints.forEach(pp => {
                                allPainPoints.push({
                                    point: pp.point,
                                    source: pp.source || 'Knowledge Base',
                                    priority: pp.priority || 'medium',
                                    agency: agencyName
                                });
                            });
                        }
                    } catch (err) {
                        console.error(`Error loading ${agencyFile}:`, err.message);
                    }
                }
            }
        });

        return allPainPoints;
    } catch (error) {
        console.error('Error loading agency pain points:', error.message);
        return [];
    }
}

// Extract agency mentions from text
function extractAgenciesFromText(text) {
    const agencies = [];
    if (!text) return agencies;

    try {
        const index = JSON.parse(fs.readFileSync(KB_INDEX_PATH, 'utf8'));
        const textLower = text.toLowerCase();

        // Check for agency names and aliases
        for (const [agencyName, data] of Object.entries(index.agencies)) {
            const allNames = [agencyName, ...(data.aliases || [])].map(n => n.toLowerCase());
            if (allNames.some(name => textLower.includes(name))) {
                agencies.push(agencyName);
            }
        }
    } catch (error) {
        console.error('Error extracting agencies:', error.message);
    }

    return agencies;
}

// Format pain points for prompt injection
function formatPainPointsForPrompt(painPoints, maxPoints = 10) {
    if (!painPoints || painPoints.length === 0) {
        return 'None specified';
    }

    // Prioritize high-priority points, limit to maxPoints
    const sorted = painPoints
        .sort((a, b) => {
            const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        })
        .slice(0, maxPoints);

    return sorted.map((pp, idx) => {
        return `${idx + 1}. ${pp.point} (Source: ${pp.source})`;
    }).join('\n');
}

// Load viral hooks from JSON file
function loadViralHooks() {
    try {
        if (!fs.existsSync(VIRAL_HOOKS_PATH)) {
            console.warn('Viral hooks file not found:', VIRAL_HOOKS_PATH);
            return null;
        }
        const hooksData = JSON.parse(fs.readFileSync(VIRAL_HOOKS_PATH, 'utf8'));
        return hooksData;
    } catch (error) {
        console.error('Error loading viral hooks:', error.message);
        return null;
    }
}

// Format viral hooks for prompt injection based on content type
function formatViralHooksForPrompt(contentType = 'general', maxHooks = 12) {
    const hooksData = loadViralHooks();
    if (!hooksData || !hooksData.selectionStrategy) {
        return '';
    }

    // Select hooks based on content type
    let selectedHooks = [];
    
    // Collect hooks from relevant categories
    const categories = Object.keys(hooksData).filter(key => key !== 'selectionStrategy');
    
    categories.forEach(category => {
        if (hooksData[category] && Array.isArray(hooksData[category])) {
            hooksData[category].forEach(hook => {
                // Only include high or very high effectiveness hooks
                if (hook.effectiveness === 'high' || hook.effectiveness === 'very high') {
                    selectedHooks.push({
                        category,
                        hook: hook.hook,
                        creator: hook.creator,
                        examples: hook.examples || []
                    });
                }
            });
        }
    });

    // Limit to maxHooks and format for prompt
    const hooksToUse = selectedHooks.slice(0, maxHooks);
    
    if (hooksToUse.length === 0) {
        return '';
    }

    // Format hooks with examples
    const formattedHooks = hooksToUse.map((h, idx) => {
        const examples = h.examples.slice(0, 2).join('\n  - ');
        return `${idx + 1}. "${h.hook}" (${h.creator})
   Examples:
   - ${examples}`;
    }).join('\n\n');

    const strategyInfo = `
HOOK SELECTION STRATEGY:
${hooksData.selectionStrategy.bestPerforming.map(item => `- ${item}`).join('\n')}

HOOK STRUCTURE TEMPLATE:
1. Hook Line - Capture attention (first line)
2. Proof/Context - 1-2 sentences establishing credibility
3. Value - 2-4 sentences providing actionable insights
4. Connection - 1-2 sentences connecting to audience
5. Call to Action - Question or engagement prompt`;

    return `VIRAL LINKEDIN HOOKS (from top creators: Neal O'Grady, Jodie Cook, Alex Groberman, Logan Gott):

PROVEN HOOK TEMPLATES:
${formattedHooks}
${strategyInfo}

Use these hooks as inspiration for creating engaging opening lines. Adapt them to sound natural and authentic - never use them formulaically.`;
}

// Analyze profile with Grok
async function analyzeWithGrok(profileData) {
    // Extract agency mentions from profile
    const profileText = [
        profileData.headline,
        profileData.about,
        ...profileData.experience.map(e => `${e.title} ${e.company}`)
    ].join(' ');

    const mentionedAgencies = extractAgenciesFromText(profileText);
    const painPoints = loadAgencyPainPoints(mentionedAgencies);
    const painPointsFormatted = formatPainPointsForPrompt(painPoints, 8);
    const prompt = `You are a LinkedIn optimization expert. Analyze this LinkedIn profile and provide:

1. A score from 0-100 (be realistic, most profiles score 40-70)
2. An improved, catchy headline that includes value proposition
3. 20 specific, actionable fixes with:
   - Title/category
   - Description of the issue
   - Priority (high/medium/low)
   - Specific tips

Current Profile Data:
- Name: ${profileData.name}
- Current Headline: ${profileData.headline}
- About: ${profileData.about}
- Experience: ${JSON.stringify(profileData.experience)}
- Location: ${profileData.location}

Provide the response in JSON format:
{
  "score": <number>,
  "aiHeadline": "<optimized headline>",
  "fixes": [
    {
      "title": "<category>",
      "description": "<what's wrong and why>",
      "priority": "high|medium|low",
      "tips": "<specific actionable tip>"
    }
  ]
}

Focus on:
- Banner optimization
- Profile picture quality
- Headline catchiness and value
- About section (personal + professional blend)
- Experience details
- Social proof (endorsements, recommendations)
- Features section
- Call-to-action
- Content strategy
- Engagement strategy

Be specific and actionable. Make recommendations based on what actually drives results for government contractors.

AGENCY PAIN POINTS (for context on government needs):
${painPointsFormatted}

Use these agency pain points to help suggest content that addresses real government challenges and needs. This will make recommendations more relevant for government contractors.`;

    try {
        const response = await axios.post(
            GROK_API_URL,
            {
                model: GROK_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a LinkedIn optimization expert specializing in helping government contractors and B2B professionals. Provide detailed, actionable recommendations.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 4000
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROK_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            }
        );

        const content = response.data.choices[0].message.content;
        
        // Try to parse JSON from the response
        let jsonData;
        try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
            jsonData = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : content);
        } catch (e) {
            // If parsing fails, create a structured response from text
            jsonData = {
                score: 55,
                aiHeadline: profileData.headline || 'Strategic Professional | [Your Value Proposition]',
                fixes: generateDefaultFixes(profileData)
            };
        }

        return jsonData;
    } catch (error) {
        console.error('Grok API error:', error.response?.data || error.message);
        // Return default analysis if API fails
        return {
            score: 55,
            aiHeadline: profileData.headline || 'Strategic Professional | [Your Value Proposition]',
            fixes: generateDefaultFixes(profileData)
        };
    }
}

// Generate default fixes if API fails
function generateDefaultFixes(profile) {
    const fixes = [];
    
    if (!profile.headline || profile.headline.length < 30) {
        fixes.push({
            title: 'Headline',
            description: 'Your headline is too short or generic. It needs to communicate value and be catchy.',
            priority: 'high',
            tips: 'Use ChatGPT to generate options. Include who you help and what problem you solve.'
        });
    }

    if (!profile.about || profile.about.length < 200) {
        fixes.push({
            title: 'About Section',
            description: 'Your about section is missing or too short. It should blend personal and professional elements.',
            priority: 'high',
            tips: 'Start with who you are personally, then transition to what you do professionally. Include metrics and a call-to-action.'
        });
    }

    fixes.push({
        title: 'Banner/Billboard',
        description: 'Your banner is the first impression. It should include branding, tagline, and social proof.',
        priority: 'high',
        tips: 'Use your branding colors, include a one-sentence tagline, and add logos of companies you work with or awards.'
    });

    fixes.push({
        title: 'Profile Picture',
        description: 'Your profile picture needs to be clear, professional, and recognizable.',
        priority: 'high',
        tips: 'Use shoulder-up framing, solid background (preferably branding colors), and make sure it looks like you so people recognize you in person.'
    });

    fixes.push({
        title: 'Show Connections',
        description: 'Your connections count should be visible.',
        priority: 'medium',
        tips: 'Go to Settings → Visibility → Connections and enable visibility. People connect with others who have more connections.'
    });

    fixes.push({
        title: 'Get Endorsements',
        description: 'Endorsements add credibility to your profile.',
        priority: 'medium',
        tips: 'Endorse others in your network - it\'s reciprocal. When someone endorses you, thank them and endorse them back.'
    });

    fixes.push({
        title: 'Request Recommendations',
        description: 'Recommendations are more valuable than endorsements.',
        priority: 'high',
        tips: 'Ask people you\'ve worked with for recommendations. Give recommendations to others - they may return the favor.'
    });

    fixes.push({
        title: 'Add Website Link',
        description: 'Make it easy for people to learn more about you.',
        priority: 'medium',
        tips: 'Add your website or landing page in the contact information section.'
    });

    fixes.push({
        title: 'Enhance Experience Section',
        description: 'Your experience should include accomplishments, not just job titles.',
        priority: 'high',
        tips: 'Add metrics, achievements, and specific accomplishments. Treat it like a resume but more conversational.'
    });

    fixes.push({
        title: 'Features Section',
        description: 'Showcase case studies, awards, or digital products.',
        priority: 'medium',
        tips: 'Add case studies (without naming clients if needed), awards, certifications, or your newsletter.'
    });

    // Add more default fixes to reach 20
    const additionalFixes = [
        { title: 'Content Strategy', description: 'Start posting regularly to build authority.', priority: 'high', tips: 'Post 3-5 times per week. Share industry news, contract wins, and educational content.' },
        { title: 'Engagement Strategy', description: 'Comment on others\' posts before posting your own.', priority: 'high', tips: 'Spend 30 min - 1 hour daily commenting on posts from your target audience.' },
        { title: 'Personal Connection', description: 'Add personal elements to your about section.', priority: 'medium', tips: 'Share hobbies, interests, or background. People want to connect with YOU, not just your business.' },
        { title: 'Call-to-Action', description: 'Tell people how to connect or work with you.', priority: 'high', tips: 'Include a clear call-to-action in your about section - website, calendar link, or how to reach you.' },
        { title: 'Skills Section', description: 'Ensure your skills are visible and endorsed.', priority: 'low', tips: 'Add relevant skills and endorse others to get endorsed back.' },
        { title: 'Certifications', description: 'Display all relevant certifications.', priority: 'medium', tips: 'Add certifications and licenses to add credibility.' },
        { title: 'Location Optimization', description: 'Make sure your location is accurate.', priority: 'low', tips: 'Update your location to help local connections find you.' },
        { title: 'Engage with Own Posts', description: 'Like and comment on your own posts.', priority: 'medium', tips: 'Be the first to like your post and add a comment to start engagement.' },
        { title: 'Network Building', description: 'Connect with your target audience strategically.', priority: 'high', tips: 'Connect with decision-makers, government officials, and other entrepreneurs in your industry.' },
        { title: 'Case Studies', description: 'Share contract wins and success stories.', priority: 'high', tips: 'Post case studies showing results. You don\'t always need to name the client.' }
    ];

    return [...fixes, ...additionalFixes].slice(0, 20);
}

// API Routes

// Audit endpoint
app.post('/api/audit', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url || !url.includes('linkedin.com')) {
            return res.status(400).json({ error: 'Invalid LinkedIn URL' });
        }

        scrapingStats.total++;

        // Scrape profile
        console.log('Scraping profile:', url);
        const profileData = await scrapeLinkedInProfile(url);

        // Analyze with Grok
        console.log('Analyzing with Grok...');
        const analysis = await analyzeWithGrok(profileData);

        // Combine results
        const result = {
            score: analysis.score,
            currentHeadline: profileData.headline,
            aiHeadline: analysis.aiHeadline,
            fixes: analysis.fixes || generateDefaultFixes(profileData),
            sessionId: Date.now().toString() // Simple session ID
        };

        res.json(result);
    } catch (error) {
        console.error('Audit error:', error);
        res.status(500).json({ error: 'Failed to analyze profile', message: error.message });
    }
});

// Stripe checkout session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { priceId, mode, successUrl, cancelUrl } = req.body;

        // Map price IDs (replace with your actual Stripe price IDs)
        const priceMap = {
            'price_full_fix': process.env.STRIPE_PRICE_FULL_FIX || 'price_full_fix',
            'price_content_engine': process.env.STRIPE_PRICE_CONTENT_ENGINE || 'price_content_engine'
        };

        const actualPriceId = priceMap[priceId] || priceId;

        const session = await stripe.checkout.sessions.create({
            mode: mode || 'payment',
            line_items: [
                {
                    price: actualPriceId,
                    quantity: 1,
                },
            ],
            success_url: successUrl || `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${req.headers.origin}?canceled=true`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: 'Failed to create checkout session', message: error.message });
    }
});

// Success page
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'success.html'));
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Content Engine Test - Generate content from URLs/content
app.post('/api/content-engine/test', async (req, res) => {
    try {
        const { websiteUrl, additionalUrls = [], pastedContent, description, numPosts = 3, contentStyle = 'mixed' } = req.body;

        if (!websiteUrl && !pastedContent) {
            return res.status(400).json({ error: 'Please provide either a website URL or pasted content' });
        }

        let scrapedContent = '';
        const allUrls = [websiteUrl, ...additionalUrls].filter(url => url && url.trim());

        // Scrape all URLs
        if (allUrls.length > 0) {
            console.log('Scraping URLs:', allUrls);
            for (const url of allUrls) {
                try {
                    const content = await scrapeWebsiteContent(url);
                    scrapedContent += `\n\n--- Content from ${url} ---\n\n${content}`;
                } catch (error) {
                    console.error(`Error scraping ${url}:`, error.message);
                    // Continue with other URLs
                }
            }
        }

        // Combine all content
        const fullContent = [
            description ? `Customer Description: ${description}` : '',
            scrapedContent,
            pastedContent ? `\n\n--- Pasted Content ---\n\n${pastedContent}` : ''
        ].filter(Boolean).join('\n\n');

        if (!fullContent.trim()) {
            return res.status(400).json({ error: 'No content found. Please provide a valid URL or paste content.' });
        }

        // Generate content using Grok
        console.log('Generating content with Grok...');
        const generatedContent = await generateContentWithGrok(fullContent, numPosts, contentStyle);

        res.json(generatedContent);

    } catch (error) {
        console.error('Content Engine test error:', error);
        res.status(500).json({ error: 'Failed to generate content', message: error.message });
    }
});

// Scrape website content (helper function)
async function scrapeWebsiteContent(url) {
    try {
        // Use AllOrigins proxy for CORS (same as LinkedIn scraping)
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await axios.get(proxyUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 30000
        });

        const html = response.data.contents;
        const $ = cheerio.load(html);

        // Remove script and style elements
        $('script, style, nav, footer, header').remove();

        // Extract main content
        const title = $('title').text().trim() || $('h1').first().text().trim();
        const metaDescription = $('meta[name="description"]').attr('content') || '';
        
        // Get main content from common content selectors
        let mainContent = '';
        const contentSelectors = ['main', 'article', '.content', '#content', '.main-content', 'body'];
        for (const selector of contentSelectors) {
            const content = $(selector).first().text();
            if (content.length > 500) {
                mainContent = content;
                break;
            }
        }

        // Fallback to body text
        if (!mainContent) {
            mainContent = $('body').text();
        }

        // Clean up whitespace
        mainContent = mainContent.replace(/\s+/g, ' ').trim();

        // Limit to reasonable size (first 5000 characters)
        mainContent = mainContent.substring(0, 5000);

        return `Title: ${title}\nDescription: ${metaDescription}\n\n${mainContent}`;

    } catch (error) {
        console.error('Scraping error:', error.message);
        throw new Error(`Failed to scrape ${url}: ${error.message}`);
    }
}

// Generate content with Grok
async function generateContentWithGrok(content, numPosts, contentStyle) {
    // Extract agency mentions from content
    const mentionedAgencies = extractAgenciesFromText(content);
    const painPoints = loadAgencyPainPoints(mentionedAgencies);
    const painPointsFormatted = formatPainPointsForPrompt(painPoints, 12);
    const viralHooksFormatted = formatViralHooksForPrompt('general', 12);

    const prompt = `You are a LinkedIn content strategist specializing in creating engaging posts for B2B companies and government contractors.

Based on the following customer information, analyze it and generate LinkedIn content:

CUSTOMER INFORMATION:
${content}

TASKS:
1. Analyze the content and extract:
   - What type of business this is
   - Who their target audience/customers are
   - Key services or offerings
   - Main pain points they solve for customers
   - Key differentiators or strengths

2. Generate ${numPosts} LinkedIn posts that:
   - Are authentic and sound like they came from the company
   - Speak directly to their target audience's pain points
   - Highlight their services/value proposition naturally
   - Include a compelling hook, valuable content, and clear call-to-action
   - Match the style: ${contentStyle}
   - Are between 150-300 words each (LinkedIn-friendly length)
   - Do NOT repeat exact phrases from the source material (paraphrase and create original content)

3. For each post, suggest 3-5 relevant hashtags

AGENCY PAIN POINTS (to inform content relevance):
${painPointsFormatted}

Use these agency pain points to create content that addresses real government challenges and needs. Reference these pain points naturally in posts when relevant to show understanding of government priorities. This makes the content more valuable and credible for government contractor audiences.

${viralHooksFormatted}

IMPORTANT: Use the viral hooks above as inspiration for creating engaging opening lines. Each post MUST start with a compelling hook that captures attention. Adapt these hooks naturally - don't use them formulaically. The hook should feel authentic to the company's voice while leveraging proven patterns from top LinkedIn creators. For government contractors, prioritize proof-driven hooks (with metrics), pattern/trend hooks (showing insights), and authority hooks (establishing credibility).

Output in JSON format:
{
  "insights": {
    "businessType": "...",
    "targetAudience": "...",
    "keyServices": "...",
    "painPoints": "..."
  },
  "posts": [
    {
      "content": "Full LinkedIn post text here...",
      "suggestedHashtags": ["hashtag1", "hashtag2", ...]
    }
  ]
}

Make the posts engaging, valuable, and likely to get engagement. Focus on solving problems and providing value to the target audience.`;

    try {
        const response = await axios.post(
            GROK_API_URL,
            {
                model: GROK_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a LinkedIn content strategist. Create engaging, authentic LinkedIn posts that provide value to B2B audiences. Never copy content verbatim - always create original content inspired by the source material.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 4000
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROK_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            }
        );

        const content = response.data.choices[0].message.content;
        
        // Try to parse JSON
        let jsonData;
        try {
            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
            jsonData = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : content);
        } catch (e) {
            // If parsing fails, create structured response
            jsonData = {
                insights: {
                    businessType: 'Unable to determine',
                    targetAudience: 'Unable to determine',
                    keyServices: 'Unable to determine',
                    painPoints: 'Unable to determine'
                },
                posts: [
                    {
                        content: 'Error: Unable to parse content. Please try again with more detailed content.',
                        suggestedHashtags: []
                    }
                ]
            };
        }

        return jsonData;

    } catch (error) {
        console.error('Grok API error:', error.response?.data || error.message);
        throw new Error('Failed to generate content with AI');
    }
}

// Content Engine Setup - Save user's content profile
app.post('/api/content-engine/setup', async (req, res) => {
    try {
        const data = req.body;
        
        // TODO: Store this in database (for now, just return success)
        // In production, save to database with user ID/session
        
        // Structure the data for content generation
        const contentProfile = {
            business: {
                nameRole: data.nameRole,
                description: data.businessDescription,
                services: data.services,
                results: data.clientResults,
            },
            idealCustomer: {
                profile: data.customerProfile,
                pains: data.customerPains,
                goals: data.customerGoals,
                objections: data.customerObjections,
                triggers: data.customerTriggers,
            },
            stories: {
                customerStories: data.customerStories,
                proudWins: data.proudWins,
            },
            voice: {
                positioning: data.positioning,
                words: data.voiceWords,
                examples: data.styleExamples,
            },
            sources: {
                website: data.websiteUrl,
                contentUrls: data.contentUrls ? data.contentUrls.split('\n').filter(url => url.trim()) : [],
                mediaUrls: data.mediaUrls ? data.mediaUrls.split('\n').filter(url => url.trim()) : [],
            },
            preferences: {
                contentTypes: data.contentTypes || [],
                frequencyPerWeek: parseInt(data.frequencyPerWeek) || 3,
                avoidTopics: data.avoidTopics,
            },
            createdAt: new Date().toISOString(),
        };

        // TODO: Save to database
        // await db.contentProfiles.create(contentProfile);
        
        // For now, log it (in production, save to database)
        console.log('Content Engine Profile Created:', JSON.stringify(contentProfile, null, 2));

        res.json({ 
            success: true, 
            message: 'Content Engine profile saved successfully',
            profileId: Date.now().toString() // Temporary ID
        });
    } catch (error) {
        console.error('Content Engine setup error:', error);
        res.status(500).json({ error: 'Failed to save content profile', message: error.message });
    }
});

// Statistics endpoint
app.get('/api/stats', (req, res) => {
    const successRate = scrapingStats.total > 0
        ? ((scrapingStats.successful / scrapingStats.total) * 100).toFixed(2)
        : 0;

    res.json({
        ...scrapingStats,
        successRate: `${successRate}%`,
        // Only return last 10 errors to avoid huge response
        recentErrors: scrapingStats.errors.slice(-10)
    });
});

// Content Engine: Generate LinkedIn posts
app.post('/api/generate-content', async (req, res) => {
    try {
        const { profileData, customerInfo } = req.body;

        if (!profileData) {
            return res.status(400).json({ error: 'Profile data is required' });
        }

        // Extract agency mentions from profile
        const profileText = [
            profileData.headline || '',
            profileData.about || '',
            ...(profileData.experience || []).map(e => `${e.title || ''} ${e.company || ''}`)
        ].join(' ');

        const mentionedAgencies = extractAgenciesFromText(profileText);
        const painPoints = loadAgencyPainPoints(mentionedAgencies);
        const painPointsFormatted = formatPainPointsForPrompt(painPoints, 10);
        const viralHooksFormatted = formatViralHooksForPrompt('general', 12);

        // Generate 4 LinkedIn posts using Grok
        const prompt = `You are a LinkedIn content strategist specializing in government contracting.

Generate 4 unique, engaging LinkedIn posts for this professional:

Profile Info:
- Name: ${profileData.name || 'Professional'}
- Headline: ${profileData.headline || 'Government contractor'}
- About: ${profileData.about || 'Experienced in government contracting'}
- Industry: Government Contracting

Requirements:
1. Each post should be 150-250 words
2. Use storytelling and personal insights
3. Include relevant hashtags (3-5 per post)
4. Focus on government contracting topics
5. Make them authentic and engaging

Post Types:
1. THOUGHT LEADERSHIP: Share an insight about winning government contracts
2. CASE STUDY: Describe a recent win or lesson learned (can be hypothetical if needed)
3. INDUSTRY COMMENTARY: React to recent government contracting news or trends
4. PERSONAL STORY: Share a challenge overcome or skill developed

AGENCY PAIN POINTS (to inform content relevance):
${painPointsFormatted}

Use these agency pain points to create content that addresses real government challenges and needs. Reference these pain points naturally in posts when relevant to show understanding of government priorities. This makes the content more valuable and credible for government contractor audiences.

${viralHooksFormatted}

IMPORTANT: Use the viral hooks above as inspiration for creating engaging opening lines. Each post MUST start with a compelling hook that captures attention. Adapt these hooks naturally - don't use them formulaically. The hook should feel authentic to the professional's voice while leveraging proven patterns from top LinkedIn creators. For government contractors, prioritize proof-driven hooks (with metrics), pattern/trend hooks (showing insights), and authority hooks (establishing credibility).

For each post, provide:
- The full post text
- Recommended hashtags
- Best time to post (day of week)
- Engagement tip

Format as JSON:
{
  "posts": [
    {
      "week": 1,
      "type": "Thought Leadership",
      "content": "post text here...",
      "hashtags": ["#GovCon", "#FederalContracting"],
      "bestTime": "Tuesday 9am EST",
      "engagementTip": "Ask a question at the end"
    }
  ]
}`;

        const response = await axios.post(
            GROK_API_URL,
            {
                model: GROK_MODEL,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 3000
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROK_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            }
        );

        const content = response.data.choices[0].message.content;

        // Try to parse JSON response
        let posts;
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                posts = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found');
            }
        } catch (parseError) {
            // If JSON parsing fails, return raw content
            posts = {
                posts: [
                    { week: 1, type: 'Generated Content', content: content, hashtags: ['#GovCon'], bestTime: 'Tuesday 9am', engagementTip: 'Engage with comments' }
                ],
                note: 'Posts generated but need manual formatting'
            };
        }

        res.json({
            success: true,
            customerInfo,
            generatedAt: new Date().toISOString(),
            ...posts
        });

    } catch (error) {
        console.error('Content generation error:', error.message);
        res.status(500).json({
            error: 'Failed to generate content',
            message: error.message
        });
    }
});

// Stripe Webhook Handler for new subscriptions
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        // In production, verify webhook signature
        // For now, just parse the event
        event = req.body;

        console.log('Webhook received:', event.type);

        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                console.log('New subscription:', {
                    customer: session.customer,
                    email: session.customer_details?.email,
                    amount: session.amount_total / 100,
                    mode: session.mode
                });

                // TODO: Send welcome email
                // TODO: Generate first month's content
                // TODO: Add to subscriber database

                break;

            case 'customer.subscription.created':
                const subscription = event.data.object;
                console.log('Subscription created:', subscription.id);
                break;

            case 'customer.subscription.deleted':
                const canceledSub = event.data.object;
                console.log('Subscription canceled:', canceledSub.id);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Webhook error:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

// Helper function: Generate search suggestions when results are limited
async function generateSearchSuggestions(params) {
    const {
        currentResults,
        currentAgencies,
        businessFormation,
        naicsCode,
        zipCode,
        veteranStatus,
        filters,
        fields,
        setAsideMap,
        veteranMap
    } = params;

    const suggestions = {
        message: `Found ${currentResults} contracts from ${currentAgencies} ${currentAgencies === 1 ? 'agency' : 'agencies'}. Here are some ways to expand your search:`,
        alternatives: []
    };

    // Suggestion 1: Try other set-aside types (if currently using one)
    if (businessFormation) {
        const otherSetAsides = Object.keys(setAsideMap).filter(type => type !== businessFormation);
        const setAsidePromises = otherSetAsides.slice(0, 3).map(async (setAsideType) => {
            try {
                const testFilters = {
                    ...filters,
                    set_aside_type_codes: setAsideMap[setAsideType]
                };

                const response = await axios.post('https://api.usaspending.gov/api/v2/search/spending_by_award/', {
                    filters: testFilters,
                    fields: ['Award ID'],
                    page: 1,
                    limit: 100
                }, { timeout: 5000 });

                const count = response.data?.results?.length || 0;
                // Estimate total based on first page results
                const estimatedTotal = count === 100 ? 1000 : count;

                console.log(`   ${setAsideType}: ~${estimatedTotal} contracts`);

                if (estimatedTotal > currentResults) {
                    return {
                        type: 'set-aside',
                        label: setAsideType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                        value: setAsideType,
                        estimatedContracts: estimatedTotal,
                        description: `~${estimatedTotal.toLocaleString()} contracts available for ${setAsideType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} businesses`
                    };
                }
            } catch (error) {
                console.error(`   Error checking ${setAsideType}:`, error.message);
            }
            return null;
        });

        const setAsideResults = (await Promise.all(setAsidePromises)).filter(Boolean);
        if (setAsideResults.length > 0) {
            suggestions.alternatives.push(...setAsideResults);
        }
    }

    // Suggestion 2: Expand geographic area (if currently using location filter)
    if (zipCode && filters.place_of_performance_locations) {
        try {
            const expandedFilters = { ...filters };
            delete expandedFilters.place_of_performance_locations; // Remove location filter for nationwide search

            const response = await axios.post('https://api.usaspending.gov/api/v2/search/spending_by_award/', {
                filters: expandedFilters,
                fields: ['Award ID'],
                page: 1,
                limit: 100
            }, { timeout: 5000 });

            const count = response.data?.results?.length || 0;
            const estimatedTotal = count === 100 ? 1000 : count;

            console.log(`   Nationwide: ~${estimatedTotal} contracts`);

            if (estimatedTotal > currentResults * 1.5) {
                const stateFromZip = getStateFromZip(zipCode);
                suggestions.alternatives.push({
                    type: 'location',
                    label: 'Nationwide Search',
                    value: 'nationwide',
                    estimatedContracts: estimatedTotal,
                    description: `~${estimatedTotal.toLocaleString()} contracts available nationwide (currently searching in ${stateFromZip} and bordering states)`
                });
            }
        } catch (error) {
            console.error('   Error checking nationwide:', error.message);
        }
    }

    // Suggestion 3: Expand to all NAICS codes with same 3-digit prefix
    // Always suggest if user has a 4+ digit NAICS code
    if (naicsCode && naicsCode.length >= 4) {
        const naicsPrefix = naicsCode.substring(0, 3);

        try {
            // Test with just the 3-digit prefix to see how many contracts are available
            const prefixFilters = { ...filters };
            delete prefixFilters.naics_codes; // We'll search broadly and then apply prefix manually

            // Do a broader search (remove location) to get a better estimate
            const testFilters = { ...filters };
            delete testFilters.naics_codes;
            delete testFilters.place_of_performance_locations;

            const response = await axios.post('https://api.usaspending.gov/api/v2/search/spending_by_award/', {
                filters: testFilters,
                fields: ['Award ID'],
                page: 1,
                limit: 100
            }, { timeout: 5000 });

            const count = response.data?.results?.length || 0;
            const estimatedTotal = count === 100 ? 1000 : count;

            console.log(`   All NAICS ${naicsPrefix}xx codes (nationwide): ~${estimatedTotal} contracts`);

            // Always suggest if it would give more results
            if (estimatedTotal > currentResults * 1.5) {
                // Map common NAICS prefixes to industry names
                const industryNames = {
                    '236': 'Construction',
                    '541': 'Professional Services',
                    '518': 'Data Processing & Hosting',
                    '561': 'Administrative Support',
                    '238': 'Specialty Trade Contractors',
                    '237': 'Heavy Construction',
                    '54': 'Professional Services',
                    '23': 'Construction'
                };
                const industryName = industryNames[naicsPrefix] || industryNames[naicsPrefix.substring(0, 2)] || `NAICS ${naicsPrefix}`;

                suggestions.alternatives.push({
                    type: 'naics-prefix',
                    label: `All ${industryName} (NAICS ${naicsPrefix}xx)`,
                    value: `naics-prefix:${naicsPrefix}`,
                    estimatedContracts: estimatedTotal,
                    description: `~${estimatedTotal.toLocaleString()} contracts in the ${industryName} industry (all ${naicsPrefix}xx codes)`
                });
            }
        } catch (error) {
            console.error(`   Error checking NAICS ${naicsPrefix}xx family:`, error.message);
        }
    }

    // Suggestion 4: Same industry + set-aside, but remove location (if location was applied)
    // This is valuable when NAICS + set-aside are specific but location is too restrictive
    if (naicsCode && businessFormation && zipCode && filters.place_of_performance_locations) {
        try {
            const expandedFilters = { ...filters };
            delete expandedFilters.place_of_performance_locations; // Remove location, keep NAICS + set-aside

            const response = await axios.post('https://api.usaspending.gov/api/v2/search/spending_by_award/', {
                filters: expandedFilters,
                fields: ['Award ID'],
                page: 1,
                limit: 100
            }, { timeout: 5000 });

            const count = response.data?.results?.length || 0;
            const estimatedTotal = count === 100 ? 1000 : count;

            console.log(`   Same industry + set-aside nationwide: ~${estimatedTotal} contracts`);

            if (estimatedTotal > currentResults * 1.5) {
                const businessLabel = businessFormation.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                suggestions.alternatives.push({
                    type: 'naics-setaside-nationwide',
                    label: `${businessLabel} + NAICS ${naicsCode} (Nationwide)`,
                    value: `${businessFormation}|${naicsCode}`,
                    estimatedContracts: estimatedTotal,
                    description: `~${estimatedTotal.toLocaleString()} contracts for ${businessLabel} in NAICS ${naicsCode} across all states`
                });
            }
        } catch (error) {
            console.error(`   Error checking same industry + set-aside nationwide:`, error.message);
        }
    }

    // Suggestion 5: Remove NAICS filter to see all industries (last resort)
    if (naicsCode) {
        try {
            const expandedFilters = { ...filters };
            delete expandedFilters.naics_codes; // Remove NAICS filter

            const response = await axios.post('https://api.usaspending.gov/api/v2/search/spending_by_award/', {
                filters: expandedFilters,
                fields: ['Award ID'],
                page: 1,
                limit: 100
            }, { timeout: 5000 });

            const count = response.data?.results?.length || 0;
            const estimatedTotal = count === 100 ? 1000 : count;

            console.log(`   All industries: ~${estimatedTotal} contracts`);

            if (estimatedTotal > currentResults * 2) { // Higher threshold for "all industries"
                suggestions.alternatives.push({
                    type: 'naics',
                    label: 'All Industries',
                    value: 'all',
                    estimatedContracts: estimatedTotal,
                    description: `~${estimatedTotal.toLocaleString()} contracts available across all industries`
                });
            }
        } catch (error) {
            console.error('   Error checking all industries:', error.message);
        }
    }

    // Only return suggestions if we found some
    return suggestions.alternatives.length > 0 ? suggestions : null;
}

// USAspending.gov API: Search for government agencies and contracts
// Using USAspending API (JSON) instead of FPDS (XML) for better reliability

app.post('/api/government-contracts/search', async (req, res) => {
    try {
        const {
            businessFormation,
            naicsCode,
            zipCode,
            goodsOrServices,
            veteranStatus
        } = req.body;

        console.log('🔍 Government contract search request:', req.body);

        // Map business formation to USAspending set-aside codes
        const setAsideMap = {
            'women-owned': ['WOSB', 'EDWOSB'],
            'hubzone': ['HZBZ', 'HUBZ'],
            '8a': ['8A', '8AN', '8A COMPETED', '8A SOLE SOURCE'],
            'small-business': ['SBA', 'SBP', 'SMALL BUSINESS SET-ASIDE', 'TOTAL SMALL BUSINESS SET-ASIDE (FAR 19.5)'],
            'dot-certified': ['SBP']
        };

        const veteranMap = {
            'veteran-owned': ['VOSB', 'VO'],
            'service-disabled-veteran': ['SDVOSB', 'SDVOSBC']
        };

        // Build set-aside type codes array for USAspending API
        const setAsideTypeCodes = [];
        if (businessFormation && setAsideMap[businessFormation]) {
            setAsideTypeCodes.push(...setAsideMap[businessFormation]);
        }
        if (veteranStatus && veteranMap[veteranStatus]) {
            setAsideTypeCodes.push(...veteranMap[veteranStatus]);
        }

        console.log('🎯 Target set-aside codes:', setAsideTypeCodes);

        // Build USAspending API request
        const filters = {
            award_type_codes: ['A', 'B', 'C', 'D'], // Contracts only (A=BPA, B=Purchase Order, C=Delivery Order, D=Definitive Contract)
            time_period: [
                {
                    start_date: '2022-10-01', // Last 3 fiscal years
                    end_date: '2025-09-30'
                }
            ]
        };

        // Track if NAICS was auto-corrected
        let naicsCorrectionMessage = null;

        // Add NAICS filter if provided
        if (naicsCode && naicsCode.trim()) {
            let trimmedNaics = naicsCode.trim();

            // Detect invalid 6-digit codes ending in 000 (like 811000, 541000) and convert to 3-digit
            if (trimmedNaics.length === 6 && trimmedNaics.endsWith('000')) {
                const prefix = trimmedNaics.substring(0, 3);
                console.log(`⚠️ NAICS ${trimmedNaics} appears invalid (ends in 000). Auto-correcting to 3-digit prefix: ${prefix}`);

                const industryNames = {
                    '811': 'Repair and Maintenance',
                    '541': 'Professional, Scientific, and Technical Services',
                    '561': 'Administrative and Support Services',
                    '236': 'Construction of Buildings',
                    '237': 'Heavy and Civil Engineering Construction',
                    '238': 'Specialty Trade Contractors',
                    '518': 'Data Processing and Hosting',
                    '423': 'Merchant Wholesalers, Durable Goods'
                };

                const industryName = industryNames[prefix] || `${prefix}xx industry`;
                naicsCorrectionMessage = `NAICS ${trimmedNaics} was expanded to search all ${prefix}xx codes in the ${industryName} sector.`;
                trimmedNaics = prefix;
            }

            // If user provides a 3-digit NAICS prefix, expand to all related codes using hardcoded mapping
            if (trimmedNaics.length === 3) {
                console.log(`📋 Expanding 3-digit NAICS prefix ${trimmedNaics} to all related codes...`);

                // Hardcoded mapping of 3-digit prefixes to common specific codes
                // This covers the most common government contracting industries
                const naicsExpansion = {
                    // Construction of Buildings (236) - All valid NAICS codes (only 6 exist)
                    '236': ['236115', '236116', '236117', '236118', '236210', '236220'],
                    '237': ['237110', '237120', '237130', '237210', '237310', '237990'], // Heavy and Civil Engineering Construction
                    '238': ['238110', '238120', '238130', '238140', '238150', '238160', '238170', '238190', '238210', '238220', '238290', '238310', '238320', '238330', '238340', '238350', '238390', '238910', '238990'], // Specialty Trade Contractors
                    '541': ['541110', '541120', '541191', '541199', '541211', '541213', '541214', '541219', '541310', '541320', '541330', '541340', '541350', '541360', '541370', '541380', '541410', '541420', '541430', '541490', '541511', '541512', '541513', '541519', '541611', '541612', '541613', '541614', '541618', '541620', '541690', '541713', '541714', '541715', '541720', '541810', '541820', '541830', '541840', '541850', '541860', '541870', '541890', '541910', '541921', '541922', '541930', '541940', '541990'], // Professional, Scientific, and Technical Services
                    '561': ['561110', '561210', '561311', '561312', '561320', '561330', '561410', '561421', '561422', '561431', '561439', '561440', '561450', '561491', '561492', '561499', '561510', '561520', '561591', '561599', '561611', '561612', '561613', '561621', '561622', '561710', '561720', '561730', '561740', '561790', '561910', '561920', '561990'], // Administrative and Support Services
                    '518': ['518210'], // Data Processing, Hosting, and Related Services
                    '423': ['423110', '423120', '423130', '423140', '423210', '423220', '423310', '423320', '423330', '423390', '423410', '423420', '423430', '423440', '423450', '423460', '423490', '423510', '423520', '423610', '423620', '423690', '423710', '423720', '423730', '423740', '423810', '423820', '423830', '423840', '423850', '423860', '423910', '423920', '423930', '423940', '423990'], // Merchant Wholesalers, Durable Goods
                    '811': ['811111', '811112', '811113', '811118', '811121', '811122', '811191', '811192', '811198', '811211', '811212', '811213', '811219', '811310', '811411', '811412', '811420', '811430', '811490'], // Repair and Maintenance
                };

                const expandedCodes = naicsExpansion[trimmedNaics];
                if (expandedCodes && expandedCodes.length > 0) {
                    filters.naics_codes = expandedCodes;
                    console.log(`   Expanded to ${expandedCodes.length} specific NAICS codes in ${trimmedNaics}xx family`);
                } else {
                    // If no mapping exists, just use the 3-digit code (may cause API error)
                    console.log(`   No expansion mapping for ${trimmedNaics}, using as-is`);
                    filters.naics_codes = [trimmedNaics];
                }
            } else {
                // Use exact NAICS code (4-6 digits)
                filters.naics_codes = [trimmedNaics];
            }
        }

        // Add set-aside filter if we have business formation or veteran status
        if (setAsideTypeCodes.length > 0) {
            filters.set_aside_type_codes = setAsideTypeCodes;
        }

        // Add location filter based on zip code
        if (zipCode && zipCode.trim()) {
            const stateFromZip = getStateFromZip(zipCode);
            if (stateFromZip) {
                const borderingStates = getBorderingStates(stateFromZip);
                const stateCodes = [stateFromZip, ...borderingStates];

                filters.place_of_performance_locations = stateCodes.map(state => ({
                    country: 'USA',
                    state: state
                }));

                console.log('📍 Searching in states:', stateCodes);
            }
        }

        console.log('🌐 USAspending API filters:', JSON.stringify(filters, null, 2));

        // Fields to request from USAspending API
        const fields = [
            'Award ID',
            'Recipient Name',
            'Award Amount',
            'Awarding Agency',
            'Awarding Sub Agency',
            'Awarding Agency Code',
            'Awarding Sub Agency Code',
            'Awarding Office',
            'NAICS Code',
            'NAICS Description',
            'Place of Performance State Code',
            'Place of Performance City Code',
            'Primary Place of Performance',
            'Set-Aside Type',
            'Number of Offers Received'
        ];

        // Fetch contracts from USAspending API (multiple pages for comprehensive results)
        // Adjust number of pages based on how restrictive the search is
        let allAwards = []; // Use 'let' to allow fallback reassignment
        let maxPages = 10; // Default: 10 pages × 100 records = 1000 contracts

        // Count how many filters are applied (more filters = more restrictive = need more pages)
        const filterCount = [
            naicsCode && naicsCode.trim(),
            setAsideTypeCodes.length > 0,
            zipCode && zipCode.trim()
        ].filter(Boolean).length;

        // Increase pages for highly restrictive searches
        if (filterCount >= 3) {
            maxPages = 50; // Very restrictive: fetch 5000 contracts
            console.log('🔍 Highly restrictive search detected (NAICS + set-aside + location)');
        } else if (filterCount === 2) {
            maxPages = 25; // Moderately restrictive: fetch 2500 contracts
            console.log('🔍 Moderately restrictive search (2 filters)');
        } else {
            maxPages = 10; // Less restrictive: fetch 1000 contracts
            console.log('🔍 Broad search (0-1 filters)');
        }

        const limit = 100;
        console.log(`📊 Fetching up to ${maxPages * limit} contracts from USAspending API...`);

        for (let page = 1; page <= maxPages; page++) {
            try {
                const response = await axios.post('https://api.usaspending.gov/api/v2/search/spending_by_award/', {
                    filters,
                    fields,
                    page,
                    limit,
                    order: 'desc',
                    sort: 'Award Amount'
                }, {
                    timeout: 30000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data && response.data.results) {
                    allAwards.push(...response.data.results);
                    console.log(`   Page ${page}: Retrieved ${response.data.results.length} contracts`);
                    
                    // Debug: Sample first award to see available fields (only on first page)
                    if (page === 1 && response.data.results.length > 0) {
                        const sampleAward = response.data.results[0];
                        console.log(`   🔍 Sample award - Available fields:`, Object.keys(sampleAward));
                        const offersField = sampleAward['Number of Offers Received'];
                        console.log(`   🔍 "Number of Offers Received" value: ${offersField} (type: ${typeof offersField})`);
                        
                        // Check for alternative field names
                        const altFields = ['number_of_offers_received', 'NumberOfOffersReceived', 'Number_of_Offers_Received', 'numberOfOffersReceived'];
                        for (const altField of altFields) {
                            if (sampleAward[altField] !== undefined) {
                                console.log(`   🔍 Found alternative field "${altField}": ${sampleAward[altField]}`);
                            }
                        }
                        
                        if (offersField !== undefined && offersField !== null) {
                            console.log(`   ✅ Offers field is present in API response`);
                        } else {
                            console.log(`   ⚠️ Offers field is missing or null - contracts may not report this data`);
                        }
                    }

                    // Stop if we got fewer results than the limit (last page)
                    if (response.data.results.length < limit) {
                        console.log(`   Reached last page at page ${page}`);
                        break;
                    }
                } else {
                    break;
                }
            } catch (error) {
                console.error(`Error fetching page ${page}:`, error.message);
                break;
            }

            // Small delay between requests to be respectful
            if (page < maxPages) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        console.log(`✅ Retrieved ${allAwards.length} total contracts from USAspending`);
        
        // Debug: Check first few awards for offers data
        if (allAwards.length > 0) {
            console.log(`🔍 Checking first 3 awards for offers data...`);
            for (let i = 0; i < Math.min(3, allAwards.length); i++) {
                const award = allAwards[i];
                const offersValue = award['Number of Offers Received'];
                console.log(`   Award ${i+1}: "Number of Offers Received" = ${offersValue} (${typeof offersValue})`);
                // Log all fields that might contain "offer" or "bid"
                const offerRelatedFields = Object.keys(award).filter(key => 
                    key.toLowerCase().includes('offer') || 
                    key.toLowerCase().includes('bid') ||
                    key.toLowerCase().includes('proposal') ||
                    key.toLowerCase().includes('quote')
                );
                if (offerRelatedFields.length > 0) {
                    console.log(`   Award ${i+1} - Offer-related fields:`, offerRelatedFields);
                }
            }
        }

        // Track if we applied a fallback to show suggestions even with good results
        let wasAutoAdjusted = false;

        if (allAwards.length === 0) {
            console.log('⚠️ No contracts found with initial filters. Attempting auto-broadening...');
            console.log('   NAICS:', naicsCode || 'none');
            console.log('   Business formation:', businessFormation || 'none');
            console.log('   Set-aside codes:', setAsideTypeCodes);
            console.log('   Location:', zipCode ? `ZIP ${zipCode}` : 'nationwide');

            // Auto-broaden search strategy: progressively remove restrictions
            // Priority order: 1) Remove location, 2) Keep NAICS + set-aside for relevant results
            let fallbackFilters = null;
            let fallbackMessage = null;
            let appliedFallback = false;

            // Fallback 1: Remove location restriction (most common issue)
            if (zipCode && filters.place_of_performance_locations) {
                console.log('🔄 Fallback 1: Removing location restriction for nationwide search...');
                fallbackFilters = { ...filters };
                delete fallbackFilters.place_of_performance_locations;
                fallbackMessage = `No contracts found in ${getStateFromZip(zipCode)} area. Showing nationwide results for ${businessFormation ? businessFormation.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' businesses in ' : ''}NAICS ${naicsCode}.`;
                appliedFallback = true;
            }
            // Fallback 2: If still no location but have specific set-aside + NAICS, try broader set-aside
            else if (businessFormation && naicsCode && (businessFormation === 'women-owned' || businessFormation === 'hubzone')) {
                console.log('🔄 Fallback 2: Broadening to all small business set-asides...');
                fallbackFilters = { ...filters };
                fallbackFilters.set_aside_type_codes = ['SBA', 'SBP', '8A', '8AN', 'WOSB', 'EDWOSB', 'HZBZ', 'HUBZ', 'SDVOSB', 'VOSB'];
                fallbackMessage = `Limited ${businessFormation.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} contracts in NAICS ${naicsCode}. Showing all small business set-aside contracts in this industry.`;
                appliedFallback = true;
            }
            // Fallback 3: If we have NAICS but no set-aside or set-aside too restrictive
            else if (naicsCode && businessFormation) {
                console.log('🔄 Fallback 3: Removing set-aside restriction...');
                fallbackFilters = { ...filters };
                delete fallbackFilters.set_aside_type_codes;
                fallbackMessage = `No ${businessFormation.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} contracts found in NAICS ${naicsCode}. Showing all contracts in this industry (all business types).`;
                appliedFallback = true;
            }

            // Try fallback search if we identified a strategy
            if (appliedFallback && fallbackFilters) {
                try {
                    console.log('📊 Fetching fallback results...');
                    const fallbackAwards = [];
                    const fallbackLimit = 100;
                    const maxFallbackPages = 10;

                    for (let page = 1; page <= maxFallbackPages; page++) {
                        const response = await axios.post('https://api.usaspending.gov/api/v2/search/spending_by_award/', {
                            filters: fallbackFilters,
                            fields,
                            page,
                            limit: fallbackLimit,
                            order: 'desc',
                            sort: 'Award Amount'
                        }, {
                            timeout: 30000,
                            headers: { 'Content-Type': 'application/json' }
                        });

                        if (response.data && response.data.results) {
                            fallbackAwards.push(...response.data.results);
                            if (response.data.results.length < fallbackLimit) break;
                        } else {
                            break;
                        }

                        if (page < maxFallbackPages) {
                            await new Promise(resolve => setTimeout(resolve, 100));
                        }
                    }

                    console.log(`✅ Fallback search retrieved ${fallbackAwards.length} contracts`);

                    // If fallback found results, use them instead
                    if (fallbackAwards.length > 0) {
                        allAwards = fallbackAwards;
                        wasAutoAdjusted = true; // Track that we auto-adjusted the search
                        console.log('✨ Using fallback results to ensure non-zero results');
                    }
                } catch (error) {
                    console.error('❌ Fallback search failed:', error.message);
                }
            }

            // If still zero results after fallback, generate suggestions and return
            if (allAwards.length === 0) {
                console.log('⚠️ No contracts found even after fallback attempts');
                let suggestions = null;
                if (naicsCode || businessFormation || zipCode) {
                    console.log('💡 Generating alternative search suggestions...');
                    suggestions = await generateSearchSuggestions({
                        currentResults: 0,
                        currentAgencies: 0,
                        businessFormation,
                        naicsCode,
                        zipCode,
                        veteranStatus,
                        filters,
                        fields,
                        setAsideMap,
                        veteranMap
                    });
                }

                return res.json({
                    success: true,
                    searchCriteria: { businessFormation, naicsCode, zipCode, goodsOrServices, veteranStatus },
                    summary: {
                        totalAwards: 0,
                        totalAgencies: 0,
                        totalSpending: 0
                    },
                    agencies: [],
                    suggestions: suggestions,
                    naicsCorrectionMessage: naicsCorrectionMessage
                });
            }

            // If fallback succeeded, add the fallback message to show user what changed
            if (fallbackMessage) {
                naicsCorrectionMessage = naicsCorrectionMessage ?
                    `${naicsCorrectionMessage}\n\n${fallbackMessage}` :
                    fallbackMessage;
            }
        }

        // Office name enhancement mapping - expand abbreviated office names to full official names
        const officeNameEnhancements = {
            // Army Engineering Districts
            'Endist Omaha': 'U.S. Army Engineer District, Omaha',
            'W071': 'U.S. Army Engineer District, Omaha',
            'Endist Sacramento': 'U.S. Army Engineer District, Sacramento',
            'Endist Louisville': 'U.S. Army Engineer District, Louisville',
            'Endist Norfolk': 'U.S. Army Engineer District, Norfolk',

            // Army Engineering and Support Centers
            'USA Eng Spt Ctr Huntsvil': 'U.S. Army Engineering and Support Center, Huntsville, Alabama',
            '2V6': 'U.S. Army Engineering and Support Center, Huntsville, Alabama',

            // Army Contracting Command
            'ACC-PICA': 'Army Contracting Command - Program Integration and Contracting Activity',
            'W6QK': 'Army Contracting Command',
            'ACC-APG Natick': 'Army Contracting Command - Aberdeen Proving Ground, Natick',
            'ACC-RSA': 'Army Contracting Command - Redstone Arsenal',
            'ACC-APG': 'Army Contracting Command - Aberdeen Proving Ground',

            // Air Force Contracting
            'Afmc Wpafb Oh': 'Air Force Materiel Command - Wright-Patterson AFB, Ohio',
            'Afsc Maxwell Afb Al': 'Air Force Sustainment Center - Maxwell AFB, Alabama',
            '772 ESS PKD': '772 Enterprise Sourcing Squadron - Wright-Patterson AFB',

            // Navy Commands
            'Navfac Northwest': 'Naval Facilities Engineering Command Northwest',
            'Navfac Atlantic': 'Naval Facilities Engineering Command Atlantic',
            'Navfac Pacific': 'Naval Facilities Engineering Command Pacific',
            'Navsup Flc Norfolk': 'Naval Supply Systems Command Fleet Logistics Center Norfolk',

            // DHS/CBP
            'Cbp Oaq': 'U.S. Customs and Border Protection - Office of Acquisition',

            // Common abbreviations
            'Svc': 'Service',
            'Dept': 'Department',
            'Hq': 'Headquarters',
            'Cmd': 'Command',
            'Ctr': 'Center'
        };

        // Function to enhance office name
        function enhanceOfficeName(officeName) {
            if (!officeName) return officeName;

            // Check for direct match
            if (officeNameEnhancements[officeName]) {
                return officeNameEnhancements[officeName];
            }

            // Check for partial matches
            for (const [abbrev, fullName] of Object.entries(officeNameEnhancements)) {
                if (officeName.includes(abbrev)) {
                    return fullName;
                }
            }

            return officeName;
        }

        // Aggregate contracts by contracting office/agency
        const officeSpending = {};

        allAwards.forEach(award => {
            // Extract office information
            const awardingAgency = award['Awarding Agency'] || 'Unknown Agency';
            const rawAwardingSubAgency = award['Awarding Sub Agency'] || awardingAgency;
            const rawAwardingOffice = award['Awarding Office'] || rawAwardingSubAgency;

            // Enhance office and sub-agency names to full official names
            const awardingSubAgency = enhanceOfficeName(rawAwardingSubAgency);
            const awardingOffice = enhanceOfficeName(rawAwardingOffice);

            const awardingAgencyCode = award['Awarding Agency Code'] || '';
            const awardingSubAgencyCode = award['Awarding Sub Agency Code'] || '';
            const location = award['Place of Performance State Code'] || null;
            const city = award['Place of Performance City Code'] || null;
            const primaryPlaceOfPerformance = award['Primary Place of Performance'] || null;
            const amount = award['Award Amount'] || 0;
            const setAsideType = award['Set-Aside Type'] || 'None';
            // Extract number of offers
            // Note: This field is often null/missing in USAspending API responses
            // as agencies don't always report this data
            let numberOfOffersReceived = award['Number of Offers Received'];
            
            // Handle null/undefined explicitly
            if (numberOfOffersReceived === null || numberOfOffersReceived === undefined) {
                numberOfOffersReceived = null; // Keep as null to distinguish from 0
            } else {
                // Try alternative field names (though USAspending uses the exact field name)
                if (typeof numberOfOffersReceived === 'undefined') {
                    numberOfOffersReceived = award['number_of_offers_received'] || 
                                            award['NumberOfOffersReceived'] || 
                                            null;
                }
            }

            // Use agency slug as office ID (from internal_id or generated_internal_id)
            const officeId = award.agency_slug || award.awarding_agency_id || awardingAgency;

            // Create unique key for this office
            const officeKey = `${officeId}|${awardingSubAgency}|${awardingOffice}`;

            if (!officeSpending[officeKey]) {
                // Create a searchable office identifier for SAM.gov
                // Use sub-agency code if available, otherwise fall back to agency code
                // The format should match what SAM.gov expects for office searches
                const searchableOfficeCode = awardingSubAgencyCode || awardingAgencyCode || '';
                
                officeSpending[officeKey] = {
                    agencyId: officeId,
                    agencyCode: awardingAgencyCode,
                    subAgencyCode: awardingSubAgencyCode,
                    searchableOfficeCode: searchableOfficeCode, // Code for SAM.gov searches
                    contractingOffice: awardingOffice,  // Specific contracting office (may include office code)
                    agencyName: awardingSubAgency,      // Sub-agency (e.g., Dept of Army)
                    parentAgency: awardingAgency,       // Top-level agency (e.g., DoD)
                    location: location,
                    city: city,
                    primaryPlaceOfPerformance: primaryPlaceOfPerformance,
                    totalSpending: 0,
                    setAsideSpending: 0,
                    contractCount: 0,
                    setAsideContractCount: 0,
                    totalOffers: 0,
                    offersData: [] // Array to store individual offers for percentile calculation
                };
            }

            // Add to totals
            officeSpending[officeKey].totalSpending += amount;
            officeSpending[officeKey].contractCount += 1;

            // Track number of offers if available and valid
            // Convert to number and handle various formats (string, number, null, undefined)
            if (numberOfOffersReceived !== null && numberOfOffersReceived !== undefined) {
                let offersValue = 0;
                if (typeof numberOfOffersReceived === 'string') {
                    offersValue = parseInt(numberOfOffersReceived.trim(), 10);
                    if (isNaN(offersValue)) {
                        offersValue = 0; // Invalid string becomes 0
                    }
                } else if (typeof numberOfOffersReceived === 'number') {
                    offersValue = numberOfOffersReceived;
                }
                
                // Only track positive values (0 might indicate no offers, which is valid data)
                // Note: We exclude 0 to avoid skewing averages, but we could include it if needed
                if (offersValue > 0) {
                    officeSpending[officeKey].totalOffers += offersValue;
                    officeSpending[officeKey].offersData.push(offersValue);
                }
            }
            // If null/undefined, we simply don't track it (data not reported)

            // Count set-aside spending
            // If we filtered by set-aside codes, then ALL contracts are set-aside contracts
            // (Even if the Set-Aside Type field is null in the response)
            const filteredBySetAside = setAsideTypeCodes.length > 0;
            const hasSetAsideField = setAsideType && setAsideType !== 'None' && setAsideType !== 'null';
            const isSetAside = filteredBySetAside || hasSetAsideField;

            if (isSetAside) {
                officeSpending[officeKey].setAsideSpending += amount;
                officeSpending[officeKey].setAsideContractCount += 1;
            }
        });

        // Calculate percentiles for bids per contract before converting to array
        console.log('📊 Calculating bids per contract percentiles...');
        let officesWithBidsData = 0;
        let totalOfficesProcessed = 0;
        
        Object.values(officeSpending).forEach(office => {
            totalOfficesProcessed++;
            if (office.offersData && office.offersData.length > 0) {
                officesWithBidsData++;
                // Sort the offers data to calculate percentiles
                office.offersData.sort((a, b) => a - b);
                const len = office.offersData.length;

                // Calculate 5th percentile
                const index5th = Math.max(0, Math.floor(len * 0.05));
                office.bidsPerContract5th = office.offersData[index5th];

                // Calculate average (mean) - round to 1 decimal place for precision
                office.bidsPerContractAvg = Math.round((office.totalOffers / len) * 10) / 10;

                // Calculate 95th percentile
                const index95th = Math.min(len - 1, Math.floor(len * 0.95));
                office.bidsPerContract95th = office.offersData[index95th];
                
                // Debug logging for first few offices with bids data
                if (officesWithBidsData <= 3) {
                    console.log(`  📈 ${office.agencyName}: ${len} contracts with offers data, avg=${office.bidsPerContractAvg}, 5th=${office.bidsPerContract5th}, 95th=${office.bidsPerContract95th}`);
                }
            } else {
                // No offers data available
                office.bidsPerContract5th = null;
                office.bidsPerContractAvg = null;
                office.bidsPerContract95th = null;
            }
        });
        
        console.log(`  ✅ Processed ${totalOfficesProcessed} offices: ${officesWithBidsData} have bids data, ${totalOfficesProcessed - officesWithBidsData} do not`);

        // Get priority filter from query parameter (if coming from homepage)
        const priorityFilter = req.query.priority || null;

        // Convert to array and sort by multiple factors based on user priority
        let topOffices = Object.values(officeSpending)
            .sort((a, b) => {
                // Priority-based sorting based on user selection
                if (priorityFilter === 'business-formation' || priorityFilter === 'veteran') {
                    // Prioritize set-aside spending (offices that award to your business type)
                    if (Math.abs(b.setAsideSpending - a.setAsideSpending) > 1000) {
                        return b.setAsideSpending - a.setAsideSpending;
                    }
                } else if (priorityFilter === 'naics') {
                    // Prioritize total spending in your NAICS category
                    if (Math.abs(b.totalSpending - a.totalSpending) > 1000) {
                        return b.totalSpending - a.totalSpending;
                    }
                    // Secondary: set-aside spending
                    if (Math.abs(b.setAsideSpending - a.setAsideSpending) > 1000) {
                        return b.setAsideSpending - a.setAsideSpending;
                    }
                } else if (priorityFilter === 'state') {
                    // Prioritize offices in target states (location-based)
                    // Note: USAspending doesn't track inTargetState, so we'll use location matching
                    const aInTargetState = a.location && zipCode && getStateFromZip(zipCode) === a.location;
                    const bInTargetState = b.location && zipCode && getStateFromZip(zipCode) === b.location;

                    if (bInTargetState !== aInTargetState) {
                        return bInTargetState ? 1 : -1;
                    }
                    // Secondary: total spending
                    if (Math.abs(b.totalSpending - a.totalSpending) > 1000) {
                        return b.totalSpending - a.totalSpending;
                    }
                } else {
                    // Default: Primary sort by set-aside spending (highest first)
                    if (Math.abs(b.setAsideSpending - a.setAsideSpending) > 1000) {
                        return b.setAsideSpending - a.setAsideSpending;
                    }
                }

                // Tertiary sort: total spending (always fallback)
                return b.totalSpending - a.totalSpending;
            })
            .slice(0, 50); // Top 50 agencies

        console.log(`📈 Aggregated into ${topOffices.length} unique agencies`);
        console.log(`💰 Total set-aside spending: $${(topOffices.reduce((sum, o) => sum + o.setAsideSpending, 0) / 1000000).toFixed(2)}M`);

        // Enhance office names using our lookup function
        console.log('🔍 Enhancing office names...');
        const officeNameLookups = await Promise.allSettled(
            topOffices.map(async (office) => {
                if (!office.agencyId || office.agencyId === 'N/A') return office;

                try {
                    const samOfficeName = await lookupOfficeNameFromSAM(office.agencyId, office.agencyName);
                    if (samOfficeName && samOfficeName !== office.agencyName && samOfficeName.length > 3) {
                        console.log(`   Enhanced: "${office.agencyName}" → "${samOfficeName}"`);
                        return { ...office, agencyName: samOfficeName };
                    }
                } catch (error) {
                    // Silently continue on lookup errors
                }
                return office;
            })
        );

        topOffices = officeNameLookups.map((result, index) =>
            result.status === 'fulfilled' ? result.value : topOffices[index]
        );

        // Enhance USACE entries with district names based on location
        console.log('🏗️ Enhancing USACE entries with district names...');
        topOffices = topOffices.map(office => {
            const isUSACE = office.agencyName && (
                office.agencyName.toUpperCase().includes('USACE') ||
                office.agencyName.toUpperCase().includes('ARMY CORPS OF ENGINEERS') ||
                office.agencyName.toUpperCase().includes('U.S. ARMY ENGINEER')
            );

            if (isUSACE && office.city) {
                const cityUpper = office.city.toUpperCase();

                // USACE District mapping based on primary location
                const districtMap = {
                    'MOBILE': 'Mobile District',
                    'SAVANNAH': 'Savannah District',
                    'JACKSONVILLE': 'Jacksonville District',
                    'CHARLESTON': 'Charleston District',
                    'WILMINGTON': 'Wilmington District',
                    'NORFOLK': 'Norfolk District',
                    'BALTIMORE': 'Baltimore District',
                    'PHILADELPHIA': 'Philadelphia District',
                    'NEW YORK': 'New York District',
                    'NEW ENGLAND': 'New England District',
                    'BUFFALO': 'Buffalo District',
                    'DETROIT': 'Detroit District',
                    'CHICAGO': 'Chicago District',
                    'ROCK ISLAND': 'Rock Island District',
                    'ST. PAUL': 'St. Paul District',
                    'ST. LOUIS': 'St. Louis District',
                    'KANSAS CITY': 'Kansas City District',
                    'OMAHA': 'Omaha District',
                    'NEW ORLEANS': 'New Orleans District',
                    'VICKSBURG': 'Vicksburg District',
                    'MEMPHIS': 'Memphis District',
                    'NASHVILLE': 'Nashville District',
                    'LOUISVILLE': 'Louisville District',
                    'HUNTSVILLE': 'Huntsville Center',
                    'LITTLE ROCK': 'Little Rock District',
                    'TULSA': 'Tulsa District',
                    'FORT WORTH': 'Fort Worth District',
                    'GALVESTON': 'Galveston District',
                    'ALBUQUERQUE': 'Albuquerque District',
                    'LOS ANGELES': 'Los Angeles District',
                    'SAN FRANCISCO': 'San Francisco District',
                    'SACRAMENTO': 'Sacramento District',
                    'PORTLAND': 'Portland District',
                    'SEATTLE': 'Seattle District',
                    'ALASKA': 'Alaska District',
                    'WALLA WALLA': 'Walla Walla District',
                    // Military bases in Georgia -> Mobile District typically handles this region
                    'FORT BENNING': 'Mobile District',
                    'BENNING': 'Mobile District',
                    'FORT MOORE': 'Mobile District',
                    'COLUMBUS': 'Mobile District'  // Columbus, GA (Fort Benning area)
                };

                // Try to match city to a known district
                for (const [location, district] of Object.entries(districtMap)) {
                    if (cityUpper.includes(location) || location.includes(cityUpper)) {
                        const newName = `USACE - ${district}`;
                        console.log(`   Enhanced USACE: "${office.agencyName}" → "${newName}" (based on ${office.city})`);
                        return { ...office, agencyName: newName };
                    }
                }
            }

            return office;
        });

        // Generate search suggestions if results are limited OR search was auto-adjusted
        let suggestions = null;
        if ((topOffices.length < 10 || wasAutoAdjusted) && (naicsCode || businessFormation || zipCode)) {
            console.log('💡 Generating alternative search suggestions...');
            suggestions = await generateSearchSuggestions({
                currentResults: allAwards.length,
                currentAgencies: topOffices.length,
                businessFormation,
                naicsCode,
                zipCode,
                veteranStatus,
                filters,
                fields,
                setAsideMap,
                veteranMap
            });
        }

        // Return results
        const responseData = {
            success: true,
            searchCriteria: {
                businessFormation,
                naicsCode,
                zipCode,
                goodsOrServices,
                veteranStatus
            },
            summary: {
                totalAwards: allAwards.length,
                totalAgencies: topOffices.length,
                totalSpending: topOffices.reduce((sum, a) => sum + a.totalSpending, 0)
            },
            agencies: topOffices.map(office => ({
                agencyId: office.agencyId,
                agencyCode: office.agencyCode,
                subAgencyCode: office.subAgencyCode,
                searchableOfficeCode: office.searchableOfficeCode, // For SAM.gov searches
                contractingOffice: office.contractingOffice,
                agencyName: office.agencyName,
                parentAgency: office.parentAgency,
                location: office.location,
                city: office.city,
                primaryPlaceOfPerformance: office.primaryPlaceOfPerformance,
                totalSpending: office.totalSpending,
                setAsideSpending: office.setAsideSpending,
                contractCount: office.contractCount,
                setAsideContractCount: office.setAsideContractCount,
                bidsPerContract5th: office.bidsPerContract5th,
                bidsPerContractAvg: office.bidsPerContractAvg,
                bidsPerContract95th: office.bidsPerContract95th
            })),
            suggestions: suggestions, // Add suggestions if available
            naicsCorrectionMessage: naicsCorrectionMessage // Add NAICS correction message if applicable
        };

        console.log('✅ Returning results to client');
        res.json(responseData);

    } catch (error) {
        console.error('❌ Government contract search error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to search government contracts',
            message: error.message,
            details: error.response?.data
        });
    }
});

// API endpoint to get USACE mission-specific pain points based on location and office name
app.get('/api/usace-mission-pain-points', async (req, res) => {
    try {
        const { officeName, location } = req.query;
        console.log(`🔍 USACE mission detection request - Office: ${officeName}, Location: ${location}`);

        // Load USACE office-specific pain points data
        const usaceDataPath = path.join(__dirname, 'bootcamp', 'usace-office-specific-pain-points.json');
        const usaceData = JSON.parse(fs.readFileSync(usaceDataPath, 'utf8'));

        let missionArea = null;
        let matchMethod = 'default';

        // Extract location city/state from location parameter (format: "CITY, STATE" or "CITY")
        const locationUpper = (location || '').toUpperCase();
        const locationParts = locationUpper.split(',').map(p => p.trim());
        const locationCity = locationParts[0] || '';

        // 1. Check MILCON offices by location
        const milconLocations = usaceData.district_mappings.milcon_offices.locations;
        for (const [loc, mission] of Object.entries(milconLocations)) {
            // Use more precise matching - only match if location is substantial (3+ chars) and matches
            const locUpper = loc.toUpperCase();
            if (locationCity.length >= 3 && (locationCity.includes(locUpper) || locUpper.includes(locationCity))) {
                missionArea = mission;
                matchMethod = `location:${loc}`;
                break;
            }
        }

        // 2. Check Civil Works districts by location
        if (!missionArea) {
            const civilWorksLocations = usaceData.district_mappings.civil_works_districts.locations;
            for (const [loc, mission] of Object.entries(civilWorksLocations)) {
                const locUpper = loc.toUpperCase();
                if (locationCity.length >= 3 && (locationCity.includes(locUpper) || locUpper.includes(locationCity))) {
                    missionArea = mission;
                    matchMethod = `location:${loc}`;
                    break;
                }
            }
        }

        // 3. Check Environmental offices by location
        if (!missionArea) {
            const envLocations = usaceData.district_mappings.environmental_offices.locations;
            for (const [loc, mission] of Object.entries(envLocations)) {
                const locUpper = loc.toUpperCase();
                if (locationCity.length >= 3 && (locationCity.includes(locUpper) || locUpper.includes(locationCity))) {
                    missionArea = mission;
                    matchMethod = `location:${loc}`;
                    break;
                }
            }
        }

        // 4. Check keywords in office name if no location match
        if (!missionArea && officeName) {
            const officeNameUpper = officeName.toUpperCase();

            // Check MILCON keywords
            const milconKeywords = usaceData.district_mappings.milcon_offices.keywords;
            if (milconKeywords.some(keyword => officeNameUpper.includes(keyword.toUpperCase()))) {
                missionArea = 'military_construction';
                matchMethod = 'keyword:milcon';
            }

            // Check Civil Works keywords
            if (!missionArea) {
                const civilWorksKeywords = usaceData.district_mappings.civil_works_districts.keywords;
                if (civilWorksKeywords.some(keyword => officeNameUpper.includes(keyword.toUpperCase()))) {
                    missionArea = 'civil_works';
                    matchMethod = 'keyword:civil_works';
                }
            }

            // Check Environmental keywords
            if (!missionArea) {
                const envKeywords = usaceData.district_mappings.environmental_offices.keywords;
                if (envKeywords.some(keyword => officeNameUpper.includes(keyword.toUpperCase()))) {
                    missionArea = 'environmental';
                    matchMethod = 'keyword:environmental';
                }
            }
        }

        // 5. Default to Civil Works if no match (most common USACE mission)
        if (!missionArea) {
            missionArea = 'civil_works';
            matchMethod = 'default';
        }

        // Get pain points for the identified mission area
        const missionData = usaceData.usace_mission_areas[missionArea];
        if (!missionData) {
            return res.status(404).json({
                success: false,
                error: `Mission area not found: ${missionArea}`
            });
        }

        // Extract just the pain point text
        const painPoints = missionData.painPoints.map(pp => pp.pain);

        console.log(`✅ USACE mission detected: ${missionArea} (${matchMethod})`);

        res.json({
            success: true,
            missionArea,
            matchMethod,
            description: missionData.description,
            painPoints
        });
    } catch (error) {
        console.error('❌ Error detecting USACE mission:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to detect USACE mission area',
            message: error.message
        });
    }
});

// API endpoint to get agency knowledge base data (pain points, priorities, etc.)
app.get('/api/agency-knowledge-base/:agencyName', async (req, res) => {
    try {
        const agencyName = decodeURIComponent(req.params.agencyName);
        console.log(`📚 Knowledge base request for: ${agencyName}`);

        // Load the agency index to find the right file
        const indexPath = path.join(__dirname, 'bootcamp', 'agencies', 'index.json');
        const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

        // Find the agency file by matching name or aliases
        let agencyFile = null;
        for (const [key, value] of Object.entries(indexData.agencies)) {
            // Check if the agency name matches the key
            if (key.toLowerCase() === agencyName.toLowerCase()) {
                agencyFile = value.file;
                break;
            }
            // Check if it matches any alias
            if (value.aliases && value.aliases.some(alias =>
                alias.toLowerCase() === agencyName.toLowerCase() ||
                agencyName.toLowerCase().includes(alias.toLowerCase())
            )) {
                agencyFile = value.file;
                break;
            }
        }

        if (!agencyFile) {
            console.log(`⚠️ No knowledge base file found for: ${agencyName}`);
            return res.json({
                success: false,
                message: 'No knowledge base data available for this agency yet.',
                agencyName: agencyName
            });
        }

        // Load the agency data
        const agencyPath = path.join(__dirname, 'bootcamp', 'agencies', agencyFile);
        const agencyData = JSON.parse(fs.readFileSync(agencyPath, 'utf8'));

        console.log(`✅ Found knowledge base for ${agencyData.name} (${agencyData.abbreviation})`);

        // Return the agency data
        res.json({
            success: true,
            data: agencyData
        });

    } catch (error) {
        console.error('❌ Error loading agency knowledge base:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load agency knowledge base',
            message: error.message
        });
    }
});

// Expands common abbreviations and improves readability of office names
async function lookupOfficeNameFromSAM(officeId, currentName = '') {
    if (!officeId || officeId === 'N/A') return null;

    // Common office ID to full name mappings
    const officeNameMap = {
        // Department of Homeland Security
        '70SBUR': 'U.S. Citizenship and Immigration Services (USCIS)',
        '70RCSJ': 'Cybersecurity and Infrastructure Security Agency (CISA)',
        '70RCSA': 'Cybersecurity and Infrastructure Security Agency (CISA)',
        '70B06C': 'Department of Homeland Security - Mission Support',
        '70B04C': 'Department of Homeland Security - Information Technology Division',
        '70CMSD': 'Immigration and Customs Enforcement (ICE) - Dallas',
        '70Z023': 'U.S. Coast Guard Headquarters',
        '00042': 'U.S. Coast Guard Training Center Cape May',
        'SS001': 'U.S. Secret Service',
        'TFMSCD': 'U.S. Customs and Border Protection',

        // Department of Defense - Navy
        'N00421': 'Naval Air Warfare Center Aircraft Division',
        'M95494': 'Marine Corps Systems Command',
        'N69450': 'Naval Facilities Engineering Systems Command (NAVFAC) Southeast',
        'N62473': 'Naval Facilities Engineering Systems Command (NAVFAC) Southwest',
        'N40085': 'Naval Facilities Engineering Systems Command (NAVFAC) Mid-Atlantic',

        // Department of Defense - Air Force
        'FA0021': 'Air Force Installation Contracting Agency',
        'FA4830': '23rd Contracting Squadron',
        'HT0011': 'Defense Health Agency',

        // Department of Defense - Army
        'W50S8P': 'U.S. Property and Fiscal Office - Ohio Army National Guard',
        'W9126G': 'U.S. Army Corps of Engineers - Fort Worth District',
        'W91278': 'U.S. Army Corps of Engineers - Mobile District',
        'W912DR': 'U.S. Army Corps of Engineers - Baltimore District',
        'W912PL': 'U.S. Army Corps of Engineers - Los Angeles District',
        'W912DY': 'U.S. Army Engineering Support Center - Huntsville',

        // Department of Commerce
        '1331L5': 'Department of Commerce - Small and Strategic Business Programs Office',
        '1333LB': 'U.S. Census Bureau',
        '1305M2': 'National Oceanic and Atmospheric Administration (NOAA)',
        '1305M3': 'National Oceanic and Atmospheric Administration (NOAA)',

        // Department of Health and Human Services
        '75FCMC': 'Office of Acquisition and Grants Management',
        '75P001': 'Program Support Center Acquisition Management Services',

        // Department of Labor
        '1605TB': 'Department of Labor - Information Technology Acquisition Services',

        // Department of Treasury
        '2033H6': 'Bureau of the Fiscal Service',
        '15JPSS': 'Department of Justice - Procurement Services Staff',

        // General Services Administration
        '47QFCA': 'GSA Federal Acquisition Service - FEDSIM',
        '47PM10': 'GSA Public Buildings Service - Region 11 White House Branch',
        '19AQMM': 'GSA Acquisitions - AQM Momentum',

        // Department of Interior - National Park Service
        '140P20': 'National Park Service - Denver Service Center',
        '140P42': 'National Park Service - Northeast Regional Office',

        // Department of Defense - IT
        'ITCD': 'Information Technology Contracting Division (DISA)',

        // Department of Justice
        '15M102': 'Department of Justice - Procurement Division',

        // Department of Agriculture
        '12505B': 'USDA Agricultural Research Service - Midwest Area',
    };

    // Check exact match first
    if (officeNameMap[officeId]) {
        return officeNameMap[officeId];
    }

    // If we have a current name, try to expand common abbreviations
    if (currentName && currentName.length > 0) {
        return expandOfficeName(currentName);
    }

    return null;
}

// Expand common abbreviations in office names
function expandOfficeName(name) {
    if (!name) return name;

    // Mapping of abbreviations to full names
    const expansions = {
        // Agencies
        'USCIS': 'U.S. Citizenship and Immigration Services',
        'CISA': 'Cybersecurity and Infrastructure Security Agency',
        'DHS': 'Department of Homeland Security',
        'ICE': 'Immigration and Customs Enforcement',
        'CBP': 'U.S. Customs and Border Protection',
        'TSA': 'Transportation Security Administration',
        'FEMA': 'Federal Emergency Management Agency',
        'USSS': 'U.S. Secret Service',

        // DoD Components
        'DOD': 'Department of Defense',
        'USACE': 'U.S. Army Corps of Engineers',
        'NAVFAC': 'Naval Facilities Engineering Systems Command',
        'NAVSEA': 'Naval Sea Systems Command',
        'NAVAIR': 'Naval Air Systems Command',
        'SPAWAR': 'Space and Naval Warfare Systems Command',
        'DISA': 'Defense Information Systems Agency',
        'DLA': 'Defense Logistics Agency',
        'DFAS': 'Defense Finance and Accounting Service',

        // Other Departments
        'GSA': 'General Services Administration',
        'NOAA': 'National Oceanic and Atmospheric Administration',
        'NASA': 'National Aeronautics and Space Administration',
        'EPA': 'Environmental Protection Agency',
        'DOE': 'Department of Energy',
        'DOT': 'Department of Transportation',
        'VA': 'Department of Veterans Affairs',
        'HHS': 'Department of Health and Human Services',
        'FDA': 'Food and Drug Administration',
        'NIH': 'National Institutes of Health',

        // Common Terms
        'PROC': 'Procurement',
        'OPS': 'Operations',
        'MGMT': 'Management',
        'SVCS': 'Services',
        'SVC': 'Service',
        'DIV': 'Division',
        'CNTR': 'Center',
        'CTR': 'Center',
        'DEPT': 'Department',
        'NATL': 'National',
        'INTL': 'International',
        'TECH': 'Technology',
        'INFO': 'Information',
        'ADMIN': 'Administration',
        'ACQN': 'Acquisition',
        'ACQ': 'Acquisition',
        'CONTRACTING OFC': 'Contracting Office',
        'CONTRACTING OFF': 'Contracting Office',
        'CONS': 'Contracting',
        'CC': 'Squadron',
        'OHANG': 'Ohio Army National Guard',
        'ARNG': 'Army National Guard',
        'APC': 'Acquisition Policy and Compliance',
        'AAO': 'Administrative Acquisition Office',
        'MWA': 'Midwest Area',
        'ARS': 'Agricultural Research Service',
        'TRACEN': 'Training Center',
        'PBS': 'Public Buildings Service',
        'R11': 'Region 11',
        'JMD': 'Justice Management Division',
        'ITAS': 'Information Technology Acquisition Services',
        'DOL': 'Department of Labor',

        // Locations
        'HQ': 'Headquarters',
        'HDQTRS': 'Headquarters',
        'NATL': 'National',

        // Specific expansions
        'DSC': 'Denver Service Center',
        'FEDSIM': 'Federal Systems Integration and Management Center',
        'CPOD': 'Cincinnati Procurement Operations Division',
        'USPFO': 'U.S. Property and Fiscal Office',
    };

    let expanded = name;

    // Replace abbreviations (case-insensitive, whole word matching)
    for (const [abbr, full] of Object.entries(expansions)) {
        // Match whole words only (surrounded by word boundaries or specific chars)
        const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
        expanded = expanded.replace(regex, full);
    }

    // Clean up extra spaces
    expanded = expanded.replace(/\s+/g, ' ').trim();

    return expanded;
}

// Helper function to map zip code to state (simplified version)
function getStateFromZip(zipCode) {
    if (!zipCode || zipCode.length < 5) return null;
    const zip = parseInt(zipCode.substring(0, 5)); // Use first 5 digits

    // Basic zip code to state mapping (simplified)
    const zipRanges = {
        'AL': [[35000, 36999]], 'AK': [[99500, 99999]], 'AZ': [[85000, 86599]],
        'AR': [[71600, 72999]], 'CA': [[90000, 96199]], 'CO': [[80000, 81699]],
        'CT': [[6000, 6999]], 'DE': [[19700, 19999]], 'FL': [[32000, 34999]],
        'GA': [[30000, 31999]], 'HI': [[96700, 96899]], 'ID': [[83200, 83899]],
        'IL': [[60000, 62999]], 'IN': [[46000, 47999]], 'IA': [[50000, 52999]],
        'KS': [[66000, 67999]], 'KY': [[40000, 42799]], 'LA': [[70000, 71599]],
        'ME': [[3900, 4999]], 'MD': [[20600, 21999]], 'MA': [[1000, 2799]],
        'MI': [[48000, 49999]], 'MN': [[55000, 56799]], 'MS': [[38600, 39799]],
        'MO': [[63000, 65899]], 'MT': [[59000, 59999]], 'NE': [[68000, 69399]],
        'NV': [[88900, 89899]], 'NH': [[3000, 3899]], 'NJ': [[7000, 8999]],
        'NM': [[87000, 88499]], 'NY': [[10000, 14999]], 'NC': [[27000, 28999]],
        'ND': [[58000, 58899]], 'OH': [[43000, 45999]], 'OK': [[73000, 74999]],
        'OR': [[97000, 97999]], 'PA': [[15000, 19699]], 'RI': [[2800, 2999]],
        'SC': [[29000, 29999]], 'SD': [[57000, 57799]], 'TN': [[37000, 38599]],
        'TX': [[75000, 79999], [88500, 88599]], 'UT': [[84000, 84799]],
        'VT': [[5000, 5999]], 'VA': [[20100, 20199], [22000, 24699]],
        'WA': [[98000, 99499]], 'WV': [[24700, 26899]], 'WI': [[53000, 54999]],
        'WY': [[82000, 83199]], 'DC': [[20000, 20099], [20200, 20599]]
    };

    for (const [state, ranges] of Object.entries(zipRanges)) {
        for (const [min, max] of ranges) {
            if (zip >= min && zip <= max) {
                return state;
            }
        }
    }

    return null;
}

// Helper function to convert state code to full name for FPDS
function getStateName(stateCode) {
    const stateNames = {
        'AL': 'ALABAMA', 'AK': 'ALASKA', 'AZ': 'ARIZONA', 'AR': 'ARKANSAS',
        'CA': 'CALIFORNIA', 'CO': 'COLORADO', 'CT': 'CONNECTICUT', 'DE': 'DELAWARE',
        'FL': 'FLORIDA', 'GA': 'GEORGIA', 'HI': 'HAWAII', 'ID': 'IDAHO',
        'IL': 'ILLINOIS', 'IN': 'INDIANA', 'IA': 'IOWA', 'KS': 'KANSAS',
        'KY': 'KENTUCKY', 'LA': 'LOUISIANA', 'ME': 'MAINE', 'MD': 'MARYLAND',
        'MA': 'MASSACHUSETTS', 'MI': 'MICHIGAN', 'MN': 'MINNESOTA', 'MS': 'MISSISSIPPI',
        'MO': 'MISSOURI', 'MT': 'MONTANA', 'NE': 'NEBRASKA', 'NV': 'NEVADA',
        'NH': 'NEW HAMPSHIRE', 'NJ': 'NEW JERSEY', 'NM': 'NEW MEXICO', 'NY': 'NEW YORK',
        'NC': 'NORTH CAROLINA', 'ND': 'NORTH DAKOTA', 'OH': 'OHIO', 'OK': 'OKLAHOMA',
        'OR': 'OREGON', 'PA': 'PENNSYLVANIA', 'RI': 'RHODE ISLAND', 'SC': 'SOUTH CAROLINA',
        'SD': 'SOUTH DAKOTA', 'TN': 'TENNESSEE', 'TX': 'TEXAS', 'UT': 'UTAH',
        'VT': 'VERMONT', 'VA': 'VIRGINIA', 'WA': 'WASHINGTON', 'WV': 'WEST VIRGINIA',
        'WI': 'WISCONSIN', 'WY': 'WYOMING', 'DC': 'DISTRICT OF COLUMBIA'
    };
    return stateNames[stateCode] || stateCode;
}

// Helper function to get region states
function getRegionStates(state) {
    // Define US regions
    const regions = {
        'Northeast': ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'PA'],
        'Southeast': ['DE', 'MD', 'VA', 'WV', 'KY', 'TN', 'NC', 'SC', 'GA', 'FL', 'AL', 'MS', 'AR', 'LA'],
        'Midwest': ['OH', 'MI', 'IN', 'IL', 'WI', 'MN', 'IA', 'MO', 'ND', 'SD', 'NE', 'KS'],
        'Southwest': ['TX', 'OK', 'NM', 'AZ'],
        'West': ['CO', 'WY', 'MT', 'ID', 'UT', 'NV', 'CA', 'OR', 'WA', 'AK', 'HI']
    };
    
    // Find which region the state belongs to
    for (const [regionName, states] of Object.entries(regions)) {
        if (states.includes(state)) {
            return states;
        }
    }
    return [];
}

// Helper function to get bordering states
function getBorderingStates(state) {
    const borders = {
        'AL': ['FL', 'GA', 'MS', 'TN'],
        'AK': [],
        'AZ': ['CA', 'NV', 'UT', 'NM'],
        'AR': ['LA', 'MS', 'MO', 'OK', 'TN', 'TX'],
        'CA': ['AZ', 'NV', 'OR'],
        'CO': ['KS', 'NE', 'NM', 'OK', 'UT', 'WY'],
        'CT': ['MA', 'NY', 'RI'],
        'DE': ['MD', 'NJ', 'PA'],
        'FL': ['AL', 'GA'],
        'GA': ['AL', 'FL', 'NC', 'SC', 'TN'],
        'HI': [],
        'ID': ['MT', 'NV', 'OR', 'UT', 'WA', 'WY'],
        'IL': ['IN', 'IA', 'KY', 'MO', 'WI'],
        'IN': ['IL', 'KY', 'MI', 'OH'],
        'IA': ['IL', 'MN', 'MO', 'NE', 'SD', 'WI'],
        'KS': ['CO', 'MO', 'NE', 'OK'],
        'KY': ['IL', 'IN', 'MO', 'OH', 'TN', 'VA', 'WV'],
        'LA': ['AR', 'MS', 'TX'],
        'ME': ['NH'],
        'MD': ['DE', 'PA', 'VA', 'WV', 'DC'],
        'MA': ['CT', 'NH', 'NY', 'RI', 'VT'],
        'MI': ['IN', 'OH', 'WI'],
        'MN': ['IA', 'ND', 'SD', 'WI'],
        'MS': ['AL', 'AR', 'LA', 'TN'],
        'MO': ['AR', 'IL', 'IA', 'KS', 'KY', 'NE', 'OK', 'TN'],
        'MT': ['ID', 'ND', 'SD', 'WY'],
        'NE': ['CO', 'IA', 'KS', 'MO', 'SD', 'WY'],
        'NV': ['AZ', 'CA', 'ID', 'OR', 'UT'],
        'NH': ['ME', 'MA', 'VT'],
        'NJ': ['DE', 'NY', 'PA'],
        'NM': ['AZ', 'CO', 'OK', 'TX'],
        'NY': ['CT', 'MA', 'NJ', 'PA', 'VT'],
        'NC': ['GA', 'SC', 'TN', 'VA'],
        'ND': ['MN', 'MT', 'SD'],
        'OH': ['IN', 'KY', 'MI', 'PA', 'WV'],
        'OK': ['AR', 'CO', 'KS', 'MO', 'NM', 'TX'],
        'OR': ['CA', 'ID', 'NV', 'WA'],
        'PA': ['DE', 'MD', 'NJ', 'NY', 'OH', 'WV'],
        'RI': ['CT', 'MA'],
        'SC': ['GA', 'NC'],
        'SD': ['IA', 'MN', 'MT', 'NE', 'ND', 'WY'],
        'TN': ['AL', 'AR', 'GA', 'KY', 'MS', 'MO', 'NC', 'VA'],
        'TX': ['AR', 'LA', 'NM', 'OK'],
        'UT': ['AZ', 'CO', 'ID', 'NV', 'WY'],
        'VT': ['MA', 'NH', 'NY'],
        'VA': ['KY', 'MD', 'NC', 'TN', 'WV', 'DC'],
        'WA': ['ID', 'OR'],
        'WV': ['KY', 'MD', 'OH', 'PA', 'VA'],
        'WI': ['IL', 'IA', 'MI', 'MN'],
        'WY': ['CO', 'ID', 'MT', 'NE', 'SD', 'UT'],
        'DC': ['MD', 'VA']
    };

    return borders[state] || [];
}

// Target Market Report API: Generate comprehensive market analysis report
app.post('/api/target-market-report/generate', async (req, res) => {
    try {
        const { scoutData, businessFormation, naicsCode, companyName, zipCode, veteranStatus, goodsOrServices } = req.body;

        console.log('📊 Generating Target Market Report...');

        // Load agency pain points database
        const painPointsPath = path.join(__dirname, 'bootcamp', 'agency-pain-points.json');
        const painPointsData = JSON.parse(fs.readFileSync(painPointsPath, 'utf8'));

        // Helper function to match agency name to pain points
        function findAgencyPainPoints(agencyName, parentAgency) {
            const agencies = painPointsData.agencies;
            
            // Try exact match first
            if (agencies[agencyName]) {
                return agencies[agencyName].painPoints || [];
            }
            
            // Try parent agency
            if (parentAgency && agencies[parentAgency]) {
                return agencies[parentAgency].painPoints || [];
            }
            
            // Try partial matches (e.g., "NAVFAC" in "NAVFAC Atlantic")
            for (const [key, value] of Object.entries(agencies)) {
                if (agencyName.includes(key) || key.includes(agencyName)) {
                    return value.painPoints || [];
                }
            }
            
            // Try Department-level match
            if (agencyName.includes('Department of Defense') || parentAgency?.includes('Department of Defense')) {
                return agencies['Department of Defense']?.painPoints || [];
            }
            if (agencyName.includes('Department of the Navy') || parentAgency?.includes('Department of the Navy')) {
                return agencies['Department of the Navy']?.painPoints || [];
            }
            if (agencyName.includes('Department of the Army') || parentAgency?.includes('Department of the Army')) {
                return agencies['Department of the Army']?.painPoints || [];
            }
            if (agencyName.includes('Department of the Air Force') || parentAgency?.includes('Department of the Air Force')) {
                return agencies['Department of the Air Force']?.painPoints || [];
            }
            
            return [];
        }

        // Process agencies from Opportunity Scout data
        const agencies = scoutData.agencies || [];
        const topAgencies = agencies.slice(0, 10).map(agency => {
            const agencyName = typeof agency.agencyName === 'string' ? agency.agencyName : 
                              (agency.agencyName?._ || 'Unknown Agency');
            const parentAgency = agency.parentAgency || '';
            
            return {
                name: agencyName,
                parentAgency: parentAgency,
                setAsideSpending: agency.setAsideSpending || 0,
                totalSpending: agency.totalSpending || 0,
                contractCount: agency.setAsideContractCount || 0,
                officeId: agency.searchableOfficeCode || agency.subAgencyCode || 'N/A',
                samGovUrl: `https://sam.gov/search/?index=opp&q=${encodeURIComponent(agencyName)}`,
                painPoints: findAgencyPainPoints(agencyName, parentAgency)
            };
        });

        // Calculate summary statistics
        const totalSpending = agencies.reduce((sum, a) => sum + (a.setAsideSpending || 0), 0);
        const totalContracts = agencies.reduce((sum, a) => sum + (a.setAsideContractCount || 0), 0);

        // Generate executive summary
        const businessTypeLabel = businessFormation ? businessFormation.split('-').map(w => 
            w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Small Business';
        
        const executiveSummary = `Based on your ${businessTypeLabel} profile and NAICS code ${naicsCode}, we've identified ${agencies.length} target agencies with significant contracting opportunities. 
        These agencies have awarded $${(totalSpending / 1000000).toFixed(2)}M in set-aside contracts over the past 3 years, representing ${totalContracts} contract opportunities. 
        This report provides strategic insights, agency pain points, and actionable recommendations to help you win more government contracts.`;

        // Generate market opportunities
        const opportunities = [];
        
        // Group by agency type
        const agencyGroups = {};
        topAgencies.forEach(agency => {
            const group = agency.parentAgency || 'Other Agencies';
            if (!agencyGroups[group]) {
                agencyGroups[group] = [];
            }
            agencyGroups[group].push(agency.name);
        });

        Object.entries(agencyGroups).slice(0, 5).forEach(([group, names]) => {
            opportunities.push({
                title: `${group} - High Contract Volume`,
                description: `${group} has awarded significant contracts matching your profile. Focus on building relationships with these agencies' small business offices.`,
                agencies: names.slice(0, 3)
            });
        });

        // Generate strategic recommendations
        const recommendations = [
            {
                title: 'Prioritize Top 5 Agencies',
                description: `Focus your outreach efforts on the top 5 agencies identified in this report. These agencies have the highest set-aside spending in your NAICS category.`,
                actionItems: [
                    'Contact SBLOs from top 5 agencies within 30 days',
                    'Create agency-specific capability statements',
                    'Attend industry days for these agencies',
                    'Monitor SAM.gov for opportunities from these offices'
                ]
            },
            {
                title: 'Address Agency Pain Points',
                description: `Each agency has specific pain points that create opportunities. Tailor your approach to address these challenges directly.`,
                actionItems: [
                    'Review pain points for each target agency',
                    'Update your capability statements to address specific pain points',
                    'Position your solutions as solving their problems',
                    'Use agency terminology in your communications'
                ]
            },
            {
                title: 'Leverage Your Certifications',
                description: `${businessTypeLabel} status gives you access to set-aside contracts with less competition.`,
                actionItems: [
                    'Highlight your certification in all communications',
                    'Search for set-aside opportunities on SAM.gov',
                    'Join agency small business programs',
                    'Network with other certified businesses'
                ]
            },
            {
                title: 'Build Relationships Proactively',
                description: `Agencies struggle to find qualified small businesses. Make yourself easy to find and match.`,
                actionItems: [
                    'Complete SAM.gov registration with detailed capabilities',
                    'Register in agency vendor systems',
                    'Attend matchmaking events and industry days',
                    'Follow up regularly with SBLOs'
                ]
            }
        ];

        // Competitive analysis
        const competitiveAnalysis = {
            summary: `As a ${businessTypeLabel}, you have access to set-aside contracts with significantly less competition than full-and-open competitions. The agencies in this report actively seek businesses like yours to meet their small business goals.`,
            advantages: [
                'Access to set-aside contracts with less competition',
                'Agencies actively seeking your business type',
                'Potential for faster procurement processes',
                'Opportunity to build long-term relationships'
            ],
            considerations: [
                'Ensure your capabilities clearly match agency needs',
                'Be prepared to demonstrate past performance',
                'Understand agency-specific requirements',
                'Build relationships before opportunities arise'
            ]
        };

        // Next steps
        const nextSteps = [
            'Review the top 10 target agencies and their pain points',
            'Create agency-specific capability statements for top 5 agencies',
            'Contact SBLOs from top 5 agencies within the next 2 weeks',
            'Register for upcoming industry days and matchmaking events',
            'Set up SAM.gov alerts for opportunities from target agencies',
            'Track your outreach and follow up regularly'
        ];

        // Generate report
        const report = {
            companyName: companyName || 'Your Company',
            generatedDate: new Date().toISOString(),
            searchCriteria: {
                businessFormation,
                naicsCode,
                zipCode,
                veteranStatus,
                goodsOrServices
            },
            executiveSummary,
            summaryStats: {
                totalAgencies: agencies.length,
                totalSpending: totalSpending,
                totalContracts: totalContracts
            },
            topAgencies,
            opportunities,
            recommendations,
            competitiveAnalysis,
            nextSteps
        };

        console.log('✅ Target Market Report generated successfully');
        res.json(report);

    } catch (error) {
        console.error('❌ Error generating Target Market Report:', error);
        res.status(500).json({ 
            error: 'Failed to generate report',
            message: error.message 
        });
    }
});

// Comprehensive Market Report API: Generate ALL 8 reports at once for selected agencies
app.post('/api/comprehensive-report/generate-all', async (req, res) => {
    try {
        const { 
            selectedAgencies,
            scoutData,
            businessFormation, 
            naicsCode, 
            companyName, 
            zipCode, 
            veteranStatus, 
            goodsOrServices
        } = req.body;

        console.log(`📊 Generating all 8 reports for ${selectedAgencies.length} selected agencies...`);

        // Load agency pain points database
        const painPointsPath = path.join(__dirname, 'bootcamp', 'agency-pain-points.json');
        const painPointsData = JSON.parse(fs.readFileSync(painPointsPath, 'utf8'));

        // Helper function to match agency name to pain points
        function findAgencyPainPoints(agencyName, parentAgency) {
            const agencies = painPointsData.agencies;
            if (agencies[agencyName]) return agencies[agencyName].painPoints || [];
            if (parentAgency && agencies[parentAgency]) return agencies[parentAgency].painPoints || [];
            for (const [key, value] of Object.entries(agencies)) {
                if (agencyName.includes(key) || key.includes(agencyName)) {
                    return value.painPoints || [];
                }
            }
            return [];
        }

        // Process selected agencies
        const processedAgencies = selectedAgencies.map(agency => {
            const agencyNameStr = typeof agency.agencyName === 'string' ? agency.agencyName : 
                                (agency.agencyName?._ || 'Unknown Agency');
            const parentAgency = agency.parentAgency || '';
            
            return {
                name: agencyNameStr,
                parentAgency: parentAgency,
                setAsideSpending: agency.setAsideSpending || 0,
                totalSpending: agency.totalSpending || 0,
                contractCount: agency.setAsideContractCount || 0,
                officeId: agency.searchableOfficeCode || agency.subAgencyCode || 'N/A',
                samGovUrl: `https://sam.gov/search/?index=opp&q=${encodeURIComponent(agencyNameStr)}`,
                painPoints: findAgencyPainPoints(agencyNameStr, parentAgency),
                location: agency.location || '',
                city: agency.primaryPlaceOfPerformance?.city_name || ''
            };
        });

        const totalSpending = processedAgencies.reduce((sum, a) => sum + a.setAsideSpending, 0);
        const totalContracts = processedAgencies.reduce((sum, a) => sum + a.contractCount, 0);

        // Generate ALL 8 reports
        const reportParams = { businessFormation, naicsCode, companyName, painPointsData };
        const allReports = {
            governmentBuyers: generateGovernmentBuyersReport(processedAgencies, reportParams),
            tier2: generateTier2Report(processedAgencies, reportParams),
            forecast: generateForecastReport(processedAgencies, reportParams),
            agencyNeeds: generateAgencyNeedsReport(processedAgencies, painPointsData, reportParams),
            painPoints: generatePainPointsReport(processedAgencies, painPointsData, reportParams),
            decemberSpend: generateDecemberSpendReport(processedAgencies, reportParams),
            tribes: generateTribesReport(processedAgencies, reportParams),
            primes: generatePrimesReport(processedAgencies, reportParams)
        };

        console.log('✅ All 8 reports generated successfully');
        res.json(allReports);

    } catch (error) {
        console.error('❌ Error generating comprehensive reports:', error);
        res.status(500).json({ 
            error: 'Failed to generate reports',
            message: error.message 
        });
    }
});

// Comprehensive Market Report API: Generate reports for all 8 report types (legacy - single report)
app.post('/api/comprehensive-report/generate', async (req, res) => {
    try {
        const { 
            reportType, 
            scoutData, 
            businessFormation, 
            naicsCode, 
            companyName, 
            zipCode, 
            veteranStatus, 
            goodsOrServices,
            // Type-specific fields
            agencyName,
            officeCode,
            primeCompany,
            contractValue,
            fiscalYear,
            agencyFilter,
            needType,
            capabilityFocus,
            spendThreshold,
            tribeName,
            tribalCertification,
            contractType
        } = req.body;

        console.log(`📊 Generating ${reportType} report...`);

        // Load agency pain points database
        const painPointsPath = path.join(__dirname, 'bootcamp', 'agency-pain-points.json');
        const painPointsData = JSON.parse(fs.readFileSync(painPointsPath, 'utf8'));

        // Helper function to match agency name to pain points
        function findAgencyPainPoints(agencyName, parentAgency) {
            const agencies = painPointsData.agencies;
            if (agencies[agencyName]) return agencies[agencyName].painPoints || [];
            if (parentAgency && agencies[parentAgency]) return agencies[parentAgency].painPoints || [];
            for (const [key, value] of Object.entries(agencies)) {
                if (agencyName.includes(key) || key.includes(agencyName)) {
                    return value.painPoints || [];
                }
            }
            return [];
        }

        // Process agencies from Opportunity Scout data
        const agencies = scoutData.agencies || [];
        const processedAgencies = agencies.map(agency => {
            const agencyNameStr = typeof agency.agencyName === 'string' ? agency.agencyName : 
                                (agency.agencyName?._ || 'Unknown Agency');
            const parentAgency = agency.parentAgency || '';
            
            return {
                name: agencyNameStr,
                parentAgency: parentAgency,
                setAsideSpending: agency.setAsideSpending || 0,
                totalSpending: agency.totalSpending || 0,
                contractCount: agency.setAsideContractCount || 0,
                officeId: agency.searchableOfficeCode || agency.subAgencyCode || 'N/A',
                samGovUrl: `https://sam.gov/search/?index=opp&q=${encodeURIComponent(agencyNameStr)}`,
                painPoints: findAgencyPainPoints(agencyNameStr, parentAgency),
                location: agency.location || '',
                city: agency.primaryPlaceOfPerformance?.city_name || ''
            };
        });

        const totalSpending = agencies.reduce((sum, a) => sum + (a.setAsideSpending || 0), 0);
        const totalContracts = agencies.reduce((sum, a) => sum + (a.setAsideContractCount || 0), 0);

        // Generate report based on type
        let report;
        
        switch(reportType) {
            case 'government-buyers':
                report = generateGovernmentBuyersReport(processedAgencies, { agencyName, officeCode, businessFormation, naicsCode, companyName });
                break;
            case 'tier2':
                report = generateTier2Report(processedAgencies, { primeCompany, contractValue, businessFormation, naicsCode, companyName });
                break;
            case 'forecast':
                report = generateForecastReport(processedAgencies, { fiscalYear, agencyFilter, businessFormation, naicsCode, companyName });
                break;
            case 'agency-needs':
                report = generateAgencyNeedsReport(processedAgencies, painPointsData, { agencyName, needType, businessFormation, naicsCode, companyName });
                break;
            case 'pain-points':
                report = generatePainPointsReport(processedAgencies, painPointsData, { agencyName, capabilityFocus, businessFormation, naicsCode, companyName });
                break;
            case 'december-spend':
                report = generateDecemberSpendReport(processedAgencies, { fiscalYear, spendThreshold, businessFormation, naicsCode, companyName });
                break;
            case 'tribes':
                report = generateTribesReport(processedAgencies, { tribeName, tribalCertification, businessFormation, naicsCode, companyName });
                break;
            case 'primes':
                report = generatePrimesReport(processedAgencies, { primeCompany, contractType, businessFormation, naicsCode, companyName });
                break;
            default:
                throw new Error('Invalid report type');
        }

        console.log(`✅ ${reportType} report generated successfully`);
        res.json(report);

    } catch (error) {
        console.error('❌ Error generating comprehensive report:', error);
        res.status(500).json({ 
            error: 'Failed to generate report',
            message: error.message 
        });
    }
});

// Report Generator Functions
function generateGovernmentBuyersReport(agencies, params) {
    const topAgencies = agencies.slice(0, 15);
    
    return {
        reportType: 'government-buyers',
        reportTitle: 'Government Buyers Report',
        companyName: params.companyName || 'Your Company',
        generatedDate: new Date().toISOString(),
        executiveSummary: `This report identifies ${topAgencies.length} contracting offices and decision makers who award contracts matching your ${params.businessFormation || 'small business'} profile in NAICS ${params.naicsCode}. These offices have awarded $${(agencies.reduce((s, a) => s + a.setAsideSpending, 0) / 1000000).toFixed(2)}M in set-aside contracts.`,
        summaryStats: {
            totalOffices: topAgencies.length,
            totalSpending: agencies.reduce((s, a) => s + a.setAsideSpending, 0),
            totalContracts: agencies.reduce((s, a) => s + a.contractCount, 0)
        },
        contractingOffices: topAgencies.map(agency => ({
            officeName: agency.name,
            parentAgency: agency.parentAgency,
            officeId: agency.officeId,
            setAsideSpending: agency.setAsideSpending,
            contractCount: agency.contractCount,
            location: agency.location || agency.city,
            samGovUrl: agency.samGovUrl,
            contactStrategy: `Contact the Small Business Liaison Officer (SBLO) at ${agency.parentAgency || agency.name} to discuss opportunities.`
        })),
        recommendations: [
            {
                title: 'Identify SBLO Contacts',
                description: 'Each contracting office has a Small Business Liaison Officer responsible for connecting small businesses with opportunities.',
                actionItems: [
                    'Search agency websites for SBLO contact information',
                    'Attend agency small business outreach events',
                    'Request capability statement review meetings',
                    'Follow up quarterly with SBLOs'
                ]
            },
            {
                title: 'Build Relationships Before Opportunities',
                description: 'Government buyers prefer working with businesses they know and trust.',
                actionItems: [
                    'Reach out proactively, not just when opportunities are posted',
                    'Share relevant case studies and past performance',
                    'Offer to help solve their pain points',
                    'Maintain regular communication'
                ]
            }
        ],
        reportHTML: generateReportHTML('government-buyers', {
            contractingOffices: topAgencies,
            summaryStats: {
                totalOffices: topAgencies.length,
                totalSpending: agencies.reduce((s, a) => s + a.setAsideSpending, 0),
                totalContracts: agencies.reduce((s, a) => s + a.contractCount, 0)
            }
        })
    };
}

function generateTier2Report(agencies, params) {
    // Suggest primes based on agency pain points and NAICS
    const suggestedPrimes = suggestPrimesForAgencies(agencies, params);
    
    return {
        reportType: 'tier2',
        reportTitle: 'Tier 2 Subcontracting Report',
        companyName: params.companyName || 'Your Company',
        generatedDate: new Date().toISOString(),
        executiveSummary: `This report identifies Tier 2 subcontracting opportunities with prime contractors working with your ${agencies.length} target agencies. As a ${params.businessFormation || 'small business'}, you can partner with primes to access larger contracts.`,
        suggestedPrimes: suggestedPrimes,
        recommendations: [
            {
                title: 'Register in Prime Contractor Portals',
                description: 'Most large primes have supplier registration systems.',
                actionItems: [
                    'Register in prime contractor supplier portals',
                    'Attend prime contractor small business events',
                    'Submit capability statements to primes',
                    'Network at industry events'
                ]
            }
        ],
        reportHTML: generateTier2ReportHTML(suggestedPrimes, agencies)
    };
}

function suggestPrimesForAgencies(agencies, params) {
    // Analyze agency pain points to suggest relevant primes
    const primeSuggestions = [];
    const naics = params.naicsCode || '';
    
    // Common primes by industry
    const primesByIndustry = {
        '541': ['Booz Allen Hamilton', 'Deloitte', 'Accenture', 'IBM', 'Leidos'],
        '236': ['Hensel Phelps', 'Turner Construction', 'Bechtel', 'Fluor'],
        '237': ['AECOM', 'Jacobs Engineering', 'CH2M Hill'],
        '238': ['EMCOR Group', 'Tutor Perini', 'Granite Construction'],
        '561': ['CACI', 'ManTech', 'SAIC', 'General Dynamics'],
        '518': ['Amazon Web Services', 'Microsoft', 'Google Cloud', 'Oracle']
    };
    
    // Get NAICS prefix
    const naicsPrefix = naics.substring(0, 3);
    const suggestedPrimes = primesByIndustry[naicsPrefix] || ['Booz Allen Hamilton', 'Lockheed Martin', 'Leidos', 'CACI', 'SAIC'];
    
    // Analyze agency pain points to refine suggestions
    agencies.forEach(agency => {
        if (agency.painPoints && agency.painPoints.length > 0) {
            agency.painPoints.forEach(pp => {
                if (pp.includes('Cybersecurity') || pp.includes('IT')) {
                    suggestedPrimes.push('Booz Allen Hamilton', 'CACI', 'ManTech');
                }
                if (pp.includes('Construction') || pp.includes('Infrastructure')) {
                    suggestedPrimes.push('Hensel Phelps', 'Turner Construction', 'AECOM');
                }
            });
        }
    });
    
    // Remove duplicates and create prime objects
    const uniquePrimes = [...new Set(suggestedPrimes)];
    
    return uniquePrimes.slice(0, 10).map(prime => ({
        name: prime,
        description: `Prime contractor working with agencies matching your profile`,
        opportunities: getOpportunitiesForPrime(prime, naics),
        contactStrategy: `Register in ${prime} supplier portal and attend small business events`,
        relevantAgencies: agencies.slice(0, 3).map(a => a.name)
    }));
}

function getOpportunitiesForPrime(prime, naics) {
    const opportunities = {
        'Booz Allen Hamilton': 'Cybersecurity, data analytics, IT modernization, consulting',
        'Lockheed Martin': 'IT services, engineering support, professional services',
        'Leidos': 'IT modernization, cybersecurity, health IT',
        'CACI': 'IT services, cybersecurity, intelligence support',
        'SAIC': 'IT services, engineering, technical support',
        'Deloitte': 'Consulting, IT modernization, financial services',
        'Accenture': 'IT services, digital transformation, consulting',
        'IBM': 'IT services, cloud computing, AI/ML',
        'Hensel Phelps': 'Construction, facilities management',
        'Turner Construction': 'Construction, project management',
        'AECOM': 'Engineering, construction, infrastructure',
        'Jacobs Engineering': 'Engineering, construction, environmental',
        'ManTech': 'IT services, cybersecurity, intelligence',
        'General Dynamics': 'IT services, engineering, defense',
        'Amazon Web Services': 'Cloud computing, IT infrastructure',
        'Microsoft': 'Cloud computing, software, IT services',
        'Google Cloud': 'Cloud computing, AI/ML, data analytics',
        'Oracle': 'Database, cloud computing, IT services'
    };
    return opportunities[prime] || 'IT services, professional services, consulting';
}

function generateForecastReport(agencies, params) {
    return {
        reportType: 'forecast',
        reportTitle: `FY${params.fiscalYear || '2026'} Forecast List Report`,
        companyName: params.companyName || 'Your Company',
        generatedDate: new Date().toISOString(),
        executiveSummary: `This report identifies forecasted opportunities for FY${params.fiscalYear || '2026'} from agencies matching your profile.`,
        forecastedOpportunities: agencies.slice(0, 20).map(agency => ({
            agency: agency.name,
            parentAgency: agency.parentAgency,
            estimatedValue: agency.setAsideSpending * 0.3, // Estimate 30% of past spending
            expectedQuarter: 'Q1-Q4 FY' + (params.fiscalYear || '2026'),
            naicsCode: params.naicsCode,
            setAsideType: params.businessFormation
        })),
        recommendations: [
            {
                title: 'Monitor Agency Forecast Lists',
                description: 'Agencies publish forecast lists showing planned procurements.',
                actionItems: [
                    'Check agency forecast lists quarterly',
                    'Set up SAM.gov alerts for forecasted opportunities',
                    'Contact agencies before solicitations are released',
                    'Prepare capability statements in advance'
                ]
            }
        ],
        reportHTML: generateReportHTML('forecast', {})
    };
}

function generateAgencyNeedsReport(agencies, painPointsData, params) {
    const topAgencies = agencies.slice(0, 10).map(agency => ({
        ...agency,
        needs: agency.painPoints.slice(0, 5)
    }));
    
    return {
        reportType: 'agency-needs',
        reportTitle: 'Agency Needs Report',
        companyName: params.companyName || 'Your Company',
        generatedDate: new Date().toISOString(),
        executiveSummary: `This report identifies specific needs and requirements from ${topAgencies.length} target agencies matching your capabilities.`,
        agencyNeeds: topAgencies,
        recommendations: [
            {
                title: 'Match Your Capabilities to Agency Needs',
                description: 'Position your solutions to directly address identified agency needs.',
                actionItems: [
                    'Update capability statements to address specific needs',
                    'Use agency terminology when describing solutions',
                    'Provide examples of how you solve similar challenges',
                    'Reference agency strategic plans'
                ]
            }
        ],
        reportHTML: generateReportHTML('agency-needs', { agencyNeeds: topAgencies })
    };
}

function generatePainPointsReport(agencies, painPointsData, params) {
    const topAgencies = agencies.slice(0, 10);
    
    return {
        reportType: 'pain-points',
        reportTitle: 'Agency Pain Points Report',
        companyName: params.companyName || 'Your Company',
        generatedDate: new Date().toISOString(),
        executiveSummary: `This report matches your capabilities to agency pain points across ${topAgencies.length} target agencies.`,
        agenciesWithPainPoints: topAgencies.map(agency => ({
            name: agency.name,
            parentAgency: agency.parentAgency,
            painPoints: agency.painPoints,
            setAsideSpending: agency.setAsideSpending,
            opportunityMatch: `Your ${params.capabilityFocus || 'capabilities'} directly address ${agency.painPoints.length} identified pain points.`
        })),
        recommendations: [
            {
                title: 'Address Pain Points in Your Outreach',
                description: 'Agencies are actively seeking solutions to their pain points.',
                actionItems: [
                    'Reference specific pain points in capability statements',
                    'Show how you solve their challenges',
                    'Use pain point language in proposals',
                    'Position yourself as a solution provider'
                ]
            }
        ],
        reportHTML: generateReportHTML('pain-points', { agenciesWithPainPoints: topAgencies })
    };
}

function generateDecemberSpendReport(agencies, params) {
    // Focus on Q4 spending (July-September)
    const q4Agencies = agencies.filter(a => a.setAsideSpending > (parseInt(params.spendThreshold) || 50000));
    
    return {
        reportType: 'december-spend',
        reportTitle: `FY${params.fiscalYear || '2026'} December Spend Forecast`,
        companyName: params.companyName || 'Your Company',
        generatedDate: new Date().toISOString(),
        executiveSummary: `This report identifies end-of-year spending opportunities. Agencies must spend allocated budgets by September 30th, creating urgent procurement needs.`,
        q4Opportunities: q4Agencies.slice(0, 15).map(agency => ({
            agency: agency.name,
            parentAgency: agency.parentAgency,
            estimatedQ4Spending: agency.setAsideSpending * 0.4, // Estimate 40% in Q4
            urgency: 'High - Must spend by Sept 30',
            quickTurnaround: true
        })),
        recommendations: [
            {
                title: 'Prepare for Quick Turnarounds',
                description: 'Q4 opportunities often have fast response requirements.',
                actionItems: [
                    'Have capability statements ready',
                    'Prepare quick quotes and proposals',
                    'Ensure you can start work immediately',
                    'Monitor SAM.gov daily in Q4'
                ]
            }
        ],
        reportHTML: generateReportHTML('december-spend', {})
    };
}

function generateTribesReport(agencies, params) {
    // Suggest tribes and agencies based on pain points
    const suggestedTribes = suggestTribesForAgencies(agencies, params);
    const tribalAgencies = suggestAgenciesForTribes(agencies, params);
    
    return {
        reportType: 'tribes',
        reportTitle: 'Tribal Contracting Report',
        companyName: params.companyName || 'Your Company',
        generatedDate: new Date().toISOString(),
        executiveSummary: `This report identifies opportunities for Native American/Tribal businesses. Based on your ${agencies.length} target agencies, we've identified ${tribalAgencies.length} agencies with strong tribal contracting programs.`,
        tribalOpportunities: agencies.map(agency => ({
            agency: agency.name,
            parentAgency: agency.parentAgency,
            setAsideSpending: agency.setAsideSpending,
            tribalSetAsides: '8(a) Tribal, ANCSA opportunities available',
            painPoints: agency.painPoints.slice(0, 3)
        })),
        suggestedTribes: suggestedTribes,
        recommendedAgencies: tribalAgencies,
        recommendations: [
            {
                title: 'Leverage Tribal Business Status',
                description: 'Tribal businesses have access to unique contracting opportunities.',
                actionItems: [
                    'Ensure tribal certification is current',
                    'Register in SBA 8(a) program if eligible',
                    'Attend tribal business conferences',
                    'Network with other tribal contractors',
                    'Contact agencies with strong tribal programs'
                ]
            }
        ],
        reportHTML: generateTribesReportHTML(agencies, suggestedTribes, tribalAgencies)
    };
}

function suggestTribesForAgencies(agencies, params) {
    // Suggest tribes based on agency locations and needs
    return [
        {
            name: 'Navajo Nation',
            description: 'Largest Native American tribe, strong government contracting presence',
            opportunities: 'Construction, IT services, professional services',
            certifications: '8(a) Tribal, ANCSA'
        },
        {
            name: 'Cherokee Nation',
            description: 'Major tribal contractor with diverse capabilities',
            opportunities: 'IT services, healthcare, construction',
            certifications: '8(a) Tribal'
        },
        {
            name: 'Choctaw Nation',
            description: 'Established government contracting program',
            opportunities: 'Professional services, IT, facilities management',
            certifications: '8(a) Tribal'
        }
    ];
}

function suggestAgenciesForTribes(agencies, params) {
    // Suggest additional agencies with strong tribal programs
    const tribalFriendlyAgencies = [
        { name: 'Department of the Interior', reason: 'Strong tribal contracting program', spending: 'High' },
        { name: 'Department of Health and Human Services', reason: 'Tribal health programs', spending: 'High' },
        { name: 'Department of Energy', reason: 'Tribal energy programs', spending: 'Medium' },
        { name: 'Department of Defense', reason: 'Tribal business outreach', spending: 'High' }
    ];
    
    return tribalFriendlyAgencies;
}

function generatePrimesReport(agencies, params) {
    // Suggest primes based on agency pain points
    const suggestedPrimes = suggestPrimesForAgencies(agencies, params);
    const otherAgencies = suggestOtherAgencies(agencies, params, params.painPointsData);
    
    return {
        reportType: 'primes',
        reportTitle: 'Prime Contractor Report',
        companyName: params.companyName || 'Your Company',
        generatedDate: new Date().toISOString(),
        executiveSummary: `This report identifies prime contractors and subcontracting opportunities matching your ${params.businessFormation || 'small business'} profile. Based on your ${agencies.length} target agencies' pain points, we've identified ${suggestedPrimes.length} prime contractors to consider.`,
        primeContractors: suggestedPrimes.map(prime => ({
            name: prime.name,
            contractTypes: ['IDIQ', 'BPA', 'GWAC'],
            smallBusinessSubcontracting: 'High',
            opportunities: prime.opportunities,
            description: prime.description,
            contactStrategy: prime.contactStrategy,
            relevantAgencies: prime.relevantAgencies
        })),
        otherAgenciesToConsider: otherAgencies,
        recommendations: [
            {
                title: 'Partner with Primes',
                description: 'Subcontracting with primes provides access to larger contracts.',
                actionItems: [
                    'Register in prime contractor supplier portals',
                    'Attend prime contractor small business events',
                    'Submit capability statements',
                    'Build relationships with prime small business offices',
                    'Focus on primes working with your target agencies'
                ]
            }
        ],
        reportHTML: generatePrimesReportHTML(suggestedPrimes, otherAgencies, agencies)
    };
}

function suggestOtherAgencies(selectedAgencies, params, painPointsData) {
    // Suggest other agencies based on pain points and NAICS
    
    // Collect pain points from selected agencies
    const allPainPoints = new Set();
    selectedAgencies.forEach(agency => {
        if (agency.painPoints) {
            agency.painPoints.forEach(pp => allPainPoints.add(pp));
        }
    });
    
    // Find other agencies with similar pain points
    const suggestedAgencies = [];
    const selectedNames = new Set(selectedAgencies.map(a => a.name));
    
    if (painPointsData && painPointsData.agencies) {
        Object.entries(painPointsData.agencies).forEach(([agencyName, data]) => {
            if (!selectedNames.has(agencyName) && data.painPoints) {
                const matchingPainPoints = data.painPoints.filter(pp => 
                    Array.from(allPainPoints).some(selectedPP => {
                        const ppLower = pp.toLowerCase();
                        const selectedPPLower = selectedPP.toLowerCase();
                        return ppLower.includes(selectedPPLower.substring(0, Math.min(10, selectedPPLower.length))) ||
                               selectedPPLower.includes(ppLower.substring(0, Math.min(10, ppLower.length)));
                    })
                );
                
                if (matchingPainPoints.length > 0) {
                    suggestedAgencies.push({
                        name: agencyName,
                        reason: `Similar pain points: ${matchingPainPoints.slice(0, 2).join(', ')}`,
                        painPoints: data.painPoints.slice(0, 5),
                        matchScore: matchingPainPoints.length
                    });
                }
            }
        });
    }
    
    // Sort by match score and return top 5
    return suggestedAgencies
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);
}

// Helper function to generate HTML for reports
function generateReportHTML(reportType, data) {
    // This will generate HTML based on report type
    // For now, return a placeholder - can be enhanced later
    return `<div class="report-content"><h2>${reportType} Report</h2><p>Report content will be generated here</p></div>`;
}

function generateTier2ReportHTML(primes, agencies) {
    return `
        <section class="border-b-2 border-gray-200 pb-8">
            <h3 class="text-2xl font-bold text-linkedin-blue mb-4">Suggested Prime Contractors</h3>
            <div class="space-y-4">
                ${primes.map((prime, index) => `
                    <div class="border-2 border-gray-200 rounded-lg p-6">
                        <h4 class="text-xl font-bold text-gray-900 mb-2">${index + 1}. ${prime.name}</h4>
                        <p class="text-gray-700 mb-4">${prime.description}</p>
                        <div class="mb-4">
                            <div class="font-semibold text-gray-900 mb-2">Opportunities:</div>
                            <p class="text-gray-700">${prime.opportunities}</p>
                        </div>
                        <div class="mb-4">
                            <div class="font-semibold text-gray-900 mb-2">Relevant Agencies:</div>
                            <p class="text-gray-700">${prime.relevantAgencies.join(', ')}</p>
                        </div>
                        <div class="bg-blue-50 rounded-lg p-4">
                            <p class="text-sm text-gray-700"><strong>Contact Strategy:</strong> ${prime.contactStrategy}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

function generateTribesReportHTML(agencies, suggestedTribes, recommendedAgencies) {
    return `
        <section class="border-b-2 border-gray-200 pb-8">
            <h3 class="text-2xl font-bold text-linkedin-blue mb-4">Target Agencies with Tribal Opportunities</h3>
            <div class="space-y-4">
                ${agencies.map((agency, index) => `
                    <div class="border-2 border-gray-200 rounded-lg p-6">
                        <h4 class="text-xl font-bold text-gray-900 mb-2">${index + 1}. ${agency.name}</h4>
                        <p class="text-gray-600 mb-4">${agency.parentAgency}</p>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <div class="font-semibold text-gray-900">Set-Aside Spending</div>
                                <div class="text-green-600 font-bold">$${formatCurrency(agency.setAsideSpending)}</div>
                            </div>
                            <div>
                                <div class="font-semibold text-gray-900">Pain Points</div>
                                <ul class="list-disc list-inside text-sm text-gray-700">
                                    ${agency.painPoints.map(pp => `<li>${pp}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
        ${recommendedAgencies.length > 0 ? `
        <section class="border-b-2 border-gray-200 pb-8">
            <h3 class="text-2xl font-bold text-linkedin-blue mb-4">Other Agencies to Consider</h3>
            <div class="space-y-4">
                ${recommendedAgencies.map((agency, index) => `
                    <div class="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
                        <h4 class="text-xl font-bold text-gray-900 mb-2">${index + 1}. ${agency.name}</h4>
                        <p class="text-gray-700">${agency.reason}</p>
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
    `;
}

function generatePrimesReportHTML(primes, otherAgencies, selectedAgencies) {
    return `
        <section class="border-b-2 border-gray-200 pb-8">
            <h3 class="text-2xl font-bold text-linkedin-blue mb-4">Suggested Prime Contractors</h3>
            <div class="space-y-4">
                ${primes.map((prime, index) => `
                    <div class="border-2 border-gray-200 rounded-lg p-6">
                        <h4 class="text-xl font-bold text-gray-900 mb-2">${index + 1}. ${prime.name}</h4>
                        <p class="text-gray-700 mb-4">${prime.description}</p>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <div class="font-semibold text-gray-900 mb-2">Opportunities</div>
                                <p class="text-gray-700">${prime.opportunities}</p>
                            </div>
                            <div>
                                <div class="font-semibold text-gray-900 mb-2">Relevant Agencies</div>
                                <p class="text-gray-700">${prime.relevantAgencies.join(', ')}</p>
                            </div>
                        </div>
                        <div class="bg-blue-50 rounded-lg p-4">
                            <p class="text-sm text-gray-700"><strong>Contact Strategy:</strong> ${prime.contactStrategy}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
        ${otherAgencies.length > 0 ? `
        <section class="border-b-2 border-gray-200 pb-8">
            <h3 class="text-2xl font-bold text-linkedin-blue mb-4">Other Agencies to Consider (Based on Pain Points)</h3>
            <div class="space-y-4">
                ${otherAgencies.map((agency, index) => `
                    <div class="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-6">
                        <h4 class="text-xl font-bold text-gray-900 mb-2">${index + 1}. ${agency.name}</h4>
                        <p class="text-gray-700 mb-4">${agency.reason}</p>
                        <div class="mt-4">
                            <div class="font-semibold text-gray-900 mb-2">Key Pain Points:</div>
                            <ul class="list-disc list-inside space-y-1 text-gray-700">
                                ${agency.painPoints.map(pp => `<li>${pp}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
    `;
}

function formatCurrency(amount) {
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(2) + 'M';
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(2) + 'K';
    }
    return amount.toLocaleString();
}

// Start server (only for local development)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

module.exports = app;

