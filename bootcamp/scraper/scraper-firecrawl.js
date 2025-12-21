#!/usr/bin/env node

/**
 * Agency Pain Point Scraper using Firecrawl
 * 
 * Uses Firecrawl MCP to scrape GSA Acquisition Gateway and extract pain points
 * Much more reliable than custom scrapers!
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import * as cheerio from 'cheerio';
import pdf from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  outputDir: path.join(__dirname, '..', 'extractions', 'scraped'),
  forecastUrls: {
    gsaGateway: 'https://hallway.acquisition.gov/forecast',
    acquisitionGov: 'https://www.acquisition.gov/procurement-forecasts',
    dod: 'https://business.defense.gov',
    dhs: 'https://www.dhs.gov',
    va: 'https://www.va.gov/osdbu/acquisition-forecast',
    doe: 'https://www.energy.gov/osbp/acquisition-forecast'
  }
};

// Agency to forecast URL mapping
const AGENCY_FORECAST_URLS = {
  'Department of Education': [
    'https://www2.ed.gov/fund/contract/find/forecast.html',
    'https://hallway.acquisition.gov/forecast',
    'https://www.acquisition.gov/procurement-forecasts'
  ],
  'Department of Defense': [
    'https://business.defense.gov',
    'https://www.acquisition.gov/procurement-forecasts',
    'https://hallway.acquisition.gov/forecast'
  ],
  'Department of Homeland Security': [
    'https://www.dhs.gov',
    'https://hallway.acquisition.gov/forecast',
    'https://www.acquisition.gov/procurement-forecasts'
  ],
  'Department of Veterans Affairs': [
    'https://www.va.gov/osdbu/acquisition-forecast',
    'https://hallway.acquisition.gov/forecast',
    'https://www.acquisition.gov/procurement-forecasts'
  ],
  'Department of Energy': [
    'https://www.energy.gov/osbp/acquisition-forecast',
    'https://hallway.acquisition.gov/forecast',
    'https://www.acquisition.gov/procurement-forecasts'
  ],
  'Department of Labor': [
    'https://www.dol.gov/agencies/oasam/centers-offices/business-operations-center/osdbu/procurement-forecast',
    'https://hallway.acquisition.gov/forecast',
    'https://www.acquisition.gov/procurement-forecasts'
  ],
  'Small Business Administration': [
    'https://hallway.acquisition.gov/forecast',
    'https://www.acquisition.gov/procurement-forecasts'
  ],
  'Office of Personnel Management': [
    'https://www.opm.gov/about-us/doing-business-with-opm/contracting-opportunities',
    'https://hallway.acquisition.gov/forecast',
    'https://www.acquisition.gov/procurement-forecasts'
  ],
  'Social Security Administration': [
    'https://www.ssa.gov/osdbu/contract-forecast-intro.html',
    'https://hallway.acquisition.gov/forecast',
    'https://www.acquisition.gov/procurement-forecasts'
  ],
  'Nuclear Regulatory Commission': [
    'https://www.nrc.gov/about-nrc/contracting/small-business/forecast.html',
    'https://hallway.acquisition.gov/forecast',
    'https://www.acquisition.gov/procurement-forecasts'
  ],
  'Federal Communications Commission': [
    'https://www.fcc.gov/general/contracting-opportunities',
    'https://hallway.acquisition.gov/forecast',
    'https://www.acquisition.gov/procurement-forecasts'
  ],
  'Department of State': [
    'https://www.state.gov/Procurement-Forecast',
    'https://hallway.acquisition.gov/forecast',
    'https://www.acquisition.gov/procurement-forecasts'
  ],
  'Department of Commerce': [
    'https://www.commerce.gov/oam/vendors/procurement-forecasts',
    'https://hallway.acquisition.gov/forecast',
    'https://www.acquisition.gov/procurement-forecasts'
  ],
  'Department of Justice': [
    'https://www.justice.gov/osdbu/find-contracting-opportunities',
    'https://hallway.acquisition.gov/forecast',
    'https://www.acquisition.gov/procurement-forecasts'
  ],
  'Department of Housing and Urban Development': [
    'https://www.hud.gov/program_offices/sdb/4cast',
    'https://hallway.acquisition.gov/forecast',
    'https://www.acquisition.gov/procurement-forecasts'
  ],
  'National Science Foundation': [
    'https://www.nsf.gov/about/contracting/forecast.jsp',
    'https://hallway.acquisition.gov/forecast',
    'https://www.acquisition.gov/procurement-forecasts'
  ],
  'Agency for International Development': [
    'https://www.usaid.gov/business-forecast',
    'https://hallway.acquisition.gov/forecast',
    'https://www.acquisition.gov/procurement-forecasts'
  ]
};

// Pain point keywords
const PAIN_POINT_KEYWORDS = {
  urgent: ['urgent', 'critical', 'immediate', 'pressing', 'emergency'],
  modernization: ['modernization', 'modernize', 'upgrade', 'replace', 'refresh', 'legacy', 'outdated', 'aging'],
  problems: ['backlog', 'delay', 'deficiency', 'gap', 'challenge', 'issue', 'problem', 'risk', 'vulnerability'],
  capacity: ['unable to', 'cannot', 'insufficient', 'limited', 'overwhelmed', 'strained'],
  security: ['cybersecurity', 'security', 'breach', 'threat', 'vulnerability', 'compliance']
};

/**
 * Extract pain points from text using keyword matching
 */
