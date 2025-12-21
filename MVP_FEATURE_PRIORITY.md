# MVP Feature Priority - Launch in 4-6 Weeks

## 📋 Project Overview

**Product**: AI-Powered LinkedIn Content Generator for Government Contractors  
**Goal**: Help small businesses create engaging, agency-aligned LinkedIn content that resonates with government buyers  
**Timeline**: 4-6 Weeks to MVP Launch  
**Target Users**: Small businesses, 8(a), WOSB, VOSB, HUBZone companies seeking government contracts

---

## 🎯 MVP Core Features

### Phase 1: Foundation (Weeks 1-2) ⚡ **CRITICAL**

#### 1. Onboarding Flow
**Priority**: P0 - Must Have  
**Status**: In Development

**User Journey:**
1. **LinkedIn Connection**
   - OAuth integration for LinkedIn API access
   - Request permissions: `r_liteprofile`, `r_emailaddress`, `w_member_social`
   - Store LinkedIn profile data for voice analysis
   - Extract: Name, headline, past 10 posts, connection count

2. **Company Information Input**
   - **NAICS Codes**: Multi-select dropdown (primary + secondary)
     - Search/autocomplete for 6-digit NAICS codes
     - Validate against official NAICS 2022 list
     - Store up to 5 codes
   
   - **Certifications**: Checkbox selection
     - 8(a)
     - WOSB/EDWOSB
     - VOSB/SDVOSB
     - HUBZone
     - Other (text input)
   
   - **Past Agencies**: Multi-select or text input
     - Pre-populated list of major agencies (DoD, VA, GSA, DHS, etc.)
     - Allow custom entries
     - Used for matching algorithm
   
   - **Capabilities Statement**: 
     - Text input (500-2000 chars recommended)
     - PDF upload option
     - Extract text from PDF using existing PDF parser
     - Store extracted text for AI context

**Data Storage:**
```json
{
  "userId": "uuid",
  "linkedinId": "string",
  "linkedinPosts": ["post1", "post2", ...],
  "company": {
    "name": "string",
    "naicsCodes": ["541330", "541511"],
    "certifications": ["8a", "wosb"],
    "pastAgencies": ["Department of Defense", "VA"],
    "capabilitiesStatement": "text...",
    "capabilitiesPDF": "base64 or file path"
  },
  "createdAt": "timestamp",
  "lastUpdated": "timestamp"
}
```

**Acceptance Criteria:**
- [ ] User can connect LinkedIn in < 30 seconds
- [ ] All company data fields save correctly
- [ ] PDF upload extracts text successfully
- [ ] Data persists across sessions
- [ ] Onboarding completion < 3 minutes

---

#### 2. Agency Matching Engine
**Priority**: P0 - Must Have  
**Status**: In Development

**Core Functionality:**
- Use user's NAICS codes + PSC codes (if available) to query **USASpending.gov API**
- Match against agency spending data from last fiscal year
- Return top 5-10 agencies ranked by:
  1. Total spending in user's NAICS codes
  2. Small business set-aside percentage
  3. Certification alignment (8(a), WOSB, etc.)
  4. Historical trends (growing vs. declining)

**API Integration:**
```javascript
// USASpending.gov API Endpoints
GET https://api.usaspending.gov/api/v2/search/spending_by_award/
GET https://api.usaspending.gov/api/v2/agency/{toptier_code}/sub_agency/
GET https://api.usaspending.gov/api/v2/search/spending_by_category/naics/
```

**Display Format:**
```
🎯 Agency Match Results

Your services align with significant spending opportunities:

1. Department of Homeland Security (DHS)
   • $2.4B in NAICS 541330 (IT Services) last FY
   • 23% set aside for small business
   • Strong 8(a) utilization
   • Trending: +12% YoY

2. Department of Veterans Affairs (VA)
   • $1.8B in NAICS 541330 last FY
   • 18% small business set-aside
   • High VOSB preference
   • Trending: +8% YoY

[... up to 10 agencies]
```

