# Firecrawl Setup for Agency Pain Point Scraper

This guide explains how to set up and use Firecrawl for scraping agency forecasts.

## What is Firecrawl?

Firecrawl is a web scraping service that:
- Handles JavaScript-rendered content
- Extracts clean markdown/HTML
- Bypasses many anti-bot measures
- Provides reliable scraping infrastructure

## Setup Options

### Option 1: Firecrawl API (Direct)

1. **Get API Key**
   - Sign up at https://firecrawl.dev
   - Get your API key from the dashboard

2. **Set Environment Variable**
   ```bash
   export FIRECRAWL_API_KEY=your-api-key-here
   ```
   
   Or add to `.env` file:
   ```
   FIRECRAWL_API_KEY=your-api-key-here
   ```

3. **Use the Scraper**
   ```bash
   node scraper-firecrawl.js "Department of Education" "ED"
   ```

### Option 2: Firecrawl MCP (Model Context Protocol)

If you have Firecrawl MCP configured in Cursor/Claude Desktop:

1. **Check MCP Configuration**
   - In Cursor: Settings → MCP Servers
   - Verify Firecrawl MCP is configured
   - API key should be in MCP config

2. **The scraper will detect MCP availability**
   - MCP tools are available directly to the AI
   - The code can be modified to use MCP calls instead of direct API

## Using the Scraper

### Basic Usage

```bash
cd bootcamp/scraper

# Set API key
export FIRECRAWL_API_KEY=your-key

# Run scraper
node scraper-firecrawl.js "Department of Education" "ED"
```

### What It Does

1. **Scrapes GSA Acquisition Gateway**
   - Uses Firecrawl to get clean content
   - Extracts markdown and HTML
   - Handles JavaScript rendering

2. **Extracts Pain Points**
   - Parses content for forecast descriptions
   - Identifies pain points using keyword matching
   - Assigns priority levels

3. **Saves Results**
   - JSON file with forecasts and pain points
   - Ready for review and integration

## Firecrawl API Endpoints

The scraper uses Firecrawl's `/v1/scrape` endpoint:

```javascript
POST https://api.firecrawl.dev/v1/scrape
Headers:
  Authorization: Bearer YOUR_API_KEY
  Content-Type: application/json

Body:
{
  "url": "https://hallway.acquisition.gov/forecast?q=Department%20of%20Education",
  "formats": ["markdown", "html"],
  "onlyMainContent": true,
  "waitFor": 3000
}
```

## Using Firecrawl MCP

If you have MCP configured, you can ask the AI to:

1. **Scrape URLs directly**
   - "Use Firecrawl to scrape https://hallway.acquisition.gov/forecast"
   - The AI will use MCP tools if available

2. **Extract specific content**
   - "Extract forecast descriptions from this page"
   - AI can use Firecrawl MCP to get content

## Cost Considerations

Firecrawl has usage-based pricing:
- Free tier: Limited requests
- Paid plans: Based on pages scraped
- Check https://firecrawl.dev/pricing for current rates

**Recommendation**: Start with free tier for testing, upgrade as needed.

## Troubleshooting

### "API Key Not Found"
- Set `FIRECRAWL_API_KEY` environment variable
- Or configure in MCP settings

### "Rate Limit Exceeded"
- You've hit the free tier limit
- Wait or upgrade plan
- Add delays between requests

### "No Content Returned"
- Site may be blocking Firecrawl
- Try different URL format
- Check if site requires authentication

### "Timeout Errors"
- Increase timeout in code
- Site may be slow to load
- Check network connection

## Advantages Over Custom Scraper

✅ **More Reliable**: Handles JavaScript, anti-bot measures  
✅ **Less Code**: No need to write complex scraping logic  
✅ **Better Results**: Clean markdown extraction  
✅ **Maintained**: Firecrawl team handles updates  

## Next Steps

1. ✅ Get Firecrawl API key
2. ✅ Set environment variable
3. ✅ Test scraper with one agency
4. ✅ Review extracted pain points
5. ✅ Integrate into knowledge base