function extractPainPointsFromText(text, source, sourceUrl) {
  if (!text || text.length < 50) return [];
  
  const textLower = text.toLowerCase();
  const painPoints = [];
  
  const hasUrgency = PAIN_POINT_KEYWORDS.urgent.some(keyword => textLower.includes(keyword));
  const hasModernization = PAIN_POINT_KEYWORDS.modernization.some(keyword => textLower.includes(keyword));
  const hasProblem = PAIN_POINT_KEYWORDS.problems.some(keyword => textLower.includes(keyword));
  const hasCapacity = PAIN_POINT_KEYWORDS.capacity.some(keyword => textLower.includes(keyword));
  
  // Determine priority
  let priority = 'medium';
  if (hasUrgency && (hasModernization || hasProblem)) {
    priority = 'high';
  }
  if (hasUrgency && hasProblem && hasCapacity) {
    priority = 'critical';
  }
  
  // Extract meaningful sentences
  if (hasProblem || hasModernization || hasCapacity || hasUrgency) {
    const sentences = text.split(/[.!?]\s+/).filter(s => s.length > 30 && s.length < 300);
    
    sentences.forEach(sentence => {
      const sentLower = sentence.toLowerCase();
      if (PAIN_POINT_KEYWORDS.urgent.some(k => sentLower.includes(k)) ||
          PAIN_POINT_KEYWORDS.modernization.some(k => sentLower.includes(k)) ||
          PAIN_POINT_KEYWORDS.problems.some(k => sentLower.includes(k))) {
        
        let cleanSentence = sentence.trim();
        if (cleanSentence.length > 200) {
          cleanSentence = cleanSentence.substring(0, 197) + '...';
        }
        
        painPoints.push({
          point: cleanSentence,
          source: source,
          sourceUrl: sourceUrl || '',
          priority: priority,
          extractedAt: new Date().toISOString()
        });
      }
    });
  }
  
  // Remove duplicates
  const unique = [];
  const seen = new Set();
  painPoints.forEach(pp => {
    const key = pp.point.toLowerCase().substring(0, 100);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(pp);
    }
  });
  
  return unique;
}

/**
 * Check if URL points to a PDF
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
      timeout: 60000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const pdfBuffer = Buffer.from(response.data);
    const data = await pdf(pdfBuffer);
    
    console.log(`✅ Extracted text from PDF: ${data.text.length} chars, ${data.numpages} pages`);
    
    // Convert to markdown-like format for consistency
    return {
      markdown: data.text,
      html: `<pre>${data.text}</pre>`,
      metadata: {
        numPages: data.numpages,
        info: data.info
      }
    };
  } catch (error) {
    console.error(`❌ Error extracting PDF: ${error.message}`);
    throw error;
  }
}

/**
 * Use Firecrawl API to scrape a URL (handles both HTML and PDFs)
 */