**Technical Requirements:**
- Cache API responses for 24 hours (reduce API calls)
- Handle API rate limits gracefully
- Show loading states during API calls
- Allow manual refresh

**Acceptance Criteria:**
- [ ] Returns accurate spending data from USASpending API
- [ ] Results load in < 5 seconds
- [ ] Shows relevant agencies based on NAICS codes
- [ ] Displays clear, formatted spending statistics
- [ ] Handles API errors gracefully

---

### Phase 2: Content Generation (Weeks 2-4) 🚀 **CORE**

#### 3. Content Generator Core
**Priority**: P0 - Must Have  
**Status**: In Development

**Prompt Chain Architecture:**

**Step 1: Identify Agency Pain Points**
```
Input: Selected agency (from matching engine)
Process:
1. Pull from curated pain points knowledge base
   - Load agency-specific pain points from bootcamp/agencies/[agency].json
2. Query recent RFIs/Forecasts
   - Search scraped forecast data for recent opportunities
   - Extract challenges mentioned in RFIs
3. Combine and rank by relevance
Output: Top 3-5 pain points for selected agency
```

**Step 2: Inject Stats/Sources + GEO Techniques**
```
Input: Pain points + User company info
Process:
1. Add authoritative sources
   - "According to GAO report GAO-24-123..."
   - "Per DHS Strategic Plan FY2025..."
   - "Latest FPDS data shows..."
2. Insert statistics
   - Spending amounts
   - Contract award trends
   - Small business percentages
3. Apply GEO structure:
   - Lists (bulleted/numbered)
   - Clear headings
   - Short paragraphs (2-3 sentences)
   - Action-oriented language
Output: Enhanced content with sources and structure
```

**Step 3: Write in User's Voice**
```
Input: Enhanced content + LinkedIn posts history
Process:
1. Analyze user's past 10 LinkedIn posts:
   - Tone (professional, conversational, technical)
   - Sentence length patterns
   - Common phrases/terminology
   - Emoji usage preferences
   - Structure preferences (lists, paragraphs, questions)
2. Apply voice profile to generated content
3. Maintain professional government contracting context
Output: Content that sounds like the user wrote it
```

**Output Format:**
```json
{
  "variants": [
    {
      "id": "variant-1",
      "title": "Professional",
      "content": "LinkedIn post text...",
      "wordCount": 280,
      "hashtags": ["#GovCon", "#SmallBusiness", "#DHS"],
      "callToAction": "What challenges are you seeing in federal IT modernization?",
      "characterCount": 1245
    },
    {
      "id": "variant-2",
      "title": "Conversational",
      "content": "LinkedIn post text...",
      "wordCount": 295,
      "hashtags": ["#GovCon", "#SmallBusiness", "#DHS", "#ITModernization"],
      "callToAction": "Drop a comment if you're working on similar solutions!",
      "characterCount": 1320
    }
    // ... 3-5 variants total
  ],
  "metadata": {
    "agency": "Department of Homeland Security",
    "painPointsUsed": ["legacy modernization", "cybersecurity", "workforce"],
    "sourcesCited": ["GAO-24-123", "DHS Strategic Plan", "USASpending.gov"],
    "generatedAt": "2025-01-21T10:00:00Z",
    "voiceProfile": {
      "tone": "professional",
      "avgSentenceLength": 18,
      "emojiUsage": "minimal"
    }
  }
}
```

**Technical Implementation:**
- Use Grok API (already integrated) for content generation
- Chain multiple prompts sequentially
- Cache voice analysis results (update weekly)
- Allow regeneration with different parameters

**Acceptance Criteria:**
- [ ] Generates 3-5 distinct content variants
- [ ] Includes relevant agency pain points
- [ ] Adds authoritative sources and statistics
- [ ] Matches user's LinkedIn voice style
- [ ] Content is LinkedIn-ready (within character limits)
- [ ] Includes relevant hashtags
- [ ] Provides clear call-to-action

---

#### 4. GEO Booster Toggle
**Priority**: P1 - Should Have  
**Status**: Planned

