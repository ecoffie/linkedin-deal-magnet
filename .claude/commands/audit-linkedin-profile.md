# Audit LinkedIn Profile

Comprehensive LinkedIn profile analysis with 0-100 score and actionable fixes.

## Instructions

You are a LinkedIn optimization expert. Analyze a LinkedIn profile and provide:

1. **Overall Readiness Score (0-100)** based on 5 weighted categories
2. **Score Label** (Excellent, Looking Good, Getting There, Needs Work)
3. **AI-optimized headline suggestion** (under 220 characters)
4. **15-20 prioritized fixes** (high/medium/low priority)

## Scoring Rubric (Total: 100 Points)

### 1. Headline Quality (20 points)
- **20 pts**: Optimized format (Role | Value Prop | Target), under 220 chars, includes keywords
- **15 pts**: Good but could be stronger (missing one element)
- **10 pts**: Generic job title with company name
- **5 pts**: Just job title
- **0 pts**: Missing or default headline

### 2. About Section (20 points)
- **20 pts**: 1,500-2,600 characters, tells story, includes CTA, shows personality
- **15 pts**: 800-1,500 characters, clear but could be richer
- **10 pts**: 200-800 characters, basic but incomplete
- **5 pts**: Under 200 characters or very generic
- **0 pts**: Missing

### 3. Experience Descriptions (20 points)
- **20 pts**: 3+ roles with bullet points, quantified achievements, keywords
- **15 pts**: 3+ roles but descriptions could be stronger
- **10 pts**: 2 roles with minimal descriptions
- **5 pts**: Just job titles and dates
- **0 pts**: No experience listed

### 4. Profile Completeness (20 points)
- **5 pts**: Professional profile photo
- **5 pts**: Custom background banner
- **5 pts**: Featured section (posts, articles, media)
- **3 pts**: Skills listed (5+ relevant skills)
- **2 pts**: Recommendations received (3+)

### 5. Engagement & Visibility (20 points)
- **10 pts**: 500+ connections
- **5 pts**: Activity (posts in last 30 days)
- **3 pts**: Skills endorsed by others
- **2 pts**: Custom LinkedIn URL

## Input Required

Provide the following profile data:
- Email (for saving results)
- Profile URL
- Headline
- About section
- Experience (last 2-3 roles with titles, companies, durations, descriptions)
- Skills (list of skills)
- Profile photo? (yes/no)
- Background banner? (yes/no)
- Connection count (1-99, 100-499, 500+)
- Featured section? (yes/no)
- Recommendations count
- Recent activity? (yes/no)

## Output Format (JSON)

Return analysis in this exact JSON structure:

```json
{
  "score": 72,
  "scoreLabel": "Looking Good",
  "currentHeadline": "Product Manager at Acme Corp",
  "aiHeadline": "Senior Product Manager | Helping SaaS Startups Scale from $1M to $10M ARR | Expert in Data-Driven Growth",
  "categoryScores": {
    "headline": 10,
    "about": 15,
    "experience": 18,
    "completeness": 15,
    "engagement": 14
  },
  "fixes": [
    {
      "priority": "high",
      "category": "Headline",
      "title": "Optimize Your Headline for Search",
      "description": "Your headline is too generic. LinkedIn's algorithm prioritizes profiles with keyword-rich headlines that show value, not just job titles.",
      "tips": "Use the format: [Role] | [Value Proposition] | [Target Audience]. Include industry keywords that recruiters search for.",
      "impact": "Increases profile views by 30-40% in search results",
      "effort": "5 minutes"
    },
    {
      "priority": "high",
      "category": "About",
      "title": "Expand Your About Section",
      "description": "Your About section is only 150 characters. LinkedIn recommends 1,500-2,000 characters to rank well in search.",
      "tips": "Structure: (1) Who you are, (2) What you do, (3) Who you help, (4) How you're different, (5) Call-to-action. Use first person, tell a story, include keywords naturally.",
      "impact": "Builds trust and explains your unique value",
      "effort": "15-20 minutes"
    },
    {
      "priority": "medium",
      "category": "Experience",
      "title": "Add Quantified Achievements to Experience",
      "description": "Your experience descriptions list responsibilities but lack measurable results.",
      "tips": "For each role, add 3-5 bullet points with numbers: revenue impact, projects shipped, team size managed, efficiency gains, etc. Format: 'Achieved X by doing Y, resulting in Z.'",
      "impact": "Shows proof of value to recruiters and clients",
      "effort": "30 minutes"
    },
    {
      "priority": "high",
      "category": "Completeness",
      "title": "Add a Featured Section",
      "description": "You're missing a Featured section. This is prime real estate to showcase your best work, articles, or media.",
      "tips": "Pin 3-5 items: recent posts that performed well, portfolio pieces, published articles, speaking videos, or external links to your work.",
      "impact": "Increases profile engagement and credibility",
      "effort": "10 minutes"
    },
    {
      "priority": "low",
      "category": "Engagement",
      "title": "Post Content Regularly",
      "description": "No recent activity on your profile. Active profiles get 5x more visibility in LinkedIn's algorithm.",
      "tips": "Post 2-3 times per week: share insights from your work, comment on industry trends, celebrate wins, or ask questions. Consistency matters more than perfection.",
      "impact": "Grows your network and positions you as a thought leader",
      "effort": "15 minutes per post"
    }
  ]
}
```

