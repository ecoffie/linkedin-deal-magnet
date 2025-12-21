#!/usr/bin/env node

/**
 * Agency Pain Point Scraper
 * 
 * Extracts pain points from GSA Acquisition Gateway forecasts
 * and other government sources for agency knowledge base.
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  outputDir: path.join(__dirname, '..', 'extractions', 'scraped'),
  delayBetweenRequests: 2000, // 2 seconds between requests (be respectful)
  timeout: 30000, // 30 second timeout
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// Pain point keywords to look for in forecast descriptions
const PAIN_POINT_KEYWORDS = {
  urgent: ['urgent', 'critical', 'immediate', 'pressing', 'emergency'],
  modernization: ['modernization', 'modernize', 'upgrade', 'replace', 'refresh', 'legacy', 'outdated', 'aging'],
  problems: ['backlog', 'delay', 'deficiency', 'gap', 'challenge', 'issue', 'problem', 'risk', 'vulnerability'],
  capacity: ['unable to', 'cannot', 'insufficient', 'limited', 'overwhelmed', 'strained'],
  infrastructure: ['infrastructure', 'system', 'facility', 'equipment', 'network'],
  security: ['cybersecurity', 'security', 'breach', 'threat', 'vulnerability', 'compliance']
};

/**
 * Extract pain points from text using keyword matching
 */
function extractPainPointsFromText(text, source, sourceUrl) {
  if (!text || text.length < 50) return [];
  
  const textLower = text.toLowerCase();
  const painPoints = [];
  
  // Check for urgency indicators
  const hasUrgency = PAIN_POINT_KEYWORDS.urgent.some(keyword => textLower.includes(keyword));
  const hasModernization = PAIN_POINT_KEYWORDS.modernization.some(keyword => textLower.includes(keyword));
  const hasProblem = PAIN_POINT_KEYWORDS.problems.some(keyword => textLower.includes(keyword));
  const hasCapacity = PAIN_POINT_KEYWORDS.capacity.some(keyword => textLower.includes(keyword));
  
  // Determine priority based on keywords
  let priority = 'medium';
  if (hasUrgency && (hasModernization || hasProblem)) {
    priority = 'high';
  }
  if (hasUrgency && hasProblem && hasCapacity) {
    priority = 'critical';
  }
  
  // Extract meaningful sentences/phrases
  if (hasProblem || hasModernization || hasCapacity || hasUrgency) {
    // Try to extract the key sentence
    const sentences = text.split(/[.!?]\s+/).filter(s => s.length > 30);
    
    sentences.forEach(sentence => {
      const sentLower = sentence.toLowerCase();
      if (PAIN_POINT_KEYWORDS.urgent.some(k => sentLower.includes(k)) ||
          PAIN_POINT_KEYWORDS.modernization.some(k => sentLower.includes(k)) ||
          PAIN_POINT_KEYWORDS.problems.some(k => sentLower.includes(k))) {
        
        // Clean up the sentence
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
  
  return painPoints;
}

/**
 * Scrape GSA Acquisition Gateway forecasts
 */
async function scrapeGSAGateway(agencyName) {
  console.log(`\n🔍 Scraping GSA Acquisition Gateway for: ${agencyName}`);
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent(CONFIG.userAgent);
    
    // Navigate to GSA Gateway
    const gatewayUrl = 'https://hallway.acquisition.gov/forecast';
    console.log(`📡 Navigating to: ${gatewayUrl}`);
    
    await page.goto(gatewayUrl, { 
      waitUntil: 'networkidle2',
      timeout: CONFIG.timeout 
    });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Try to search for agency
    // Note: This is a placeholder - actual implementation depends on the site's structure
    console.log(`🔎 Searching for: ${agencyName}`);
    
    // Look for search input and enter agency name
    try {
      const searchInput = await page.$('input[type="search"], input[name*="search"], input[id*="search"]');
      if (searchInput) {
        await searchInput.type(agencyName);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
      }
    } catch (error) {
      console.log('⚠️  Could not find search input, trying alternative approach...');
    }
    
    // Get page content
    const content = await page.content();
    const $ = cheerio.load(content);
    
    // Extract forecast entries (structure will need to be adapted to actual site)
    const forecasts = [];
    
    // Look for forecast entries - this is a template structure
    $('.forecast-entry, .opportunity, [class*="forecast"], [class*="opportunity"]').each((i, elem) => {
      const $elem = $(elem);
      
      const forecast = {
        title: $elem.find('h3, h4, .title, [class*="title"]').first().text().trim(),
        description: $elem.find('.description, p, [class*="desc"]').text().trim(),
        agency: $elem.find('.agency, [class*="agency"]').text().trim() || agencyName,
        naics: $elem.find('.naics, [class*="naics"]').text().trim(),
        value: $elem.find('.value, [class*="value"], [class*="amount"]').text().trim(),
        setAside: $elem.find('.set-aside, [class*="setaside"]').text().trim(),
        url: $elem.find('a').first().attr('href') || ''
      };
      
      if (forecast.description && forecast.description.length > 50) {
        forecasts.push(forecast);
      }
    });
    
    console.log(`✅ Found ${forecasts.length} forecast entries`);
    
    // Extract pain points from forecasts
    const allPainPoints = [];
    
    for (const forecast of forecasts) {
      if (forecast.description) {
        const painPoints = extractPainPointsFromText(
          forecast.description,
          `GSA Acquisition Gateway Forecast FY2025 - ${forecast.title || 'Forecast Entry'}`,
          forecast.url || gatewayUrl
        );
        allPainPoints.push(...painPoints);
      }
    }
    
    // Remove duplicates (similar text)
    const uniquePainPoints = [];
    const seenTexts = new Set();
    
    for (const pp of allPainPoints) {
      const key = pp.point.toLowerCase().substring(0, 100);
      if (!seenTexts.has(key)) {
        seenTexts.add(key);
        uniquePainPoints.push(pp);
      }
    }
    
    console.log(`✅ Extracted ${uniquePainPoints.length} unique pain points`);
    
    return {
      forecasts: forecasts,
      painPoints: uniquePainPoints,
      source: 'GSA Acquisition Gateway',
      sourceUrl: gatewayUrl,
      scrapedAt: new Date().toISOString()
    };
    
  } finally {
    await browser.close();
  }
}

/**
 * Scrape GAO reports for an agency
 */
async function scrapeGAOReports(agencyName) {
  console.log(`\n🔍 Searching GAO reports for: ${agencyName}`);
  
  try {
    // GAO website search - this is a simplified version
    // Actual implementation would need to handle GAO's search interface
    const searchUrl = `https://www.gao.gov/search?q=${encodeURIComponent(agencyName)}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': CONFIG.userAgent
      },
      timeout: CONFIG.timeout
    });
    
    const $ = cheerio.load(response.data);
    const reports = [];
    
    // Extract report links (structure depends on GAO site)
    $('a[href*="/products/"]').each((i, elem) => {
      const $elem = $(elem);
      const title = $elem.text().trim();
      const url = $elem.attr('href');
      
      if (title && url && title.toLowerCase().includes(agencyName.toLowerCase())) {
        reports.push({
          title: title,
          url: url.startsWith('http') ? url : `https://www.gao.gov${url}`,
          reportNumber: url.match(/GAO-\d+-\d+/)?.[0] || ''
        });
      }
    });
    
    console.log(`✅ Found ${reports.length} relevant GAO reports`);
    
    return reports;
    
  } catch (error) {
    console.error(`❌ Error scraping GAO: ${error.message}`);
    return [];
  }
}