**Feature Description:**
- Checkbox toggle: "Optimize for AI engine visibility (GEO)"
- When enabled, enhances content with:
  - **Statistics**: Adds data points and numbers
  - **Sources**: Includes authoritative citations
  - **Lists**: Converts paragraphs to structured lists
  - **Fluent Structure**: Ensures clear, scannable format
  - **Keywords**: Strategically places relevant keywords

**GEO Optimization Checklist:**
- [ ] Contains numerical data/statistics
- [ ] Includes authoritative sources (GAO, agency reports)
- [ ] Uses structured format (lists, headings)
- [ ] Short, scannable paragraphs
- [ ] Natural keyword placement
- [ ] Clear hierarchy (important info first)

**Implementation:**
```javascript
function applyGEOOptimizations(content, enabled) {
  if (!enabled) return content;
  
  return {
    ...content,
    variants: content.variants.map(variant => ({
      ...variant,
      content: enhanceWithGEO(variant.content),
      hashtags: [...variant.hashtags, ...getGEOKeywords()],
      geoTags: {
        hasStatistics: true,
        hasSources: true,
        hasLists: true,
        fluentScore: calculateFluentScore(variant.content)
      }
    }))
  };
}
```

**Acceptance Criteria:**
- [ ] Toggle works on/off
- [ ] GEO-enabled content has enhanced structure
- [ ] Statistics and sources are added
- [ ] Content remains natural and readable
- [ ] GEO score displayed to user

---

### Phase 3: Export & Scheduling (Weeks 4-6) 📤 **ESSENTIAL**

#### 5. Save / Schedule / Export
**Priority**: P0 - Must Have  
**Status**: Planned

**Features:**

**1. Copy to Clipboard**
- One-click copy button for each variant
- Copies formatted text + hashtags
- Shows success notification
- Format: Plain text (for LinkedIn composer)

**2. Download Options**
- **As Text (.txt)**: Plain text file
- **As Image**: 
  - Generates formatted image (LinkedIn post mockup)
  - Includes branding (optional)
  - Multiple formats: PNG, JPG
  - Responsive sizing
- **As PDF**: 
  - Formatted document with metadata
  - Includes source citations
  - Professional layout

**3. Save to Library**
- Save generated content variants
- Tag by agency, topic, date
- Search/filter saved posts
- Edit and regenerate from saved versions
- View generation history

**4. Schedule for Later**
- Queue posts for future posting
- Connect to LinkedIn API for scheduling
- Set date/time for posting
- Preview scheduled posts
- Edit before posting

**UI Components:**
```
┌─────────────────────────────────────┐
│ Variant 1: Professional            │
│ ─────────────────────────────────── │
│ [Generated Content Preview]        │
│                                     │
│ Hashtags: #GovCon #SmallBusiness   │
│ CTA: "What challenges are you...?" │
│                                     │
│ [📋 Copy] [💾 Save] [📅 Schedule]  │
│ [⬇️ Download ▼]                    │
│   • Download as Text                │
│   • Download as Image               │
│   • Download as PDF                 │
└─────────────────────────────────────┘
```

**Technical Requirements:**
- Clipboard API for copy functionality
- File generation library for downloads (jsPDF, html2canvas)
- Database/state management for saved posts
- LinkedIn API integration for scheduling
- Queue management system

**Acceptance Criteria:**
- [ ] Copy to clipboard works on all browsers
- [ ] Downloads generate correctly (text, image, PDF)
- [ ] Saved posts persist across sessions
- [ ] Scheduling interface is intuitive
- [ ] LinkedIn posting works via API
- [ ] Can edit saved/scheduled posts

---

## 📊 Feature Priority Matrix

| Feature | Priority | Weeks | Status | Dependencies |
|---------|----------|-------|--------|--------------|
| Onboarding Flow | P0 | 1-2 | 🟡 In Progress | LinkedIn API, PDF parser |
| Agency Matching | P0 | 1-2 | 🟡 In Progress | USASpending API |
| Content Generator | P0 | 2-4 | 🟡 In Progress | Grok API, Knowledge base |
| GEO Booster | P1 | 3-4 | ⚪ Planned | Content generator |
| Save/Export | P0 | 4-6 | ⚪ Planned | Content generator |
| Schedule | P1 | 5-6 | ⚪ Planned | LinkedIn API, Save feature |

