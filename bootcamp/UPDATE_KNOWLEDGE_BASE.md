# Knowledge Base Update Guide

This guide explains how to update the agency knowledge base with current, sourced pain points.

## Current Status

✅ **Updated with Source Citations:**
- DoD (Department of Defense)
- DHS (Department of Homeland Security)
- VA (Department of Veterans Affairs)
- GSA (General Services Administration)
- DOE (Department of Energy)
- Navy (Department of the Navy)
- NAVFAC
- USACE (U.S. Army Corps of Engineers)
- Army (Department of the Army)
- Air Force (Department of the Air Force)
- NASA

**All 11 agencies now have comprehensive sourced pain points!**

## Update Process

### 1. Source Data Collection

Use these priority sources (ranked by authority):

1. **Agency Acquisition Forecasts** (Primary)
   - GSA Acquisition Gateway: https://hallway.acquisition.gov/forecast
   - DoD: https://business.defense.gov
   - DHS: https://www.dhs.gov/acquisition-forecast
   - VA: https://www.va.gov/osdbu/acquisition-forecast
   - Individual agency OSDBU pages

2. **GAO Reports** (Secondary)
   - High-Risk List: https://www.gao.gov/highrisk
   - Agency-specific testimonies and reports

3. **Strategic Plans & Budget Justifications**
   - Agency performance plans
   - Congressional budget justifications
   - Strategic planning documents

### 2. Extract Pain Points

For each agency, extract 5-10 pain points that:
- Are explicitly stated or clearly implied in sources
- Represent current (FY2025) challenges
- Are actionable for contractors
- Can be cited with a source

### 3. Update JSON File

Use this structure for each pain point:

```json
{
  "point": "Clear description of the pain point",
  "source": "Source document name and year (e.g., 'GAO High-Risk List 2025')",
  "priority": "critical|high|medium|low"
}
```

Example:
```json
{
  "point": "IT acquisition delays and legacy system modernization challenges",
  "source": "GAO High-Risk List 2025 - IT Management and Acquisition",
  "priority": "high"
}
```

### 4. Add Sources Section

Add a `sources` section to the agency file:

```json
"sources": {
  "primary": [
    "GAO High-Risk List 2025 - https://www.gao.gov/highrisk",
    "DoD Acquisition Forecast - https://business.defense.gov"
  ],
  "secondary": [
    "OPM Federal Workforce Priorities Report 2025",
    "GSA Acquisition Gateway Forecasts"
  ]
}
```

### 5. Update Strategic Priorities

Enhance strategic priorities with additional context:

```json
{
  "priority": "Description of strategic priority",
  "source": "Source document",
  "funding": "$B+ or $M+ (if available)",
  "deadline": "FY2027 or timeline (if available)"
}
```

## Quick Reference: Agency Files

| Agency | File | Status | Priority Sources |
|--------|------|--------|------------------|
| DoD | `dod.json` | ✅ Updated | GAO, DoD Forecast, Strategic Plan |
| DHS | `dhs.json` | ✅ Updated | GAO, DHS Forecast, OIG Reports |
| VA | `va.json` | ✅ Updated | GAO, VA OIG, Acquisition Forecast |
| GSA | `gsa.json` | ✅ Updated | GSA Forecast, PSC Scorecard |
| Navy | `navy.json` | ⏳ Pending | Navy Forecast, DoD sources |
| NAVFAC | `navfac.json` | ⏳ Pending | NAVFAC Forecast, Navy sources |
| USACE | `usace.json` | ⏳ Pending | USACE Forecast, Army sources |
| Army | `army.json` | ⏳ Pending | Army Forecast, DoD sources |
| Air Force | `air-force.json` | ⏳ Pending | Air Force Forecast, DoD sources |
| NASA | `nasa.json` | ✅ Updated | GAO, NASA Budget, Artemis Program Reports |
| DOE | `doe.json` | ✅ Updated | GAO, DOE Forecast, Strategic Plans |
| Navy | `navy.json` | ✅ Updated | GAO Shipyard Reports, Navy Budget, SeaPort NxG |
| NAVFAC | `navfac.json` | ✅ Updated | GAO, NAVFAC Strategic Plan, SIOP Reports |
| USACE | `usace.json` | ✅ Updated | GAO, BIL Funding, Infrastructure Reports |
| Army | `army.json` | ✅ Updated | GAO, Army Budget, Strategic Plans |
| Air Force | `air-force.json` | ✅ Updated | GAO, Air Force Budget, JADC2 Strategy |

## Automation Opportunities

### Future Enhancements:
1. **PDF Parsing**: Use `pdf-parse` to extract from forecast PDFs
2. **Web Scraping**: Scrape acquisition forecast web pages
3. **Scheduled Updates**: Cron job to check for new publications
4. **API Integration**: Use official APIs where available

### Example Script Structure:
```javascript
// update-knowledge-base.js
// 1. Fetch agency forecast URLs
// 2. Parse PDFs/HTML
// 3. Extract pain points using NLP/keyword matching
// 4. Update JSON files (with manual review step)
// 5. Generate diff report for review
```

## Testing

After updating an agency file:
1. Test in the Opportunity Scout modal
2. Verify pain points display correctly
3. Check source citations are visible
4. Confirm priority badges work (critical/high/medium)
5. Validate JSON syntax

## Notes

- **Backward Compatibility**: Frontend handles both old (string) and new (object) formats
- **Priority Levels**: Use sparingly - only mark as "critical" if truly urgent
- **Sources**: Always use publicly available sources (FAR-compliant)
- **Timeliness**: Update quarterly or when major new reports are published

