#!/usr/bin/env node

/**
 * Industry Events Scraper using Firecrawl
 * 
 * Scrapes industry day event transcripts and presentations
 * from FAI, APEX, SAME, and other industry events
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import axios from 'axios';

const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');
// pdf-parse is exported as a function directly
const pdf = pdfParseModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || 'fc-e76ef9c64efa416a9e012e871a62db82';
const OUTPUT_DIR = path.join(__dirname, '..', 'extractions', 'scraped', 'industry-events');

// Industry event URLs to scrape
const INDUSTRY_EVENT_URLS = [
    {
        name: 'FAI Industry Day Transcript',
        url: 'https://www.fai.gov/content/transcript-industry-day-conferences',
        priority: 'high',
        type: 'transcript'
    },
    {
        name: 'APEX Conference Presentations 2022',
        url: 'https://www.theapex.org/news/2022-apex-conference-presentations/',
        priority: 'medium',
        type: 'presentations'
    },
    {
        name: 'APEX Conference Presentations PDF 2022',
        url: 'https://www.theapex.org/wp-content/uploads/2023/04/Oct-2022-APEx-Conference-Presentations.pdf',
        priority: 'high',
        type: 'pdf'
    },
    // Agency OSDBU/Small Business pages (may contain industry day info)
    {
        name: 'DoD OSDBU Small Business Resources',
        url: 'https://business.defense.gov/Resources/Small-Business-Resources/',
        priority: 'medium',
        type: 'resources'
    },
    {
        name: 'VA OSDBU Small Business Resources',
        url: 'https://www.va.gov/osdbu/',
        priority: 'medium',
        type: 'resources'
    },
    {
        name: 'DHS OSDBU Small Business Resources',
        url: 'https://www.dhs.gov/office-small-disadvantaged-business-utilization',
        priority: 'medium',
        type: 'resources'
    },
    {
        name: 'GSA OSDBU Small Business Resources',
        url: 'https://www.gsa.gov/about-us/organization/office-of-small-and-disadvantaged-business-utilization-osdbu',
        priority: 'medium',
        type: 'resources'
    },
    {
        name: 'NASA OSDBU Small Business Resources',
        url: 'https://www.nasa.gov/offices/osdbu/home/index.html',
        priority: 'medium',
        type: 'resources'
    },
    {
        name: 'DOE OSDBU Small Business Resources',
        url: 'https://www.energy.gov/osbp/office-small-and-disadvantaged-business-utilization',
        priority: 'medium',
        type: 'resources'
    },
    // VA OSDBU Events (found in scraped content)
    {
        name: 'VA OSDBU Events Calendar',
        url: 'https://vetbiz.va.gov/tatassistance/',
        priority: 'high',
        type: 'events'
    },
    {
        name: 'VA OSDBU Events List',
        url: 'https://vetbiz.va.gov/events/',
        priority: 'high',
        type: 'events'
    },
    {
        name: 'VA OSDBU Business Development Training',
        url: 'https://vetbiz.va.gov/businessdevtraining/',
        priority: 'medium',
        type: 'training'
    },
    {
        name: 'VA OSDBU Direct Access Program',
        url: 'https://vetbiz.va.gov/dap/',
        priority: 'medium',
        type: 'program'
    },
    {
        name: 'VA OSDBU Technical Assistance',
        url: 'https://vetbiz.va.gov/technicalassistance/',
        priority: 'medium',
        type: 'resources'
    },
    // Industry Day Events
    {
        name: '2025 Southeast Regional Federal Construction, Infrastructure & Environment Summit',
        url: 'https://www.ncmbc.us/event/2025-southeast-regional-federal-construction-infrastructure-environment-summit/',
        priority: 'high',
        type: 'industry-day'
    },
    // Add more URLs as found
];

/**
 * Check if URL is a PDF
 */
function isPDFUrl(url) {
    return url.toLowerCase().endsWith('.pdf') || 
           url.toLowerCase().includes('.pdf?') ||
           url.toLowerCase().includes('.pdf#');
}

/**
 * Download PDF and extract text using pdf-parse
 */
async function extractTextFromPDFUrl(pdfUrl) {
    try {
        console.log(`📥 Downloading PDF: ${pdfUrl}`);
        
        const response = await axios.get(pdfUrl, {
            responseType: 'arraybuffer',
            timeout: 120000 // 2 minutes for large PDFs
        });
        
        const pdfBuffer = Buffer.from(response.data);
        console.log(`📄 Parsing PDF (${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB)...`);
        
        const data = await pdf(pdfBuffer);
        console.log(`✅ PDF parsed: ${data.numpages} pages, ${data.text.length} characters`);
        
        return data.text;
    } catch (error) {
        console.error(`Error extracting text from PDF URL ${pdfUrl}:`, error.message);
        throw error;
    }
}