**Legend:**
- 🟢 Complete
- 🟡 In Progress
- ⚪ Planned
- 🔴 Blocked

---

## 🎯 Success Metrics (MVP Launch)

### User Engagement
- [ ] 100+ users onboard in first month
- [ ] 70%+ complete onboarding flow
- [ ] Average 5+ content generations per user
- [ ] 50%+ use GEO booster toggle

### Content Quality
- [ ] 90%+ of generated content passes quality checks
- [ ] User satisfaction score > 4.0/5.0
- [ ] 60%+ of users save/export content
- [ ] 30%+ schedule posts via platform

### Technical Performance
- [ ] Page load time < 2 seconds
- [ ] Content generation time < 10 seconds
- [ ] API error rate < 1%
- [ ] Uptime > 99%

---

## 🔧 Technical Stack

### Frontend
- React/TypeScript
- TailwindCSS for styling
- React Query for data fetching
- React Hook Form for forms

### Backend
- Node.js/Express or Next.js API routes
- Grok API for content generation
- LinkedIn API for OAuth & posting
- USASpending.gov API for agency matching

### Data Storage
- PostgreSQL or MongoDB for user data
- File storage for PDFs (S3 or local)
- Redis for caching API responses

### Integrations
- LinkedIn OAuth 2.0
- Grok API (xAI)
- USASpending.gov API
- Existing knowledge base (JSON files)

---

## 📅 Weekly Milestones

### Week 1-2: Foundation
- [x] LinkedIn OAuth integration
- [x] Company info input form
- [x] PDF upload & parsing
- [ ] USASpending API integration
- [ ] Agency matching algorithm
- [ ] Database schema setup

### Week 2-4: Content Generation
- [ ] Pain point extraction from knowledge base
- [ ] Prompt chain implementation
- [ ] Voice analysis from LinkedIn posts
- [ ] Content variant generation
- [ ] GEO optimization logic
- [ ] Hashtag generation

### Week 4-6: Export & Polish
- [ ] Copy to clipboard
- [ ] Download functionality (text, image, PDF)
- [ ] Save to library
- [ ] Scheduling interface
- [ ] LinkedIn API posting
- [ ] UI/UX polish
- [ ] Testing & bug fixes
- [ ] Documentation

---

## 🚨 Risk Mitigation

### Technical Risks
1. **LinkedIn API Rate Limits**
   - Solution: Cache user data, batch requests
   
2. **USASpending API Downtime**
   - Solution: Cache responses, fallback to static data

3. **Grok API Costs**
   - Solution: Optimize prompts, cache responses, usage limits

4. **Content Quality Issues**
   - Solution: Quality checks, user feedback loop, iteration

### Product Risks
1. **User Onboarding Complexity**
   - Solution: Progressive disclosure, clear instructions, tooltips

2. **Generated Content Not LinkedIn-Ready**
   - Solution: Pre-flight checks, character limits, preview

3. **Voice Analysis Accuracy**
   - Solution: Allow manual override, voice profile editing

---

## 📝 Next Steps (Post-MVP)

### Phase 2 Features (Weeks 7-12)
- Advanced analytics (engagement prediction)
- A/B testing for content variants
- Team collaboration features
- Integration with other social platforms
- Automated content calendar
- Competitor analysis
- Industry trend insights

### Phase 3 Features (Months 4-6)
- AI-powered image generation for posts
- Video content suggestions
- CRM integration
- Advanced reporting dashboard
- White-label options
- API access for enterprise

---

## 📚 Documentation Requirements

- [ ] User onboarding guide
- [ ] API documentation
- [ ] Content generation methodology
- [ ] Troubleshooting guide
- [ ] Privacy policy
- [ ] Terms of service
- [ ] GDPR compliance checklist

---

**Last Updated**: January 21, 2025  
**Version**: 1.0 (MVP)  
**Owner**: Product Team

