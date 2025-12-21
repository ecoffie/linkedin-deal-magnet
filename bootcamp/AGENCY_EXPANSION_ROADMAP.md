# Agency Knowledge Base Expansion Roadmap

This document outlines the plan to expand the knowledge base from the current 11 agencies to 70+ agencies using comprehensive sources like PSC Scorecard and GovConChamber.com.

## Current Status (11 Agencies)

✅ **Complete with Source Citations (All 11 Initial Agencies):**
1. DoD (Department of Defense)
2. DHS (Department of Homeland Security)
3. VA (Department of Veterans Affairs)
4. GSA (General Services Administration)
5. DOE (Department of Energy)
6. Navy (Department of the Navy)
7. NAVFAC
8. USACE (U.S. Army Corps of Engineers)
9. Army (Department of the Army)
10. Air Force (Department of the Air Force)
11. NASA

**🎉 All initial 11 agencies completed! Ready for expansion to 70+ agencies.**

## Priority Expansion List (From PSC Scorecard Coverage)

### Tier 1: High-Priority Agencies (Large Budgets, Frequent Contracts)

**Cabinet Departments:**
- [ ] HHS (Department of Health and Human Services) - $1.7T budget
- [ ] Treasury - $500B+ budget
- [ ] Interior - $18B+ budget
- [ ] Agriculture - $200B+ budget
- [ ] Transportation - $100B+ budget
- [ ] Education - $80B+ budget
- [ ] State - $65B+ budget
- [ ] Commerce - $12B+ budget
- [ ] Labor - $15B+ budget
- [ ] Housing and Urban Development - $70B+ budget

**Major Independent Agencies:**
- [ ] EPA (Environmental Protection Agency)
- [ ] SBA (Small Business Administration)
- [ ] FEMA (Federal Emergency Management Agency)
- [ ] NIH (National Institutes of Health)
- [ ] NSF (National Science Foundation)
- [ ] SSA (Social Security Administration)
- [ ] DOJ (Department of Justice)
- [ ] USAID (U.S. Agency for International Development)

### Tier 2: Medium-Priority Agencies (Moderate Budgets, Specialized Markets)

- [ ] Department of Agriculture sub-agencies (USDA FS, NRCS, etc.)
- [ ] DOI sub-agencies (NPS, BLM, USGS, etc.)
- [ ] HHS sub-agencies (CMS, CDC, FDA, etc.)
- [ ] Transportation sub-agencies (FAA, FHWA, etc.)
- [ ] Commerce sub-agencies (NOAA, NIST, etc.)

### Tier 3: Specialized/Smaller Agencies

- [ ] National Archives
- [ ] Office of Personnel Management
- [ ] Peace Corps
- [ ] General Services Administration (sub-components)
- [ ] And 40+ more from PSC Scorecard

## Expansion Strategy

### Phase 1: Top 20 Agencies (Next 9 to complete 20 total)

Focus on agencies with:
1. Largest procurement budgets
2. Most active small business programs
3. Highest PSC Scorecard ratings (better data availability)
4. Most frequent contract awards

**Target List:**
1. HHS (Department of Health and Human Services)
2. Treasury
3. Interior
4. Agriculture
5. Transportation
6. EPA
7. SBA
8. FEMA
9. NIH

### Phase 2: Next 30 Agencies (Complete 50 total)

Expand to cover:
- Remaining cabinet departments
- Major independent agencies
- High-activity sub-agencies

### Phase 3: Complete Coverage (70+ agencies)

- All agencies in PSC Scorecard
- Specialized agencies
- Sub-agencies with significant procurement

## Source Priority for Each Agency

### For New Agencies:

1. **Check PSC Scorecard**
   - Current rating (Good/Fair/Needs Improvement)
   - Specific evaluation details
   - Link to actual forecast

2. **Access Agency Forecast**
   - Via PSC link or agency OSDBU page
   - Extract project descriptions
   - Identify pain points from requirements

3. **Review GAO Reports**
   - Agency-specific high-risk areas
   - Testimonies and audits
   - Management challenges

4. **Check SBA Scorecard**
   - Small business goal performance
   - Set-aside preferences
   - Subcontracting opportunities

5. **Review Strategic Plans**
   - Agency priorities
   - Budget justifications
   - Performance plans

## Data Collection Template

For each new agency:

```json
{
  "name": "Agency Full Name",
  "abbreviation": "Agency",
  "parentAgency": null,
  "description": "...",
  "website": "...",
  "budget": {
    "fiscalYear": "2025",
    "totalBudget": "$XXX billion",
    "procurementBudget": "$XXX billion"
  },
  "pscScorecard": {
    "year": "2024",
    "rating": "Good|Fair|Needs Improvement",
    "forecastUrl": "...",
    "notes": "Specific gaps or strengths identified"
  },
  "sbaScorecard": {
    "year": "2024",
    "grade": "A+|A|B|C|D|F",
    "smallBusinessGoal": "XX%",
    "notes": "..."
  },
  "painPoints": [
    {
      "point": "...",
      "source": "...",
      "priority": "high|medium|low"
    }
  ],
  "strategicPriorities": [...],
  "sources": {...}
}
```

## Automation Opportunities

### For PSC Scorecard:

1. **Web Scraping**
   - Scrape PSC scorecard page for agency list
   - Extract ratings and evaluation details
   - Capture forecast URLs

2. **Forecast Aggregation**
   - Automated checking of forecast URLs
   - Extract common pain point themes
   - Track forecast quality over time

3. **SBA Scorecard Integration**
   - Scrape SBA scorecard for grades
   - Extract small business goal performance
   - Identify agencies struggling with goals

### Tools Needed:

- Web scraping library (Puppeteer, Cheerio, Playwright)
- PDF parsing (pdf-parse, pdfjs)
- Data extraction and NLP for pain point identification
- Scheduled job runner (cron, n8n)

## Success Metrics

- **Coverage**: Number of agencies with knowledge base entries
- **Quality**: Percentage with source citations
- **Currency**: Last update dates
- **Usage**: Frequency of agency data access in app
- **Accuracy**: User feedback on pain point relevance

## Timeline Estimate

- **Phase 1 (9 agencies)**: 2-3 weeks (manual curation)
- **Phase 2 (30 agencies)**: 6-8 weeks (with partial automation)
- **Phase 3 (70+ agencies)**: 3-4 months (with full automation)

## Next Steps

1. ✅ Document PSC Scorecard process (done)
2. ⏳ Create first batch of Tier 1 agencies (HHS, Treasury, Interior)
3. ⏳ Build automation tools for forecast extraction
4. ⏳ Set up scheduled updates workflow
5. ⏳ Implement agency discovery from PSC Scorecard

