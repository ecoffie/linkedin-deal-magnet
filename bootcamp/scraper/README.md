# Agency Pain Point Scraper

Automated web scraper for extracting agency pain points from GSA Acquisition Gateway, GAO reports, and other government sources.

## 🚀 Recommended: Use Firecrawl Version

**If you have Firecrawl MCP available**, use the Firecrawl version:

```bash
node scraper-firecrawl.js "Department of Education" "ED"
```

See `FIRECRAWL_SETUP.md` for setup instructions.

**Advantages:**
- More reliable (handles JavaScript, anti-bot measures)
- Less code to maintain
- Better content extraction
- Professional scraping infrastructure

## Setup

```bash
cd bootcamp/scraper
npm install
```

## 🔄 Periodic Updates (NEW!)

Set up automated periodic scraping and updates:

```bash
cd bootcamp/scraper
./cron-setup.sh install
```

**Quick Start**: See `QUICK_START_PERIODIC_UPDATES.md`  
**Full Documentation**: See `PERIODIC_UPDATES.md`

---

## 📄 PDF Extraction (NEW!)

Automated extraction from downloaded forecast PDFs:

```bash
# Process single PDF
node extract-forecast-pdfs.js --input forecast.pdf --agency "Department of Defense"

# Process directory of PDFs
node extract-forecast-pdfs.js --input ./pdfs --agency "VA"

# Process PDF from URL
node extract-forecast-pdfs.js --url https://agency.gov/forecast.pdf --agency "GSA"
```

**Documentation**: See `PDF_EXTRACTION_GUIDE.md`

---

## Usage

### Basic Usage

```bash
# Scrape an agency
node scraper.js "Department of Education" "ED"

# Or with just the name
node scraper.js "Department of Transportation"
```

### What It Does

1. **GSA Acquisition Gateway**
   - Searches for agency forecasts
   - Extracts forecast descriptions
   - Identifies pain points using keyword matching
   - Assigns priority levels (critical/high/medium)

2. **GAO Reports**
   - Searches GAO website for agency-specific reports
   - Extracts report titles and URLs
   - Can be extended to scrape report contents

3. **Output**
   - Saves JSON file with:
     - All forecasts found
     - Extracted pain points
     - Source citations
     - Priority levels

### Output Format

Results are saved to: `bootcamp/extractions/scraped/[agency]-scraped-[timestamp].json`

```json
{
  "agency": "Department of Education",
  "abbreviation": "ED",
  "scrapedAt": "2025-01-XX",
  "sources": {
    "gsaGateway": {
      "source": "GSA Acquisition Gateway",
      "url": "https://hallway.acquisition.gov/forecast",
      "forecastsFound": 15,
      "painPointsExtracted": 8
    },
    "gaoReports": [...]
  },
  "painPoints": [
    {
      "point": "Urgent need for IT modernization...",
      "source": "GSA Acquisition Gateway Forecast FY2025 - ED IT Services",
      "sourceUrl": "...",
      "priority": "high",
      "extractedAt": "2025-01-XX"
    }
  ],
  "forecasts": [...]
}
```

## Pain Point Detection

The scraper identifies pain points using keyword matching:

### Urgency Keywords
- urgent, critical, immediate, pressing, emergency

### Modernization Keywords
- modernization, modernize, upgrade, replace, refresh, legacy, outdated, aging

### Problem Keywords
- backlog, delay, deficiency, gap, challenge, issue, problem, risk, vulnerability

### Capacity Keywords
- unable to, cannot, insufficient, limited, overwhelmed, strained

### Priority Assignment
- **Critical**: Urgency + Problem + Capacity
- **High**: Urgency + (Modernization | Problem)
- **Medium**: Problem or Modernization or Capacity

## Configuration

Edit `scraper.js` to adjust:

- `delayBetweenRequests`: Time between requests (default: 2000ms)
- `timeout`: Request timeout (default: 30000ms)
- `userAgent`: Browser user agent string
- `PAIN_POINT_KEYWORDS`: Keywords for pain point detection

## Limitations & Notes

1. **GSA Gateway Structure**: The scraper includes template code that may need adjustment based on the actual HTML structure of the GSA Acquisition Gateway site.

2. **Rate Limiting**: Includes delays between requests to be respectful. Adjust as needed.

3. **Manual Review Required**: Extracted pain points should be manually reviewed for accuracy and relevance.

4. **Site Changes**: Web scrapers break when sites change structure. This code provides a foundation that may need updates.

5. **Legal/Ethical**: 
   - Only scrapes publicly available data
   - Respects robots.txt (should be checked)
   - Uses reasonable delays
   - Follows terms of service

## Next Steps

After scraping:

1. Review extracted pain points
2. Refine and validate
3. Cross-reference with other sources
4. Convert to knowledge base JSON format
5. Update agency file in `agencies/` folder

## Extending the Scraper

### Add New Sources

```javascript
async function scrapeNewSource(agencyName) {
  // Your scraping logic here
  return { painPoints: [...], forecasts: [...] };
}
```

### Improve Pain Point Detection

- Add NLP libraries (Natural, Compromise.js)
- Use machine learning for classification
- Improve sentence extraction logic

### Add More Sources

- Agency strategic plans
- Budget justifications
- OIG reports
- PSC Scorecard data

## Troubleshooting

**Issue**: No forecasts found
- Check if GSA Gateway structure changed
- Verify agency name spelling
- Try with browser automation (Puppeteer) if site uses JavaScript

**Issue**: Too many false positives
- Adjust keyword matching logic
- Add negative keywords
- Improve sentence extraction

**Issue**: Rate limiting/blocking
- Increase `delayBetweenRequests`
- Use proxies (if legally appropriate)
- Rotate user agents

## License

ISC

