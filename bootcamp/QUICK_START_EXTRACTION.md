# Quick Start: Begin Extracting Pain Points

Ready to extract pain points? Follow these steps to get started immediately.

## 🎯 Choose Your First Agency

### Option 1: Extract for a New Agency

**Recommended Starting Point: EPA (Environmental Protection Agency)**

**Why EPA?**
- Moderate budget, active procurement
- Clear environmental focus = easier to identify pain points
- Good forecast availability
- Relevant current issues (PFAS, climate, infrastructure)

**Other Good Options:**
- **Interior** - Infrastructure, climate resilience
- **Agriculture** - Food safety, rural development
- **Transportation** - Infrastructure modernization

### Option 2: Enhance an Existing Agency

**Agencies That Could Use More Pain Points:**
- Check existing files in `agencies/` folder
- Look for agencies with < 7 pain points
- Review for opportunities to add more detail

## 🚀 Step-by-Step: Extract Your First Pain Point

### 1. Open the Extraction Template

Open: `bootcamp/EXTRACTION_TEMPLATE.md`

Copy it to a new file: `bootcamp/extractions/[AGENCY-NAME]-extraction.md`

### 2. Visit GSA Acquisition Gateway

**Go to**: https://hallway.acquisition.gov/forecast

**Action Items:**
- Search for your target agency
- Browse through forecast entries
- Look for project descriptions that mention problems/challenges
- Copy relevant forecast details

**What to Look For:**
```
✅ "Urgent need for..."
✅ "Replacing legacy system..."
✅ "Addressing cybersecurity gaps..."
✅ "Modernizing outdated infrastructure..."
✅ "Responding to [problem/challenge]..."
```

### 3. Extract Your First Pain Point

**Example from a Forecast:**

**Forecast Entry:**
> "Urgent need for cybersecurity services to address vulnerabilities in legacy IT systems that are no longer supported by vendors."

**Extracted Pain Point:**
```markdown
### Pain Point 1: Legacy IT System Cybersecurity Vulnerabilities
- **Description**: Legacy IT systems with unsupported software creating cybersecurity vulnerabilities requiring immediate remediation
- **Source**: GSA Acquisition Gateway Forecast FY2025 - [Agency Name] Cybersecurity Services
- **Source URL**: [Copy URL from Gateway]
- **Evidence/Quote**: "Urgent need for cybersecurity services to address vulnerabilities in legacy IT systems that are no longer supported by vendors."
- **Priority**: high
- **Justification**: Marked as "urgent" in forecast, indicates immediate security risk
- **Cross-Referenced In**: [Will check GAO reports next]
```

### 4. Cross-Reference with GAO

**Go to**: https://www.gao.gov/highrisk

**Action Items:**
- Search for your agency
- Read recent reports
- Look for related challenges
- Add to cross-reference section

**If Found in GAO:**
- Upgrade priority if GAO identifies as high-risk
- Add GAO report as additional source
- Note report number (GAO-XX-XXXXX)

### 5. Check Strategic Plans

**Action Items:**
- Visit agency website
- Look for "Strategic Plan" or "Performance Plan"
- Search for related priorities
- Note funding levels and deadlines

### 6. Document in Template

Fill out your extraction template with:
- All pain points found
- Strategic priorities identified
- Sources documented
- NAICS codes noted

### 7. Convert to JSON

Once you have 5-10 pain points:

1. Open an existing agency file (e.g., `dod.json`) as reference
2. Create new file: `agencies/[agency-name].json`
3. Fill in all sections using your extracted data
4. Use the structured format for pain points:

```json
"painPoints": [
  {
    "point": "Your extracted description",
    "source": "Source document name and year",
    "priority": "high"
  }
]
```

### 8. Test It

1. Update `agencies/index.json` if new agency
2. Start your server
3. Navigate to Opportunity Scout
4. Search for the agency
5. Click on results
6. Verify pain points display correctly in modal

## 📋 Extraction Checklist (Per Agency)

Use this as you extract:

- [ ] **GSA Gateway**: Found at least 5 forecast entries
- [ ] **GAO Reports**: Found at least 1 relevant report
- [ ] **Strategic Plan**: Located and reviewed
- [ ] **Budget**: Found procurement budget info
- [ ] **Pain Points**: Extracted 5-10 pain points
- [ ] **Sources**: All sources documented with URLs
- [ ] **Priorities**: Priority levels assigned
- [ ] **Strategic Priorities**: Extracted 5-7 priorities
- [ ] **NAICS Codes**: Identified from forecasts
- [ ] **JSON Created**: File created in correct format
- [ ] **Index Updated**: Added to agencies/index.json
- [ ] **Tested**: Verified in frontend

## 🎓 Learning Resources

As you extract, reference these guides:

1. **EXTRACTION_WORKFLOW.md** - Complete step-by-step process
2. **EXTRACTION_TEMPLATE.md** - Copy/paste template
3. **GSA_ACQUISITION_GATEWAY_GUIDE.md** - Gateway usage tips
4. **KNOWLEDGE_BASE_SOURCES.md** - All available sources
5. **PSC_SCORECARD_GUIDE.md** - PSC Scorecard usage

## 💡 Pro Tips

1. **Start Small**: Extract 1-2 pain points first to get the hang of it
2. **Save URLs**: Keep all source URLs for citations
3. **Quote Directly**: Use agency's own words when possible
4. **Set Timer**: Work in 30-60 minute focused sessions
5. **Batch Similar**: Group similar pain points together
6. **Cross-Reference**: Always verify across multiple sources

## 🎯 Your First Extraction Goal

**Target**: Extract 5 pain points for ONE agency

**Time Estimate**: 2-3 hours for first extraction (includes learning curve)

**Expected Outcome**: 
- Completed extraction template
- JSON file created
- Agency displays correctly in Opportunity Scout modal

## Need Help?

- Check existing agency files for format examples
- Review `EXTRACTION_WORKFLOW.md` for detailed steps
- Look at `dod.json` or `va.json` as reference examples

## Ready to Start?

1. ✅ Choose your agency (recommend EPA or Interior)
2. ✅ Copy `EXTRACTION_TEMPLATE.md` to new file
3. ✅ Visit GSA Acquisition Gateway
4. ✅ Start extracting!

**Good luck! 🚀**