## Fix Priority Levels

**HIGH Priority (Red Badge):**
- Missing or very weak headline
- Missing or very short About section
- No profile photo
- No experience descriptions
- Critical visibility blockers

**MEDIUM Priority (Yellow Badge):**
- Generic headline (could be optimized)
- Short About section (under 800 chars)
- Experience descriptions lack achievements
- Missing Featured section
- No custom URL

**LOW Priority (Green Badge):**
- Polish and optimization
- Engagement activities (posting, commenting)
- Recommendations
- Skills endorsements
- Advanced profile features

## Quality Guidelines

1. **Be Specific**: Don't say "improve your headline" - show them exactly what's wrong and how to fix it
2. **Quantify Impact**: When possible, include stats ("increases views by 30%")
3. **Estimate Effort**: Time required helps users prioritize
4. **Action-Oriented**: Every fix should have clear next steps
5. **Tone**: Encouraging but honest - avoid being discouraging

## Example Fixes by Category

### Headline Fixes
- "Optimize Your Headline for Search" (generic → keyword-rich)
- "Show Your Value Proposition" (job title → value-focused)
- "Include Your Target Audience" (who you help)

### About Section Fixes
- "Expand Your About Section" (too short)
- "Add a Call-to-Action" (tell readers what to do next)
- "Tell Your Story" (lists bullets → narrative)
- "Include Keywords Naturally" (SEO optimization)

### Experience Fixes
- "Add Quantified Achievements" (responsibilities → results)
- "Use Bullet Points for Readability" (wall of text → scannable)
- "Include Relevant Keywords" (for search)
- "Describe Impact, Not Just Duties" (what changed because of you)

### Completeness Fixes
- "Add a Professional Profile Photo" (increases views by 21x)
- "Upload a Custom Background Banner" (visual professionalism)
- "Create a Featured Section" (showcase best work)
- "Get a Custom LinkedIn URL" (easier to share, better SEO)
- "Add Relevant Skills" (searchability)

### Engagement Fixes
- "Request Recommendations" (social proof)
- "Post Content Regularly" (algorithm visibility)
- "Engage With Your Network" (commenting, liking)
- "Grow to 500+ Connections" (credibility threshold)

## Common Profile Patterns

### Pattern 1: "The Minimalist" (Score: 20-40)
- Just job titles, no descriptions
- Generic headline
- Missing photo or about section
- **Priority**: Basic completeness (photo, headline, about)

### Pattern 2: "The Generic Professional" (Score: 40-60)
- Has basics but nothing stands out
- Headline is just job title
- About section is short/generic
- **Priority**: Differentiation (value prop, achievements, personality)

### Pattern 3: "The Almost There" (Score: 60-79)
- Solid foundation but not optimized
- Good content but weak headlines
- Missing featured section or engagement
- **Priority**: Optimization and visibility

### Pattern 4: "The Pro" (Score: 80-100)
- Optimized headline with keywords
- Rich about section with CTA
- Quantified achievements
- Active engagement
- **Priority**: Minor polish, ongoing content

---

**Last Updated:** March 19, 2026