/**
 * Scrape URL using Firecrawl API with pdf-parse fallback
 */
async function scrapeUrlWithFirecrawl(url, timeout = 60000) {
    const isPDF = isPDFUrl(url);
    
    // For PDFs, try Firecrawl first, then fallback to pdf-parse
    if (isPDF) {
        try {
            console.log(`📡 Attempting Firecrawl for PDF: ${url}`);
            
            const scrapeTimeout = 90000; // 90 seconds for PDFs
            const response = await axios.post(
                'https://api.firecrawl.dev/v1/scrape',
                {
                    url: url,
                    formats: ['markdown'],
                    onlyMainContent: true,
                    waitFor: 5000
                },
                {
                    headers: {
                        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: scrapeTimeout
                }
            );

            const content = response.data?.data?.markdown || response.data?.markdown || '';
            if (content && content.length > 100) {
                console.log(`✅ Firecrawl successfully scraped PDF`);
                return content;
            }
        } catch (firecrawlError) {
            console.log(`⚠️  Firecrawl failed, using pdf-parse fallback: ${firecrawlError.message}`);
        }
        
        // Fallback to pdf-parse
        console.log(`📥 Using pdf-parse fallback for PDF`);
        return await extractTextFromPDFUrl(url);
    }
    
    // Regular HTML scraping
    try {
        console.log(`Scraping: ${url}`);
        
        const response = await axios.post(
            'https://api.firecrawl.dev/v1/scrape',
            {
                url: url,
                formats: ['markdown'],
                onlyMainContent: true,
                waitFor: 3000
            },
            {
                headers: {
                    'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: timeout
            }
        );

        const content = response.data?.data?.markdown || response.data?.markdown || '';
        return content;
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.response?.data || error.message);
        throw error;
    }
}

/**
 * Extract filename from URL
 */
function getFilenameFromUrl(url) {
    return url
        .replace(/^https?:\/\//, '')
        .replace(/\//g, '_')
        .replace(/_+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 100); // Limit filename length
}

/**
 * Save scraped content to file
 */
async function saveScrapedContent(content, filename, metadata) {
    await fs.ensureDir(OUTPUT_DIR);
    
    const filepath = path.join(OUTPUT_DIR, `${filename}.md`);
    
    // Add metadata header
    const header = `# ${metadata.name}

**Source**: ${metadata.url}
**Type**: ${metadata.type}
**Priority**: ${metadata.priority}
**Scraped**: ${new Date().toISOString()}

---

`;
    
    await fs.writeFile(filepath, header + content);
    console.log(`✅ Saved: ${filepath}`);
    
    return filepath;
}

/**
 * Main scraping function
 */
async function scrapeIndustryEvents() {
    console.log('Starting industry events scraping...\n');
    console.log(`Output directory: ${OUTPUT_DIR}\n`);
    
    const results = [];
    
    for (const event of INDUSTRY_EVENT_URLS) {
        try {
            const content = await scrapeUrlWithFirecrawl(event.url);
            const filename = getFilenameFromUrl(event.url);
            const filepath = await saveScrapedContent(content, filename, event);
            
            results.push({
                success: true,
                event: event.name,
                url: event.url,
                filepath: filepath,
                contentLength: content.length
            });
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error) {
            console.error(`❌ Failed to scrape ${event.name}: ${error.message}\n`);
            results.push({
                success: false,
                event: event.name,
                url: event.url,
                error: error.message
            });
        }
    }
    
    // Summary
    console.log('\n--- Scraping Summary ---');
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    
    // Save summary
    const summaryPath = path.join(OUTPUT_DIR, 'scraping-summary.json');
    await fs.writeJSON(summaryPath, {
        timestamp: new Date().toISOString(),
        results: results,
        stats: {
            total: results.length,
            successful: successful,
            failed: failed
        }
    }, { spaces: 2 });
    
    console.log(`\nSummary saved to: ${summaryPath}`);
    console.log(`\nFiles saved to: ${OUTPUT_DIR}`);
}

// Run the scraper
scrapeIndustryEvents().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});

export { scrapeIndustryEvents, scrapeUrlWithFirecrawl };

