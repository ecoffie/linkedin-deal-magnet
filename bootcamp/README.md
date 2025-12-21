# Agency Knowledge Base

This directory contains comprehensive knowledge bases for major federal agencies and their key contracting offices.

## Structure

```
bootcamp/
├── agencies/
│   ├── index.json          # Agency lookup index
│   ├── dod.json            # Department of Defense
│   ├── navy.json           # Department of the Navy (includes NAVSEA, NAVWAR, NAVAIR)
│   ├── navfac.json         # NAVFAC specific
│   ├── usace.json          # U.S. Army Corps of Engineers
│   ├── army.json           # Department of the Army
│   ├── air-force.json      # Department of the Air Force (includes AFMC, AFSC)
│   ├── va.json             # Department of Veterans Affairs
│   ├── dhs.json            # Department of Homeland Security (includes CBP)
│   ├── gsa.json            # General Services Administration
│   ├── nasa.json           # NASA
│   └── doe.json            # Department of Energy
├── agency-pain-points.json # Legacy file (deprecated - use agencies/ instead)
└── README.md               # This file
```

## Knowledge Base Schema

Each agency JSON file contains:

```json
{
  "name": "Agency Full Name",
  "abbreviation": "Agency",
  "parentAgency": "Parent Agency (if applicable)",
  "description": "Brief agency description",
  "website": "https://agency.gov",
  "budget": {
    "fiscalYear": "2024",
    "totalBudget": "$XXX billion",
    "procurementBudget": "$XXX billion"
  },
  "painPoints": [
    "Priority pain point 1",
    "Priority pain point 2"
  ],
  "strategicPriorities": [
    "Strategic priority 1",
    "Strategic priority 2"
  ],
  "commonNAICSCodes": [
    "541511",
    "541512"
  ],
  "contractTypes": [
    "Fixed-Price",
    "IDIQ"
  ],
  "setAsidePreferences": {
    "smallBusiness": "Preference description",
    "WOSB": "Preference description",
    "8a": "Preference description",
    "HUBZone": "Preference description",
    "SDVOSB": "Preference description",
    "VOSB": "Preference description"
  },
  "typicalContractSizes": {
    "small": "$150K - $5M",
    "medium": "$5M - $50M",
    "large": "$50M+"
  },
  "procurementCharacteristics": {
    "prefers": [
      "Preference 1",
      "Preference 2"
    ],
    "contractingTimeline": "6-12 months average",
    "competitionLevel": "Competitive",
    "evaluationFactors": [
      "Factor 1",
      "Factor 2"
    ]
  },
  "keyOffices": [
    "Key office 1",
    "Key office 2"
  ],
  "insights": [
    "Market insight 1",
    "Market insight 2"
  ]
}
```

## Usage

The knowledge base is automatically loaded by the Opportunity Scout modal when viewing agency details. It displays:

1. **Key Priorities & Pain Points** - Current agency challenges and focus areas
2. **Strategic Priorities** - High-level strategic initiatives
3. **Market Insights** - Practical insights for contractors

## Adding New Agencies

1. Create a new JSON file in `agencies/` following the schema above
2. Add an entry to `agencies/index.json` with aliases for matching
3. The frontend will automatically use it via the index lookup

## Maintenance

- Update budget information annually
- Refresh pain points and strategic priorities quarterly
- Add new insights based on market research and contract data analysis
- Update NAICS codes based on actual contract awards
- **Review PSC Federal Business Forecast Scorecard annually** (covers 70+ agencies)
- **Check SBA Procurement Scorecards annually** for small business goal performance

## Comprehensive Sources for 70+ Agencies

### GSA Acquisition Gateway
- **Coverage**: Centralized forecasts from multiple agencies (migrating from individual agency sites)
- **URL**: https://hallway.acquisition.gov/forecast
- **Update Frequency**: Ongoing as agencies publish forecasts
- **Value**: Centralized access to procurement forecasts with detailed opportunity descriptions and small business set-aside information
- **Use**: Primary source for extracting pain points from forecast project descriptions, identifying upcoming opportunities, tracking agency procurement patterns
- **Guide**: See `GSA_ACQUISITION_GATEWAY_GUIDE.md` for detailed usage instructions

### PSC Federal Business Forecast Scorecard
- **Coverage**: 70+ federal agencies
- **URL**: https://www.pscouncil.org/scorecard
- **Update Frequency**: Annual (typically Q2-Q3)
- **Value**: Evaluates procurement forecast quality, identifies agencies with good/poor forecasting practices
- **Use**: Identify agencies to prioritize, extract indirect pain points from evaluation gaps

### SBA Procurement Scorecards
- **Coverage**: All major federal agencies
- **URL**: https://www.sba.gov/federal-contracting/contracting-data/small-business-procurement-scorecard
- **Update Frequency**: Annual
- **Value**: Grades agencies on small business goal achievement (A+ to F)
- **Use**: Identify agencies struggling with small business access, extract pain points

### GovConChamber.com
- **Coverage**: Comprehensive agency lists and procurement trend analysis
- **Update Frequency**: Ongoing/annual
- **Value**: Aggregated agency forecasts and procurement insights
- **Use**: Cross-reference with other sources, identify emerging trends

See `PSC_SCORECARD_GUIDE.md`, `GSA_ACQUISITION_GATEWAY_GUIDE.md`, and `AGENCY_EXPANSION_ROADMAP.md` for detailed expansion strategies.

