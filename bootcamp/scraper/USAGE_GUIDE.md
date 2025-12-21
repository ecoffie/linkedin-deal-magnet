# Scraper Usage Guide

Complete guide for using the agency pain point scraper.

## Setup

```bash
cd bootcamp/scraper
npm install
```

## Step 1: Inspect the Target Site

Before scraping, you need to understand the site structure:

```bash
# Inspect GSA Acquisition Gateway
node inspect-site.js "https://hallway.acquisition.gov/forecast" gsa-gateway.html
```

This will:
- Open the site in a browser
- Save the HTML structure
- Analyze common elements
- Help you identify CSS selectors

**Then:**
1. Open the saved HTML file
2. Use browser DevTools (F12) to inspect elements
3. Find the CSS selectors for forecast entries
4. Note the structure (titles, descriptions, links)

## Step 2: Update Scraper Code

Edit `scraper.js` and update the CSS selectors:

```javascript
// Example: Update these based on actual site structure
$('.forecast-entry, .opportunity, [class*="forecast"]').each((i, elem) => {
  // Your selectors here based on inspection
});
```

## Step 3: Test the Scraper

### Full Puppeteer Version (for JavaScript-heavy sites)

```bash
node scraper.js "Department of Education" "ED"
```

### Simple HTTP Version (for static HTML)

```bash
node simple-scraper.js "Department of Education" "ED"
```

## Step 4: Review Results

Results are saved to: `bootcamp/extractions/scraped/[agency]-scraped-[timestamp].json`

Open the file and review:
- Are forecasts being found?
- Are pain points being extracted correctly?
- Do priorities make sense?

## Step 5: Refine Extraction

If results aren't good:

1. **Adjust keywords** in `PAIN_POINT_KEYWORDS` object
2. **Improve sentence extraction** logic
3. **Fine-tune priority** assignment
4. **Add negative keywords** to filter out false positives

## Step 6: Convert to Knowledge Base Format

Once you have good scraped data:

```bash
node convert-to-kb.js scraped/ed-scraped-1234567890.json ../agencies/dod.json
```

This converts the scraped format to knowledge base JSON format.

## Step 7: Manual Review & Integration

⚠️ **Always manually review** scraped pain points:

1. Read each pain point
2. Verify it makes sense
3. Check source citations
4. Adjust priorities if needed
5. Remove duplicates
6. Add context if needed

Then integrate into the actual agency file.

## Example Workflow

```bash
# 1. Inspect site structure
node inspect-site.js "https://hallway.acquisition.gov/forecast"

# 2. Update selectors in scraper.js (manual edit)

# 3. Test scraping
node scraper.js "Department of Education" "ED"

# 4. Review output
cat extractions/scraped/ed-scraped-*.json | jq '.painPoints[]'

# 5. Convert to KB format
node convert-to-kb.js extractions/scraped/ed-scraped-*.json ../agencies/dod.json

# 6. Manual review and integration
# Edit the generated file, then move to agencies/ folder
```

## Troubleshooting

### No forecasts found
- Site structure changed → Inspect again
- Selectors wrong → Update CSS selectors
- Site requires JavaScript → Use Puppeteer version
- Site requires login → May need authentication

### Too many false positives
- Adjust keyword matching
- Add negative keywords
- Improve sentence extraction
- Increase minimum text length

### Rate limiting
- Increase delay between requests
- Use proxies (if appropriate)
- Reduce concurrent requests

### Timeout errors
- Site is slow → Increase timeout
- Network issues → Check connection
- Site blocking → Try different approach

## Best Practices

1. **Start Small**: Test with one agency first
2. **Respectful**: Use delays, follow robots.txt
3. **Validate**: Always manually review results
4. **Document**: Note what works/doesn't work
5. **Update**: Sites change - be ready to adapt

## Limitations

- Site structure changes will break scrapers
- May miss nuanced pain points
- Requires manual review
- Legal/ethical considerations apply
- Some sites may block automated access

## Next Steps

After scraping:
1. ✅ Manual review of all pain points
2. ✅ Cross-reference with GAO reports
3. ✅ Verify with strategic plans
4. ✅ Refine and enhance
5. ✅ Integrate into knowledge base

