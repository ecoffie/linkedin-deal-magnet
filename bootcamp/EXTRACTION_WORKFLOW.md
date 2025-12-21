# Pain Point Extraction Workflow

This document provides a step-by-step workflow for extracting pain points from authoritative sources and updating the knowledge base.

## Quick Start Checklist

- [ ] Select target agency
- [ ] Gather source documents (Gateway, GAO, Strategic Plans)
- [ ] Extract pain points using template
- [ ] Validate and prioritize
- [ ] Create/update JSON file
- [ ] Test in frontend
- [ ] Document sources

## Step-by-Step Process

### Step 1: Select Agency

**For Initial Expansion:**
- Start with Tier 1 agencies from `AGENCY_EXPANSION_ROADMAP.md`
- Recommended first: **HHS** (largest budget, frequent contracts)

**For Updates:**
- Review existing agencies in `agencies/` folder
- Check when last updated
- Identify gaps in current pain points

### Step 2: Gather Source Documents

#### Primary Sources (Must Have):

1. **GSA Acquisition Gateway**
   - URL: https://hallway.acquisition.gov/forecast
   - Search by agency name
   - Export/download relevant forecasts
   - Note: Project descriptions, NAICS codes, values, set-asides

2. **GAO Reports**
   - URL: https://www.gao.gov/highrisk
   - Search agency-specific reports
   - Look for recent testimonies and audits
   - Note: Explicitly stated challenges

3. **Agency Strategic Plan**
   - Usually on agency website
   - Look for "Strategic Plan", "Performance Plan"
   - Note: Priorities and goals

4. **Budget Justification**
   - Agency budget page or OMB site
   - Look for "Congressional Budget Justification"
   - Note: Funding levels, program descriptions

#### Secondary Sources (Nice to Have):

5. **PSC Scorecard**
   - URL: https://www.pscouncil.org/scorecard
   - Check agency rating and evaluation details
   - Note: Forecast quality issues = pain points

6. **SBA Scorecard**
   - URL: https://www.sba.gov/federal-contracting/contracting-data/small-business-procurement-scorecard
   - Check grade and small business goal performance
   - Note: Struggles indicate pain points

7. **OIG Reports**
   - Agency-specific OIG website
   - Recent audit reports
   - Note: Specific problems identified

### Step 3: Extract Pain Points

#### Use This Template for Each Pain Point:

```markdown
**Pain Point #X:**
- Description: [Clear, actionable description]
- Source: [Exact document name and year]
- Source URL: [If available]
- Evidence: [Quote or specific data point]
- Priority: [critical/high/medium/low - based on urgency, funding, frequency]
- Agency Quote: [Direct quote if available]
```

#### Extraction Techniques:

**From Forecast Descriptions:**
- Look for urgency words: "urgent", "critical", "immediate", "pressing"
- Look for problem words: "backlog", "delays", "deficiencies", "gaps", "challenges"
- Look for modernization words: "replacement", "upgrade", "refresh", "modernization"
- Multiple similar projects = recurring pain point

**From GAO Reports:**
- High-risk areas
- "Challenges" sections
- Recommendations (often indicate problems)
- Cost overruns or schedule delays
- Management weaknesses

