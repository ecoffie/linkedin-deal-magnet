# Firecrawl Scraper - Quick Start

## Your API Key is Configured ✅

Your Firecrawl API key is already set up in the code and wrapper script.

## Usage

### Option 1: Use the wrapper script (easiest)

```bash
cd bootcamp/scraper
./scrape.sh "Department of Education" "ED"
```

### Option 2: Run directly

```bash
cd bootcamp/scraper
FIRECRAWL_API_KEY=fc-e76ef9c64efa416a9e012e871a62db82 node scraper-firecrawl.js "Department of Education" "ED"
```

## Examples

```bash
# Department of Education
./scrape.sh "Department of Education" "ED"

# Department of Defense
./scrape.sh "Department of Defense" "DoD"

# Department of Veterans Affairs
./scrape.sh "Department of Veterans Affairs" "VA"

# Department of Energy
./scrape.sh "Department of Energy" "DOE"
```

## Output

Results are saved to: `bootcamp/extractions/scraped/[agency]-firecrawl-[timestamp].json`

Each file contains:
- Scraped forecasts from agency forecast pages
- Extracted pain points
- Source URLs
- Metadata

## Next Steps

1. Run the scraper for agencies you want to extract
2. Review the extracted JSON files
3. Integrate pain points into the knowledge base JSON files
4. Update agency files in `bootcamp/agencies/`