/**
 * Main scraping function
 */
async function scrapeAgency(agencyName, agencyAbbreviation = '') {
  console.log(`\n🚀 Starting extraction for: ${agencyName}`);
  console.log('='.repeat(60));
  
  const results = {
    agency: agencyName,
    abbreviation: agencyAbbreviation,
    scrapedAt: new Date().toISOString(),
    sources: {
      gsaGateway: null,
      gaoReports: []
    },
    painPoints: [],
    forecasts: []
  };
  
  try {
    // Scrape GSA Gateway
    const gsaData = await scrapeGSAGateway(agencyName);
    results.sources.gsaGateway = {
      source: gsaData.source,
      url: gsaData.sourceUrl,
      forecastsFound: gsaData.forecasts.length,
      painPointsExtracted: gsaData.painPoints.length
    };
    results.forecasts = gsaData.forecasts;
    results.painPoints.push(...gsaData.painPoints);
    
    // Wait before next request
    await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenRequests));
    
    // Scrape GAO reports
    const gaoReports = await scrapeGAOReports(agencyName);
    results.sources.gaoReports = gaoReports;
    
    // Save results
    await fs.ensureDir(CONFIG.outputDir);
    const outputFile = path.join(CONFIG.outputDir, `${agencyAbbreviation.toLowerCase() || agencyName.toLowerCase().replace(/\s+/g, '-')}-scraped-${Date.now()}.json`);
    await fs.writeJSON(outputFile, results, { spaces: 2 });
    
    console.log(`\n✅ Results saved to: ${outputFile}`);
    console.log(`\n📊 Summary:`);
    console.log(`   - Forecasts found: ${results.forecasts.length}`);
    console.log(`   - Pain points extracted: ${results.painPoints.length}`);
    console.log(`   - GAO reports found: ${results.sources.gaoReports.length}`);
    
    return results;
    
  } catch (error) {
    console.error(`\n❌ Error scraping ${agencyName}:`, error.message);
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
Usage: node scraper.js <agency-name> [abbreviation]

Examples:
  node scraper.js "Department of Education" "ED"
  node scraper.js "Department of Transportation" "DOT"
  node scraper.js "Small Business Administration" "SBA"

This will scrape:
  - GSA Acquisition Gateway forecasts
  - GAO reports
  - Extract pain points from descriptions

Output: JSON file in bootcamp/extractions/scraped/
    `);
    process.exit(1);
  }
  
  const agencyName = args[0];
  const abbreviation = args[1] || '';
  
  try {
    await scrapeAgency(agencyName, abbreviation);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { scrapeAgency, scrapeGSAGateway, scrapeGAOReports };