**From Strategic Plans:**
- Goals/objectives (what they want to achieve = current gap)
- Initiatives (address current problems)
- Performance gaps (what's not meeting targets)

**From Budget Justifications:**
- Program descriptions (why funding needed = problem exists)
- Risk sections
- Justification narratives

#### Priority Assignment:

- **Critical**: Cost overruns, major delays, security threats, system failures
- **High**: Repeated across multiple sources, large funding allocated, strategic priority
- **Medium**: Mentioned in one source, moderate funding, important but not urgent
- **Low**: Minor mentions, small scope, nice-to-have improvements

### Step 4: Validate and Refine

1. **Cross-Reference**: Does the pain point appear in multiple sources?
2. **Verify Currency**: Is this current (FY2025/2026) or outdated?
3. **Check Specificity**: Is it actionable and specific enough?
4. **Remove Duplicates**: Combine similar pain points
5. **Prioritize**: Focus on top 5-10 most important

### Step 5: Extract Strategic Priorities

For each strategic priority:

```markdown
**Priority #X:**
- Description: [Strategic initiative name/description]
- Source: [Document name]
- Funding: [$XXX if available]
- Deadline: [Timeline if available]
- Notes: [Additional context]
```

### Step 6: Create/Update JSON File

#### Use Existing Agency File as Template

1. Copy structure from existing agency (e.g., `dod.json`)
2. Update all fields:
   - `name`, `abbreviation`, `description`
   - `budget` (get from budget justification)
   - `painPoints` (use structured format with source/priority)
   - `strategicPriorities` (use structured format)
   - `sources` (primary and secondary)
   - `commonNAICSCodes` (from forecasts)
   - `insights` (practical tips for contractors)

#### JSON Structure Example:

```json
{
  "name": "Department of Health and Human Services",
  "abbreviation": "HHS",
  "parentAgency": null,
  "description": "...",
  "website": "https://www.hhs.gov",
  "budget": {
    "fiscalYear": "2025",
    "totalBudget": "$XXX billion",
    "procurementBudget": "$XXX billion"
  },
  "painPoints": [
    {
      "point": "Clear, actionable description",
      "source": "Source document name and year",
      "priority": "high"
    }
  ],
  "strategicPriorities": [
    {
      "priority": "Description",
      "source": "Source",
      "funding": "$XXX",
      "deadline": "Timeline"
    }
  ],
  "sources": {
    "primary": [
      "Source 1 - URL",
      "Source 2 - URL"
    ],
    "secondary": [
      "Source 3",
      "Source 4"
    ]
  }
}
```

### Step 7: Update Index

If new agency, update `agencies/index.json`:

```json
"Department of Health and Human Services": {
  "file": "hhs.json",
  "aliases": ["HHS", "Health and Human Services", "Department of HHS"]
}
```

### Step 8: Test

1. **Validate JSON**: Use JSON validator to check syntax
2. **Test in Frontend**: 
   - Start server
   - Navigate to Opportunity Scout
   - Search for agency
   - Click on agency result
   - Verify modal displays pain points correctly
3. **Check Display**: 
   - Sources appear correctly?
   - Priority badges work?
   - Strategic priorities show funding/deadlines?

### Step 9: Document

Update status in:
- `UPDATE_KNOWLEDGE_BASE.md` - Mark as complete
- `AGENCY_EXPANSION_ROADMAP.md` - Check off agency

## Extraction Template (Copy/Paste)

```markdown
# Agency: [AGENCY NAME]
# Date: [DATE]
# Extractor: [NAME]

## Source Documents Gathered
- [ ] GSA Acquisition Gateway forecasts
- [ ] GAO reports (list specific report numbers)
- [ ] Strategic Plan (year)
- [ ] Budget Justification FY2025
- [ ] PSC Scorecard rating
- [ ] SBA Scorecard grade
- [ ] OIG reports (if available)

## Pain Points Extracted

### Pain Point 1:
- Description:
- Source:
- Source URL:
- Evidence/Quote:
- Priority:
- Cross-referenced in:

### Pain Point 2:
...

## Strategic Priorities Extracted

### Priority 1:
- Description:
- Source:
- Funding:
- Deadline:

## NAICS Codes Identified
[List from forecasts]

## Key Insights for Contractors
[List practical tips]

## Notes
[Any additional context]
```

## Tips for Efficient Extraction

1. **Start with Gateway**: It's the fastest way to see what agencies are buying
2. **Use GAO to Validate**: GAO reports confirm and expand on pain points
3. **Focus on Recent**: Prioritize FY2025/2026 data over older reports
4. **Look for Patterns**: Multiple similar projects = strong pain point
5. **Extract as You Go**: Don't wait until the end - extract while reading
6. **Keep URLs**: Save source URLs for citations
7. **Quote Directly**: Use agency's own words when possible
8. **Set Timers**: Extraction can be time-consuming, work in focused sessions

## Quality Checklist

Before finalizing:
- [ ] Minimum 5 pain points extracted
- [ ] Each pain point has source citation
- [ ] Priority levels assigned
- [ ] Cross-referenced across multiple sources
- [ ] Current (FY2025/2026) data
- [ ] Strategic priorities include funding/deadlines where available
- [ ] Sources section complete with URLs
- [ ] JSON syntax valid
- [ ] Tested in frontend
- [ ] Documentation updated

## Next Steps

Ready to extract? Pick your first agency and use this workflow!

**Recommended Starting Points:**
1. **HHS** - Large budget, many contracts, healthcare focus
2. **Treasury** - Financial systems, IT modernization
3. **Interior** - Infrastructure, climate resilience

See `AGENCY_EXPANSION_ROADMAP.md` for full priority list.

