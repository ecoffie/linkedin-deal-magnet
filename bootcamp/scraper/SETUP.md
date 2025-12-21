# Scraper Setup & Installation

## Quick Start

```bash
cd bootcamp/scraper
npm install
```

## Dependencies

The scraper uses:
- **Puppeteer**: Browser automation for JavaScript-heavy sites
- **Cheerio**: HTML parsing (server-side jQuery)
- **Axios**: HTTP requests
- **fs-extra**: File system utilities

## Installation

```bash
npm install
```

This will install all dependencies listed in `package.json`.

## Important Notes

### ⚠️ GSA Gateway Structure

The scraper includes **template code** that needs to be adapted to the actual HTML structure of the GSA Acquisition Gateway. You'll need to:

1. **Inspect the actual site**:
   - Visit https://hallway.acquisition.gov/forecast
   - Open browser DevTools (F12)
   - Inspect the HTML structure
   - Update selectors in `scraper.js`

2. **Test selectors**:
   - The current selectors are placeholders
   - They may not match the actual site structure
   - Update the `$()` Cheerio selectors based on real HTML

### Site Access

Some sites may:
- Require authentication
- Use JavaScript rendering (needs Puppeteer)
- Have CAPTCHA or bot detection
- Change structure frequently

### Legal/Ethical Considerations

✅ **Do**:
- Only scrape publicly available data
- Respect robots.txt
- Use reasonable delays between requests
- Follow terms of service

⚠️ **Be Careful**:
- Check if scraping is allowed
- Some sites explicitly prohibit scraping
- Government sites are generally more permissive

## Testing the Scraper

```bash
# Test with a simple agency
node scraper.js "Department of Education" "ED"
```

If it doesn't work immediately:
1. Check the console output
2. Inspect the actual website structure
3. Update selectors in the code
4. Test again

## Troubleshooting

### "No forecasts found"
- The site structure may have changed
- Inspect the actual HTML
- Update CSS selectors in the code

### "Timeout errors"
- Site may be slow
- Increase timeout in CONFIG
- Check internet connection

### "Puppeteer issues"
- May need to install Chromium dependencies
- On Linux: `sudo apt-get install -y chromium-browser`
- Or use `puppeteer-core` with system Chrome

## Next Steps

1. Install dependencies: `npm install`
2. Test the scraper: `node scraper.js "Department of Education" "ED"`
3. Inspect output in `extractions/scraped/`
4. Adapt code to actual site structure
5. Use extracted data to fill knowledge base

