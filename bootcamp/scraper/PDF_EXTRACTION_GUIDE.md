# PDF Forecast Extraction Guide

Automated system for extracting structured data from downloaded forecast PDFs.

## Overview

This system provides automated extraction of:
- **Forecasts/Opportunities**: Contract opportunities and procurement forecasts
- **Pain Points**: Government challenges and needs
- **Structured Data**: NAICS codes, dollar values, timelines, contract types
- **Strategic Priorities**: Key agency initiatives and modernization efforts

## Two Tools Available

### 1. `extract-forecast-pdfs.js` - Main Extraction Tool

General-purpose PDF extraction with basic structured data.

**Usage:**
```bash
# Process a single PDF file
node extract-forecast-pdfs.js --input forecast.pdf --agency "Department of Defense"

# Process a directory of PDFs
node extract-forecast-pdfs.js --input ./pdfs --agency "Department of Veterans Affairs"

# Process PDF from URL
node extract-forecast-pdfs.js --url https://agency.gov/forecast.pdf --agency "GSA"
```

**Options:**
- `--input, -i <path>` - PDF file or directory containing PDFs
- `--url, -u <url>` - PDF URL to download and process
- `--output, -o <path>` - Output directory (default: `extractions/scraped/pdf-forecasts`)
- `--agency, -a <name>` - Agency name for metadata
- `--no-pain-points` - Skip pain point extraction
- `--format, -f <type>` - Output format (json|markdown)

### 2. `batch-pdf-processor.js` - Advanced Structured Extraction

Enhanced extraction with LangChain-style structured data parsing.

**Usage:**
```bash
node batch-pdf-processor.js --dir ./pdfs --agency "Department of Defense" --output ./output
```

**Features:**
- Structured extraction of NAICS codes, dollar values, timelines
- Contract type detection
- Strategic priority identification
- Batch processing with summaries

## Example Workflow

### Step 1: Download Forecast PDFs

```bash
# Create directory for PDFs
mkdir -p bootcamp/extractions/pdfs/forecasts

# Manually download PDFs or use wget/curl
# Example:
wget https://agency.gov/forecast.pdf -O bootcamp/extractions/pdfs/forecasts/agency-forecast.pdf
```

### Step 2: Extract Data

```bash
cd bootcamp/scraper

# Process downloaded PDFs
node extract-forecast-pdfs.js \
  --input ../extractions/pdfs/forecasts \
  --agency "Department of Defense" \
  --output ../extractions/scraped/pdf-forecasts
```

### Step 3: Review Results

Results are saved as JSON files with:
- Extracted text
- Forecasts/opportunities
- Pain points
- Metadata (page count, document info)

## What Gets Extracted

### Forecasts/Opportunities
Automatically detected using keywords:
- "forecast", "opportunity", "procurement", "acquisition"
- "RFP", "RFI", "RFQ", "BPA", "IDIQ"
- "NAICS", "estimated value", "contract value"

### Pain Points
Identified using keyword patterns:
- Challenges: challenge, problem, issue, difficulty
- Technical: legacy, modernization, upgrade, migration
- Security: cybersecurity, vulnerability, compliance
- Resources: workforce, staffing, budget, funding

### Structured Data
- **NAICS Codes**: 6-digit codes (e.g., 541330, 236220)
- **Dollar Values**: Extracted amounts (e.g., $5M, $2.5 billion)
- **Timelines**: Dates, fiscal years, quarters
- **Contract Types**: IDIQ, BPA, FSS, GWAC, etc.

## Output Format

### JSON Output
```json
{
  "source": "forecast.pdf",
  "agency": "Department of Defense",
  "extractedAt": "2025-12-21T10:00:00.000Z",
  "metadata": {
    "numPages": 45,
    "textLength": 125000
  },
  "forecasts": [
    {
      "title": "IT Modernization Forecast",
      "description": "...",
      "keywords": ["NAICS: 541330", "Value: $5M"]
    }
  ],
  "painPoints": [
    {
      "point": "Legacy system modernization challenges...",
      "source": "PDF Forecast - Department of Defense",
      "priority": "high",
      "keywords": ["legacy", "modernization", "challenge"]
    }
  ],
  "summary": {
    "forecastCount": 12,
    "painPointCount": 8
  }
}
```

## Integration with Knowledge Base

Extracted data can be integrated into the knowledge base:

```bash
# After extraction, review JSON files
# Then manually add to bootcamp/agencies/[agency].json

# Or use convert-to-kb.js if available
node convert-to-kb.js extracted-data.json
```

## LangChain Integration (Optional)

For more advanced extraction, you can integrate LangChain:

```javascript
// Example LangChain integration
import { ChatOpenAI } from "langchain/chat_models/openai";
import { Document } from "langchain/document";

// Load PDF text
const pdfText = await extractPDFText(pdfPath);

// Use LangChain for structured extraction
const llm = new ChatOpenAI({ modelName: "gpt-4" });
const prompt = `Extract forecasts and pain points from this PDF text: ${pdfText}`;
const result = await llm.call(prompt);
```

## Tips for Best Results

1. **High-Quality PDFs**: Use text-based PDFs (not scanned images)
2. **Clear Structure**: PDFs with clear headings work best
3. **Agency Context**: Always specify agency name for better categorization
4. **Review Output**: Manually review extracted data for accuracy
5. **Batch Processing**: Use batch processor for multiple PDFs

## Troubleshooting

### PDF Too Large
- Default limit: 50MB
- For larger files, split PDF or increase limit in code

### Poor Extraction Quality
- Check if PDF is scanned (image-based)
- Use OCR tools for scanned PDFs
- Try Firecrawl API for better extraction

### Missing Forecasts
- Adjust keyword patterns in `extractForecasts()`
- Review PDF structure and update patterns
- Manually tag important sections

## Advanced Usage

### Custom Extraction Patterns

Edit `extract-forecast-pdfs.js` to customize:
- `FORECAST_INDICATORS`: Keywords for forecast detection
- `PAIN_POINT_KEYWORDS`: Keywords for pain point detection
- Extraction logic in `extractForecasts()` and `extractPainPoints()`

### Integration with Periodic Updates

Add to `periodic-update.js`:
```javascript
// After scraping, check for PDFs
const pdfFiles = await findPDFFiles(scrapedDir);
for (const pdf of pdfFiles) {
    await processPDF(pdf, { agencyName: agency });
}
```

## Next Steps

1. Download forecast PDFs from agency websites
2. Run extraction on downloaded PDFs
3. Review and validate extracted data
4. Integrate into knowledge base JSON files
5. Set up automated processing for new PDFs


