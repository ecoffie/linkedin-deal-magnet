# 🎯 Command Database Sources Guide

**Complete guide to finding agency lists, Office of Small Business contacts, and forecast lists for your command database**

---

## 📋 Table of Contents

1. [Complete Agency List](#complete-agency-list)
2. [Office of Small Business Contacts](#office-of-small-business-contacts)
3. [Forecast Lists](#forecast-lists)
4. [Data Structure Reference](#data-structure-reference)

---

## 📊 Complete Agency List

### Primary Sources

#### 1. **Agency JSON Files** (Your Main Database)
**Location:** `/bootcamp/agencies/`

**Files:**
- `index.json` - Master index mapping agency names to JSON files
- `dod.json` - Department of Defense
- `navy.json` - Department of the Navy
- `navfac.json` - NAVFAC
- `usace.json` - USACE
- `air-force.json` - Department of the Air Force
- `army.json` - Department of the Army
- `va.json` - Department of Veterans Affairs
- `dhs.json` - Department of Homeland Security
- `gsa.json` - General Services Administration
- `nasa.json` - NASA
- `doe.json` - Department of Energy
- `hhs.json` - Department of Health and Human Services
- `treasury.json` - Department of the Treasury
- `epa.json` - Environmental Protection Agency
- `commerce.json` - Department of Commerce
- `dot.json` - Department of Transportation
- `doi.json` - Department of the Interior
- `usda.json` - Department of Agriculture
- `education.json` - Department of Education
- `labor.json` - Department of Labor
- `sba.json` - Small Business Administration
- `opm.json` - Office of Personnel Management
- `ssa.json` - Social Security Administration
- `nrc.json` - Nuclear Regulatory Commission
- `fcc.json` - Federal Communications Commission
- `state.json` - Department of State
- `doj.json` - Department of Justice
- `hud.json` - Department of Housing and Urban Development
- `nsf.json` - National Science Foundation
- `usaid.json` - Agency for International Development

**Total:** 30+ agency JSON files

**Structure Example:**
```json
{
  "name": "Department of Defense",
  "abbreviation": "DoD",
  "website": "https://www.defense.gov",
  "budget": {...},
  "painPoints": [...],
  "strategicPriorities": [...],
  "sources": {...}
}
```

#### 2. **Component Agency Rules** (Office-Level Mapping)
**Location:** `/bootcamp/component-agency-rules.json`

**Purpose:** Maps contracting offices to parent agencies and component agencies

**Contains:**
- Office codes (e.g., "N62473" for NAVFAC)
- Component agency patterns (e.g., "NAVFAC", "USACE", "DISA")
- Parent agency mapping
- Office name patterns
- Keywords for matching

**Use For:**
- Identifying which parent agency an office belongs to
- Extracting component agencies from office names
- Matching office codes to agencies

#### 3. **Agency Index** (Master Reference)
**Location:** `/bootcamp/agencies/index.json`

**Contains:**
- Complete list of all agencies
- Aliases for each agency (e.g., "DoD", "Defense", "DOD")
- File mapping (which JSON file contains each agency)

**Example:**
```json
{
  "agencies": {
    "Department of Defense": {
      "file": "dod.json",
      "aliases": ["DoD", "Defense", "DOD"]
    }
  }
}
```

#### 4. **Agency Pain Points Database**
**Location:** `/bootcamp/agency-pain-points.json`

**Contains:**
- Pain points for each agency
- Source citations
- Priority levels
- FY2026 NDAA updates

---

## 👥 Office of Small Business Contacts

### Where to Find Office of Small Business Contacts

#### 1. **Agency OSDBU/OSBP Pages** (Primary Source)

Each agency has an Office of Small and Disadvantaged Business Utilization (OSDBU) or Office of Small Business Programs (OSBP) that maintains contact information for the Office of Small Business.

**Common URL Patterns:**
- `https://[agency].gov/osdbu/`
- `https://[agency].gov/osbp/`
- `https://[agency].gov/small-business/`
- `https://www.[agency].gov/about/organization/osdbu/`

**Agency-Specific URLs:**

| Agency | OSDBU/OSBP URL |
|--------|---------------|
| **DoD** | https://business.defense.gov |
| **VA** | https://www.va.gov/osdbu/ |
| **DHS** | https://www.dhs.gov/osdbu |
| **GSA** | https://www.gsa.gov/about-us/organization/office-of-small-and-disadvantaged-business-utilization-osdbu |
| **NASA** | https://www.nasa.gov/offices/osdbu/home/index.html |
| **DOE** | https://www.energy.gov/osbp/office-small-and-disadvantaged-business-utilization |
| **HHS** | https://www.hhs.gov/about/agencies/asa/osdbu/index.html |
| **USDA** | https://www.usda.gov/da/osdbu |
| **DOT** | https://www.transportation.gov/osdbu |
| **DOI** | https://www.doi.gov/osdbu |
| **ED** | https://www2.ed.gov/about/offices/list/ocfo/osdbu/index.html |
| **DOL** | https://www.dol.gov/agencies/osdbu |
| **SSA** | https://www.ssa.gov/osdbu/ |

#### 2. **SAM.gov** (System for Award Management)

**URL:** https://sam.gov

**How to Use:**
1. Search for contracting offices
2. Each office listing includes:
   - Office ID
   - Contact information
   - Office of Small Business contact details
   - Office location

**Search Methods:**
- By office name
- By office code (e.g., "N62473")
- By agency
- By location

#### 3. **GSA Acquisition Gateway**

**URL:** https://hallway.acquisition.gov

**Contains:**
- Agency contracting office directories
- Small business liaison information
- Office contact details

#### 4. **Agency JSON Files** (Your Database)

**Location:** `/bootcamp/agencies/*.json`

**Current Status:** Most agency JSON files include:
- Agency website
- OSDBU/OSBP URLs in `sources.primary`
- Forecast URLs

**To Add Office of Small Business Contacts:**
You can add an `osdbu` or `officeOfSmallBusiness` section to each agency JSON file:

```json
{
  "osdbu": {
    "url": "https://www.va.gov/osdbu/",
    "email": "osdbu@va.gov",
    "phone": "(202) 461-4300",
    "address": "810 Vermont Avenue NW, Washington, DC 20420",
    "officeName": "Office of Small and Disadvantaged Business Utilization"
  },
  "officeOfSmallBusiness": {
    "url": "https://www.va.gov/osdbu/",
    "email": "osdbu@va.gov",
    "phone": "(202) 461-4300",
    "address": "810 Vermont Avenue NW, Washington, DC 20420",
    "contacts": [
      {
        "name": "Office of Small Business",
        "title": "OSDBU Staff",
        "email": "osdbu@va.gov",
        "phone": "(202) 461-4300"
      }
    ]
  }
}
```

#### 5. **Component Agency Offices of Small Business**

Many component agencies have their own Office of Small Business:

**Examples:**
- **NAVFAC** - https://www.navfac.navy.mil/Business-Opportunities/Small-Business/
- **USACE** - https://www.usace.army.mil/Business-With-Us/Small-Business-Programs/
- **DISA** - https://www.disa.mil/About/Small-Business
- **DLA** - https://www.dla.mil/SmallBusiness/
- **MDA** - https://www.mda.mil/business/small_business.html

**How to Find:**
1. Search agency website for "small business" or "OSDBU" or "Office of Small Business"
2. Check component agency websites
3. Look for "Business Opportunities" or "Doing Business With Us" sections
4. Look for "Office of Small Business" or "OSDBU" pages

#### 6. **Scraped OSDBU Resources**

**Location:** `/bootcamp/extractions/scraped/industry-events/`

**Contains:**
- Scraped OSDBU pages
- Event information
- Contact details from events

**Files:**
- `www_va_gov_osdbu.md` - VA OSDBU scraped content
- Other agency OSDBU pages

---

## 📅 Forecast Lists

### Primary Sources

#### 1. **GSA Acquisition Gateway** (Centralized)

**URL:** https://hallway.acquisition.gov/forecast

**Features:**
- Searchable by agency name
- Centralized forecasts from multiple agencies
- Updated regularly
- Can filter by:
  - Agency
  - NAICS code
  - Contract type
  - Estimated value
  - Fiscal year

**How to Use:**
1. Navigate to forecast section
2. Search by agency name
3. Filter by your criteria
4. Export or view forecast data

#### 2. **Acquisition.gov Procurement Forecasts**

**URL:** https://www.acquisition.gov/procurement-forecasts

**Contains:**
- Aggregated list of agency forecasts
- Links to agency-specific forecasts
- Searchable database

#### 3. **Agency-Specific Forecast URLs**

**Documented in:** `/bootcamp/scraper/FORECAST_SOURCES.md`

**Agency Forecast URLs:**

| Agency | Forecast URL |
|--------|--------------|
| **DoD** | https://business.defense.gov |
| **VA** | https://www.va.gov/osdbu/acquisition-forecast |
| **DOE** | https://www.energy.gov/osbp/acquisition-forecast |
| **USDA** | https://www.usda.gov/da/osdbu/forecast |
| **SSA** | https://www.ssa.gov/osdbu/contract-forecast-intro.html |

**Common URL Patterns:**
- `https://[agency].gov/osdbu/acquisition-forecast`
- `https://[agency].gov/osdbu/forecast`
- `https://[agency].gov/osbp/acquisition-forecast`
- `https://business.[agency].gov`

#### 4. **Agency JSON Files** (Your Database)

**Location:** `/bootcamp/agencies/*.json`

**Contains:**
- Forecast URLs in `sources.primary` section
- Example from `va.json`:
  ```json
  "sources": {
    "primary": [
      "VA Acquisition Forecast - https://www.va.gov/osdbu/acquisition-forecast"
    ]
  }
  ```

#### 5. **Forecast Scraper**

**Location:** `/bootcamp/scraper/`

**Files:**
- `FORECAST_SOURCES.md` - Complete list of forecast sources
- `scraper-firecrawl.js` - Scraper for forecast data
- `extract-forecast-pdfs.js` - PDF extraction tool

**How to Use:**
```bash
export FIRECRAWL_API_KEY=your-key
node scraper-firecrawl.js "Department of Education" "ED"
```

**What It Does:**
1. Looks up forecast URLs for the agency
2. Scrapes each URL using Firecrawl
3. Extracts forecasts and pain points
4. Combines results from all sources
5. Saves to JSON file

---

## 📐 Data Structure Reference

### Agency JSON Structure

```json
{
  "name": "Department of Defense",
  "abbreviation": "DoD",
  "parentAgency": null,
  "description": "...",
  "website": "https://www.defense.gov",
  "budget": {
    "fiscalYear": "2024",
    "totalBudget": "$816.7 billion",
    "procurementBudget": "$145.9 billion"
  },
  "painPoints": [
    {
      "point": "...",
      "source": "...",
      "priority": "high"
    }
  ],
  "strategicPriorities": [...],
  "sources": {
    "primary": [
      "DoD Acquisition Forecast - https://business.defense.gov"
    ],
    "secondary": [...]
  },
  "commonNAICSCodes": [...],
  "contractTypes": [...],
  "setAsidePreferences": {...},
  "typicalContractSizes": {...},
  "procurementCharacteristics": {...}
}
```

### Component Agency Rules Structure

```json
{
  "departmentRules": {
    "Department of Defense": {
      "components": [
        {
          "name": "Defense Logistics Agency",
          "aliases": ["DLA"],
          "patterns": ["Defense Logistics Agency", "\\bDLA\\b"],
          "officeCodes": [],
          "keywords": ["DLA", "Defense Logistics"],
          "hasPainPoints": true
        }
      ]
    }
  }
}
```

---

## 🔍 How to Build Your Command Database

### Step 1: Get Complete Agency List

1. **Read `/bootcamp/agencies/index.json`**
   - Lists all agencies
   - Maps to JSON files

2. **Read each agency JSON file**
   - Contains agency details
   - Includes forecast URLs
   - Has pain points

3. **Read `/bootcamp/component-agency-rules.json`**
   - Maps offices to agencies
   - Identifies component agencies

### Step 2: Get Office of Small Business Contacts

1. **For Each Agency:**
   - Check agency JSON file for OSDBU/OSBP URL
   - Visit Office of Small Business (OSDBU/OSBP) page
   - Extract contact information for the Office of Small Business
   - Add to agency JSON file

2. **For Component Agencies:**
   - Check component agency website
   - Look for "Small Business" or "OSDBU" or "Office of Small Business" section
   - Extract Office of Small Business contacts
   - Add to component agency rules or separate file

3. **Use SAM.gov:**
   - Search for contracting offices
   - Extract office IDs and Office of Small Business contacts
   - Map to agencies

### Step 3: Get Forecast Lists

1. **Use GSA Acquisition Gateway:**
   - Search by agency
   - Export forecast data
   - Parse into structured format

2. **Scrape Agency Forecasts:**
   - Use forecast URLs from `FORECAST_SOURCES.md`
   - Run scraper for each agency
   - Combine results

3. **Update Agency JSON Files:**
   - Add forecast data to each agency
   - Include forecast URLs
   - Add forecast dates and updates

---

## 📝 Recommended Database Structure

### Option 1: Add to Existing Agency JSON Files

Add these sections to each agency JSON:

```json
{
  "osdbu": {
    "url": "https://www.va.gov/osdbu/",
    "email": "osdbu@va.gov",
    "phone": "(202) 461-4300",
    "address": "...",
    "officeName": "Office of Small and Disadvantaged Business Utilization",
    "contacts": [
      {
        "name": "Office of Small Business",
        "title": "OSDBU Staff",
        "email": "...",
        "phone": "...",
        "office": "..."
      }
    ]
  },
  "forecasts": {
    "url": "https://www.va.gov/osdbu/acquisition-forecast",
    "lastUpdated": "2025-01-15",
    "fiscalYear": "2025",
    "forecastData": [...]
  },
  "contractingOffices": [
    {
      "officeName": "NAVFAC Atlantic",
      "officeCode": "N62473",
      "parentAgency": "Department of the Navy",
      "componentAgency": "NAVFAC",
      "location": "Norfolk, VA",
      "officeOfSmallBusiness": {
        "name": "Office of Small Business",
        "email": "...",
        "phone": "...",
        "url": "..."
      }
    }
  ]
}
```

### Option 2: Create Separate Database Files

Create new files:

- `/bootcamp/office-of-small-business-contacts.json` - All Office of Small Business contacts
- `/bootcamp/forecast-data.json` - All forecast data
- `/bootcamp/contracting-offices.json` - All contracting offices

---

## 🚀 Quick Reference

### Agency List
- **Main Index:** `/bootcamp/agencies/index.json`
- **Agency Files:** `/bootcamp/agencies/*.json`
- **Component Rules:** `/bootcamp/component-agency-rules.json`

### Office of Small Business Contacts
- **Agency OSDBU/OSBP Pages:** Check each agency's website for "Office of Small Business"
- **SAM.gov:** https://sam.gov
- **GSA Acquisition Gateway:** https://hallway.acquisition.gov

### Forecast Lists
- **GSA Acquisition Gateway:** https://hallway.acquisition.gov/forecast
- **Acquisition.gov:** https://www.acquisition.gov/procurement-forecasts
- **Forecast Sources:** `/bootcamp/scraper/FORECAST_SOURCES.md`
- **Agency Forecasts:** Check each agency's OSDBU page

---

## 📚 Additional Resources

### Documentation Files
- `/bootcamp/FORECAST_SOURCES.md` - Complete forecast source list
- `/bootcamp/COMPONENT_AGENCY_MAPPING_GUIDE.md` - Component agency guide
- `/bootcamp/QUICK_REFERENCE_COMPONENT_AGENCIES.md` - Quick reference

### Scrapers
- `/bootcamp/scraper/scraper-firecrawl.js` - Forecast scraper
- `/bootcamp/scraper/extract-forecast-pdfs.js` - PDF extractor

### Extracted Data
- `/bootcamp/extractions/scraped/` - Scraped OSDBU pages
- `/bootcamp/agency-pain-points.json` - Pain points database

---

## ✅ Next Steps

1. **Review Agency JSON Files**
   - Check what's already there
   - Identify missing SBLO contacts
   - Identify missing forecast URLs

2. **Scrape Office of Small Business Contacts**
   - Visit each agency OSDBU/OSBP page
   - Extract Office of Small Business contact information
   - Add to agency JSON files

3. **Scrape Forecast Lists**
   - Use forecast URLs from `FORECAST_SOURCES.md`
   - Run scraper for each agency
   - Update agency JSON files with forecast data

4. **Build Contracting Office Database**
   - Use SAM.gov to find offices
   - Map offices to agencies using component rules
   - Add Office of Small Business contacts for each office

5. **Create Unified Database**
   - Combine all data into structured format
   - Link offices to agencies
   - Link SBLOs to offices
   - Link forecasts to agencies

---

**Last Updated:** December 2025

**Maintained By:** Federal Market Assassin System

