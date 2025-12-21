# PDF Parsing Options for Agency Documents

Government procurement forecasts, GAO reports, and strategic plans are often in PDF format. Here are the best options for parsing them.

## Recommended: Firecrawl (You Already Have It!) 🔥

**Best Option**: Firecrawl can scrape PDFs directly!

```javascript
// Firecrawl can handle PDFs
const response = await axios.post(
  'https://api.firecrawl.dev/v1/scrape',
  {
    url: 'https://example.gov/report.pdf',
    formats: ['markdown', 'html'],
    onlyMainContent: true
  },
  {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  }
);
```

**Advantages:**
- ✅ Already have API key
- ✅ No additional dependencies
- ✅ Handles PDFs automatically
- ✅ Returns clean markdown

**Test it first** - Firecrawl may already do what you need!

---

## Option 1: pdf-parse (Node.js Library)

**Best for**: Simple text extraction from PDFs

```bash
npm install pdf-parse
```

```javascript
import fs from 'fs';
import pdf from 'pdf-parse';

const dataBuffer = fs.readFileSync('document.pdf');
const data = await pdf(dataBuffer);

console.log(data.text); // Extracted text
console.log(data.numpages); // Number of pages
console.log(data.info); // PDF metadata
```

**Pros:**
- ✅ Simple to use
- ✅ Pure Node.js (no external dependencies)
- ✅ Fast

**Cons:**
- ❌ Doesn't handle tables well
- ❌ May struggle with complex layouts
- ❌ No OCR (can't handle scanned PDFs)

---

## Option 2: pdf.js (Mozilla PDF.js)

**Best for**: More control over PDF rendering

```bash
npm install pdfjs-dist
```

```javascript
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const loadingTask = pdfjsLib.getDocument({
  url: 'https://example.gov/report.pdf',
  // or data: buffer for local files
});

const pdf = await loadingTask.promise;
const numPages = pdf.numPages;

for (let i = 1; i <= numPages; i++) {
  const page = await pdf.getPage(i);
  const textContent = await page.getTextContent();
  const text = textContent.items.map(item => item.str).join(' ');
  console.log(`Page ${i}: ${text}`);
}
```

**Pros:**
- ✅ Very reliable (used by Firefox)
- ✅ Good for complex layouts
- ✅ Can extract structured data
- ✅ Can render PDFs to images

**Cons:**
- ❌ More complex API
- ❌ Larger dependency

---

## Option 3: Adobe PDF Services API

**Best for**: Production, enterprise-grade extraction

```bash
npm install @adobe/pdfservices-node-sdk
```

```javascript
import { ServicePrincipalCredentials, PDFServices, MimeType } from '@adobe/pdfservices-node-sdk';

const credentials = new ServicePrincipalCredentials({
  clientId: process.env.ADOBE_CLIENT_ID,
  clientSecret: process.env.ADOBE_CLIENT_SECRET
});

const pdfServices = new PDFServices({ credentials });

// Extract text from PDF
const inputAsset = await pdfServices.upload({
  readStream: fs.createReadStream('document.pdf'),
  mimeType: MimeType.PDF
});

const result = await pdfServices.extractPDF({
  inputAsset,
  extractElementTypes: ['TEXT', 'TABLES']
});
```

**Pros:**
- ✅ Best quality extraction
- ✅ Handles tables excellently
- ✅ OCR capabilities
- ✅ Enterprise-grade

**Cons:**
- ❌ Requires Adobe account (paid)
- ❌ More complex setup
- ❌ Higher cost

---

## Option 4: pdfplumber (Python - via subprocess)

**Best for**: Table extraction from PDFs

If you need to extract tables, Python's pdfplumber is excellent:

```bash
pip install pdfplumber
```

```javascript
// Call Python script from Node.js
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const { stdout } = await execAsync(`python pdf_extract.py document.pdf`);
const extractedData = JSON.parse(stdout);
```

---

## Option 5: Tabula (for PDF Tables)

**Best for**: Extracting tables from PDFs

Tabula specializes in table extraction:

```bash
# Install Tabula
brew install tabula  # macOS
# or download from: https://tabula.technology/

# Use tabula-java via Node.js
npm install tabula-js
```

---

## Recommendation for Your Use Case

### Try Firecrawl First! 🎯

Since you already have Firecrawl, test if it can handle PDFs:

```javascript
// Add to your scraper-firecrawl.js
async function scrapePDFWithFirecrawl(pdfUrl, apiKey) {
  const response = await axios.post(
    'https://api.firecrawl.dev/v1/scrape',
    {
      url: pdfUrl,
      formats: ['markdown', 'html'],
      onlyMainContent: true
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data.data.markdown;
}
```

### If Firecrawl Doesn't Work Well:

**For simple text extraction**: Use `pdf-parse`
```bash
npm install pdf-parse
```

**For tables/complex layouts**: Use `pdf.js` or consider Adobe PDF Services

---

## Quick Start: pdf-parse

```bash
cd bootcamp/scraper
npm install pdf-parse
```

```javascript
// pdf-extractor.js
import fs from 'fs';
import pdf from 'pdf-parse';
import path from 'path';

async function extractTextFromPDF(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    return {
      text: data.text,
      numPages: data.numpages,
      metadata: data.info
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw error;
  }
}

// Usage
const result = await extractTextFromPDF('path/to/document.pdf');
console.log(result.text);
```

---

## Common Government PDF Sources

- GAO Reports: Often in PDF
- Agency Budget Justifications: PDF format
- Strategic Plans: Usually PDFs
- Procurement Forecasts: Sometimes PDFs
- OIG Reports: Often PDFs

---

## Next Steps

1. **Test Firecrawl with a PDF** - See if it works well
2. **If not, install pdf-parse** for simple extraction
3. **For complex PDFs**, consider pdf.js or Adobe PDF Services

Want me to add PDF parsing to your scraper?