async function scrapeUrlWithFirecrawl(url, sourceName, apiKey) {
  try {
    // Check if it's a PDF - Firecrawl handles PDFs too, but we can also use pdf-parse
    const isPDF = isPDFUrl(url);
    
    if (isPDF) {
      console.log(`📄 Detected PDF: ${url}`);
      
      // Try Firecrawl first (it handles PDFs well)
      try {
        console.log(`📡 Scraping PDF with Firecrawl: ${url}`);
        
        const response = await axios.post(
          'https://api.firecrawl.dev/v1/scrape',
          {
            url: url,
            formats: ['markdown', 'html'],
            onlyMainContent: true
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 90000 // PDFs may take longer
          }
        );
        
        const scrapedContent = response.data?.data || response.data;
        
        if (scrapedContent && (scrapedContent.markdown || scrapedContent.html)) {
          console.log(`✅ Firecrawl successfully scraped PDF: ${scrapedContent.markdown?.length || scrapedContent.html?.length || 0} chars`);
          
          return {
            content: scrapedContent,
            source: sourceName,
            sourceUrl: url,
            scrapedAt: new Date().toISOString(),
            success: true,
            isPDF: true
          };
        }
      } catch (firecrawlError) {
        console.log(`⚠️  Firecrawl PDF extraction failed, trying pdf-parse fallback: ${firecrawlError.message}`);
      }
      
      // Fallback to pdf-parse if Firecrawl fails
      try {
        const pdfContent = await extractTextFromPDFUrl(url);
        return {
          content: pdfContent,
          source: sourceName,
          sourceUrl: url,
          scrapedAt: new Date().toISOString(),
          success: true,
          isPDF: true,
          method: 'pdf-parse'
        };
      } catch (pdfError) {
        throw new Error(`Both Firecrawl and pdf-parse failed: ${pdfError.message}`);
      }
    }
    
    // Regular HTML scraping
    console.log(`📡 Scraping: ${url}`);
    
    const response = await axios.post(
      'https://api.firecrawl.dev/v1/scrape',
      {
        url: url,
        formats: ['markdown', 'html'],
        onlyMainContent: true,
        waitFor: 3000 // Wait for JavaScript to render
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );
    
    const scrapedContent = response.data?.data || response.data;
    
    if (!scrapedContent) {
      throw new Error('No content returned from Firecrawl');
    }
    
    console.log(`✅ Successfully scraped: ${scrapedContent.markdown?.length || 0} chars markdown, ${scrapedContent.html?.length || 0} chars HTML`);
    
    return {
      content: scrapedContent,
      source: sourceName,
      sourceUrl: url,
      scrapedAt: new Date().toISOString(),
      success: true,
      isPDF: false
    };
    
  } catch (error) {
    console.error(`❌ Error scraping ${url}:`, error.response?.data?.error || error.message);
    
    return {
      content: null,
      source: sourceName,
      sourceUrl: url,
      error: error.response?.data?.error || error.message,
      scrapedAt: new Date().toISOString(),
      success: false
    };
  }
}

/**
 * Extract PDF links from HTML content
 */
function extractPDFLinks(html, baseUrl) {
  if (!html) return [];
  
  const $ = cheerio.load(html);
  const pdfLinks = [];
  
  // Find all links that point to PDFs
  $('a[href]').each((i, elem) => {
    const href = $(elem).attr('href');
    if (!href) return;
    
    let fullUrl = href;
    
    // Convert relative URLs to absolute
    if (href.startsWith('/')) {
      try {
        const base = new URL(baseUrl);
        fullUrl = `${base.protocol}//${base.host}${href}`;
      } catch (e) {
        return;
      }
    } else if (!href.startsWith('http')) {
      try {
        const base = new URL(baseUrl);
        fullUrl = new URL(href, baseUrl).href;
      } catch (e) {
        return;
      }
    }
    
    if (isPDFUrl(fullUrl)) {
      const linkText = $(elem).text().trim() || fullUrl;
      pdfLinks.push({
        url: fullUrl,
        text: linkText,
        title: $(elem).attr('title') || linkText
      });
    }
  });
  
  return pdfLinks;
}

/**
 * Use Firecrawl API to scrape multiple forecast sources for an agency
 */
async function scrapeAgencyForecastsWithFirecrawl(agencyName) {
  console.log(`\n🔍 Using Firecrawl to scrape forecast sources for: ${agencyName}`);
  
  const apiKey = process.env.FIRECRAWL_API_KEY;
  
  if (!apiKey) {
    console.log('\n⚠️  FIRECRAWL_API_KEY not found in environment variables');
    console.log('   Set it with: export FIRECRAWL_API_KEY=your-key\n');
    
    return {
      forecasts: [],
      painPoints: [],
      sources: [],
      error: 'Firecrawl API key required',
      scrapedAt: new Date().toISOString()
    };
  }
  
  // Get URLs for this agency
  const urlsToScrape = AGENCY_FORECAST_URLS[agencyName] || [
    CONFIG.forecastUrls.gsaGateway,
    CONFIG.forecastUrls.acquisitionGov
  ];
  
  // Add search parameters where appropriate
  const urlsWithSearch = urlsToScrape.map(url => {
    if (url.includes('hallway.acquisition.gov') || url.includes('acquisition.gov')) {
      return `${url}?q=${encodeURIComponent(agencyName)}`;
    }
    return url;
  });
  
  console.log(`\n📋 Scraping ${urlsWithSearch.length} sources...`);
  
  const results = [];
  const pdfUrlsToScrape = [];
  
  // First pass: Scrape HTML pages and find PDF links
  for (const url of urlsWithSearch) {
    const sourceName = url.includes('hallway.acquisition.gov') ? 'GSA Acquisition Gateway' :
                       url.includes('acquisition.gov') ? 'Acquisition.gov Procurement Forecasts' :
                       url.includes('defense.gov') ? 'DoD OSDBU' :
                       url.includes('dhs.gov') ? 'DHS Forecasts' :
                       url.includes('va.gov') ? 'VA OSDBU Forecast' :
                       url.includes('energy.gov') ? 'DOE OSBP Forecast' :
                       'Agency Forecast';
    
    // If it's already a PDF, scrape it directly
    if (isPDFUrl(url)) {
      const result = await scrapeUrlWithFirecrawl(url, sourceName, apiKey);
      results.push(result);
    } else {
      // Scrape HTML page
      const result = await scrapeUrlWithFirecrawl(url, sourceName, apiKey);
      results.push(result);
      
      // Extract PDF links from HTML
      if (result.success && result.content && result.content.html) {
        const pdfLinks = extractPDFLinks(result.content.html, url);
        
        if (pdfLinks.length > 0) {
          console.log(`\n📄 Found ${pdfLinks.length} PDF link(s) on ${sourceName}:`);
          pdfLinks.forEach(link => {
            console.log(`   - ${link.title}: ${link.url}`);
            pdfUrlsToScrape.push({
              url: link.url,
              sourceName: `${sourceName} - ${link.title}`
            });
          });
        }
      }
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Second pass: Scrape found PDFs (limit to first 5 to avoid too many requests)
  if (pdfUrlsToScrape.length > 0) {
    console.log(`\n📄 Scraping ${Math.min(pdfUrlsToScrape.length, 5)} PDF(s)...`);
    
    for (const pdfLink of pdfUrlsToScrape.slice(0, 5)) {
      const result = await scrapeUrlWithFirecrawl(pdfLink.url, pdfLink.sourceName, apiKey);
      results.push(result);
      
      // Delay between PDF requests
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  return {
    sources: results,
    scrapedAt: new Date().toISOString()
  };
}

/**
 * Extract forecasts and pain points from Firecrawl content
 */
function processFirecrawlContent(scrapedData, agencyName) {
  const forecasts = [];
  const allPainPoints = [];
  
  if (!scrapedData.content) {
    return { forecasts, painPoints: allPainPoints };
  }
  
  const content = scrapedData.content;
  const source = scrapedData.source;
  const sourceUrl = scrapedData.sourceUrl || CONFIG.gsaGatewayUrl;
  const isPDF = scrapedData.isPDF || false;
  
  // Process markdown content (easier to parse)
  let textToProcess = '';
  
  if (content.markdown) {
    textToProcess = content.markdown;
  } else if (content.html) {
    // If only HTML, extract text using Cheerio
    const $ = cheerio.load(content.html);
    textToProcess = $('body').text();
  } else {
    return { forecasts, painPoints: allPainPoints };
  }
  
  // Split into sections/paragraphs
  const paragraphs = textToProcess
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 100); // Only meaningful paragraphs
  
  // Look for forecast entries
  paragraphs.forEach((paragraph, index) => {
    const paraLower = paragraph.toLowerCase();
    
    // Check if this paragraph mentions forecast, opportunity, procurement, or agency name
    if (paraLower.includes('forecast') || 
        paraLower.includes('opportunity') || 
        paraLower.includes('procurement') ||
        paraLower.includes('solicitation') ||
        paraLower.includes(agencyName.toLowerCase())) {
      
      // Extract potential forecast info
      const forecast = {
        title: extractTitle(paragraph),
        description: paragraph,
        agency: agencyName,
        source: source + (isPDF ? ' (PDF)' : ''),
        sourceUrl: sourceUrl,
        isPDF: isPDF
      };
      
      forecasts.push(forecast);
      
      // Extract pain points from this forecast description
      const painPoints = extractPainPointsFromText(
        paragraph,
        `${source}${isPDF ? ' (PDF)' : ''} - ${forecast.title || 'Forecast Entry'}`,
        sourceUrl
      );
      
      allPainPoints.push(...painPoints);
    }
    
    // Also check for pain points in any paragraph (not just forecast entries)
    const painPoints = extractPainPointsFromText(
      paragraph,
      source + (isPDF ? ' (PDF)' : ''),
      sourceUrl
    );
    
    // Only add if we haven't already added similar ones from forecast entries
    painPoints.forEach(pp => {
      const key = pp.point.toLowerCase().substring(0, 80);
      const exists = allPainPoints.some(existing => 
        existing.point.toLowerCase().substring(0, 80) === key
      );
      if (!exists) {
        allPainPoints.push(pp);
      }
    });
  });
  
  return { forecasts, painPoints: allPainPoints };
}

/**
 * Extract title from text (simple heuristic)
 */
function extractTitle(text) {
  // Look for first sentence or line that looks like a title
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.length < 150 && !firstLine.includes('.')) {
      return firstLine;
    }
  }
  
  // Or extract first sentence
  const firstSentence = text.split(/[.!?]/)[0].trim();
  if (firstSentence.length < 150) {
    return firstSentence;
  }
  
  return 'Forecast Entry';
}

/**
 * Main scraping function using Firecrawl
 */
async function scrapeAgencyWithFirecrawl(agencyName, agencyAbbreviation = '') {
  console.log(`\n🚀 Starting Firecrawl extraction for: ${agencyName}`);
  console.log('='.repeat(60));
  
  const results = {
    agency: agencyName,
    abbreviation: agencyAbbreviation,
    scrapedAt: new Date().toISOString(),
    sources: {
      gsaGateway: null
    },
    painPoints: [],
    forecasts: []
  };
  
  try {
    // Scrape all forecast sources using Firecrawl
    const scrapeResults = await scrapeAgencyForecastsWithFirecrawl(agencyName);
    
    if (scrapeResults.error) {
      console.log(`⚠️  ${scrapeResults.error}`);
      results.sources = { error: scrapeResults.error };
    } else {
      // Process content from all sources
      const allForecasts = [];
      const allPainPoints = [];
      
      for (const sourceResult of scrapeResults.sources) {
        if (sourceResult.success && sourceResult.content) {
          const processed = processFirecrawlContent(sourceResult, agencyName);
          
          allForecasts.push(...processed.forecasts);
          allPainPoints.push(...processed.painPoints);
          
          // Track source results
          results.sources[sourceResult.source] = {
            url: sourceResult.sourceUrl,
            forecastsFound: processed.forecasts.length,
            painPointsExtracted: processed.painPoints.length,
            success: true
          };
        } else {
          results.sources[sourceResult.source] = {
            url: sourceResult.sourceUrl,
            error: sourceResult.error || 'Failed to scrape',
            success: false
          };
        }
      }
      
      // Remove duplicate pain points
      const uniquePainPoints = [];
      const seenPoints = new Set();
      
      allPainPoints.forEach(pp => {
        const key = pp.point.toLowerCase().substring(0, 100);
        if (!seenPoints.has(key)) {
          seenPoints.add(key);
          uniquePainPoints.push(pp);
        }
      });
      
      results.forecasts = allForecasts;
      results.painPoints = uniquePainPoints;
    }
    
    // Save results
    await fs.ensureDir(CONFIG.outputDir);
    const outputFile = path.join(
      CONFIG.outputDir,
      `${agencyAbbreviation.toLowerCase() || agencyName.toLowerCase().replace(/\s+/g, '-')}-firecrawl-${Date.now()}.json`
    );
    await fs.writeJSON(outputFile, results, { spaces: 2 });
    
    console.log(`\n✅ Results saved to: ${outputFile}`);
    console.log(`\n📊 Summary:`);
    console.log(`   - Forecasts found: ${results.forecasts.length}`);
    console.log(`   - Pain points extracted: ${results.painPoints.length}`);
    
    return results;
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    throw error;
  }
}

/**
 * CLI Interface
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Agency Pain Point Scraper using Firecrawl

Usage: node scraper-firecrawl.js <agency-name> [abbreviation]

Examples:
  node scraper-firecrawl.js "Department of Education" "ED"
  node scraper-firecrawl.js "Department of Transportation" "DOT"

Requirements:
  - Firecrawl API key: Set FIRECRAWL_API_KEY environment variable
  - Or Firecrawl MCP configured in your environment
  - See FIRECRAWL_SETUP.md for details

This will:
  1. Use Firecrawl to scrape GSA Acquisition Gateway
  2. Extract forecast descriptions
  3. Identify pain points using keyword matching
  4. Save results as JSON

Output: bootcamp/extractions/scraped/[agency]-firecrawl-[timestamp].json
    `);
    process.exit(1);
  }
  
  const agencyName = args[0];
  const abbreviation = args[1] || '';
  
  try {
    await scrapeAgencyWithFirecrawl(agencyName, abbreviation);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { scrapeAgencyWithFirecrawl, scrapeAgencyForecastsWithFirecrawl };

