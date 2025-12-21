# Procurement Forecast Sources

This document lists all the procurement forecast sources used by the scraper.

## Primary Sources

### 1. GSA Acquisition Gateway
- **URL**: https://hallway.acquisition.gov/forecast
- **Search**: Can be searched by agency name
- **Coverage**: Centralized forecasts from multiple agencies
- **Format**: Web interface with search functionality

### 2. Acquisition.gov Procurement Forecasts
- **URL**: https://www.acquisition.gov/procurement-forecasts
- **Coverage**: Aggregated list of agency forecasts (searchable)
- **Format**: Aggregated listing

## Agency-Specific Sources

### Department of Defense (DoD)
- **URL**: https://business.defense.gov
- **Office**: OSDBU (Office of Small Business Programs)
- **Coverage**: DoD-wide procurement forecasts

### Department of Homeland Security (DHS)
- **URL**: https://www.dhs.gov
- **Coverage**: DHS procurement forecasts
- **Note**: Check OSDBU section for forecasts

### Department of Veterans Affairs (VA)
- **URL**: https://www.va.gov/osdbu/acquisition-forecast
- **Office**: OSDBU
- **Coverage**: VA-specific procurement forecasts

### Department of Energy (DOE)
- **URL**: https://www.energy.gov/osbp/acquisition-forecast
- **Office**: OSBP (Office of Small and Disadvantaged Business Utilization)
- **Coverage**: DOE-specific procurement forecasts

## How to Add New Agency Sources

1. Add the agency name and URLs to `AGENCY_FORECAST_URLS` in `scraper-firecrawl.js`:

```javascript
const AGENCY_FORECAST_URLS = {
  'Agency Name': [
    'https://agency.gov/forecast-url',
    'https://hallway.acquisition.gov/forecast'
  ]
};
```

2. The scraper will automatically scrape all listed URLs for that agency.

## Usage

```bash
export FIRECRAWL_API_KEY=your-key
node scraper-firecrawl.js "Department of Education" "ED"
```

The scraper will:
1. Look up URLs for the agency
2. Scrape each URL using Firecrawl
3. Extract forecasts and pain points
4. Combine results from all sources
5. Save to JSON file

