# Quick Start: PDF Forecast Extraction

## 🚀 Extract Data from Forecast PDFs in 3 Steps

### Step 1: Download or Collect PDFs

```bash
# Create directory for PDFs
mkdir -p ../extractions/pdfs/forecasts

# Download PDFs (or place manually downloaded PDFs here)
# Example:
# wget https://agency.gov/forecast.pdf -O ../extractions/pdfs/forecasts/agency-forecast.pdf
```

### Step 2: Run Extraction

```bash
cd bootcamp/scraper

# Process directory of PDFs
node extract-forecast-pdfs.js \
  --input ../extractions/pdfs/forecasts \
  --agency "Department of Defense" \
  --output ../extractions/scraped/pdf-forecasts
```

### Step 3: Review Results

Results are saved as JSON files in the output directory with:
- ✅ Extracted forecasts/opportunities
- ✅ Identified pain points
- ✅ NAICS codes, dollar values, timelines
- ✅ Metadata and summaries

---

## 📋 Common Use Cases

### Process Single PDF File
```bash
node extract-forecast-pdfs.js --input forecast.pdf --agency "Department of Veterans Affairs"
```

### Process PDF from URL
```bash
node extract-forecast-pdfs.js \
  --url https://www.agency.gov/forecast-2025.pdf \
  --agency "GSA"
```

### Batch Process Multiple PDFs
```bash
# Place all PDFs in a directory
node extract-forecast-pdfs.js \
  --input ./all-forecasts \
  --agency "DoD" \
  --output ./results
```

### Advanced Structured Extraction
```bash
node batch-pdf-processor.js \
  --dir ./pdfs \
  --agency "Department of Defense" \
  --output ./structured-results
```

---

## 📊 What Gets Extracted

- **Forecasts**: Contract opportunities, procurement forecasts
- **Pain Points**: Government challenges and needs
- **NAICS Codes**: Industry classification codes
- **Dollar Values**: Estimated contract values
- **Timelines**: Dates, fiscal years, quarters
- **Contract Types**: IDIQ, BPA, FSS, etc.

---

## 🔧 Options

- `--input, -i` - PDF file or directory
- `--url, -u` - PDF URL to download
- `--agency, -a` - Agency name (required for metadata)
- `--output, -o` - Output directory
- `--no-pain-points` - Skip pain point extraction

---

For full documentation, see `PDF_EXTRACTION_GUIDE.md`


