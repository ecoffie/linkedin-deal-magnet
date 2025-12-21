#!/usr/bin/env node

/**
 * Simple HTTP-based scraper (no Puppeteer)
 * Uses basic HTTP requests for sites that don't require JavaScript
 * 
 * This is a simpler alternative if the site doesn't need browser automation
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  outputDir: path.join(__dirname, '..', 'extractions', 'scraped'),
  delayBetweenRequests: 2000,
  timeout: 30000,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

/**
 * Extract pain points from text
 */
function extractPainPoints(text, source, sourceUrl) {
  if (!text || text.length < 50) return [];
  
  const textLower = text.toLowerCase();
  const painPoints = [];
  
  // Keywords to identify pain points
  const urgentKeywords = ['urgent', 'critical', 'immediate', 'pressing'];
  const problemKeywords = ['backlog', 'delay', 'deficiency', 'gap', 'challenge', 'problem', 'risk'];
  const modernizationKeywords = ['modernization', 'modernize', 'upgrade', 'replace', 'legacy', 'outdated', 'aging'];
  
  const hasUrgency = urgentKeywords.some(k => textLower.includes(k));
  const hasProblem = problemKeywords.some(k => textLower.includes(k));
  const hasModernization = modernizationKeywords.some(k => textLower.includes(k));
  
  if (hasUrgency || hasProblem || hasModernization) {
    let priority = 'medium';
    if (hasUrgency && hasProblem) priority = 'high';
    if (hasUrgency && hasProblem && hasModernization) priority = 'critical';
    
    // Extract sentences
    const sentences = text.split(/[.!?]\s+/).filter(s => s.length > 30 && s.length < 300);
    
    sentences.forEach(sentence => {
      const sentLower = sentence.toLowerCase();
      if (urgentKeywords.some(k => sentLower.includes(k)) ||
          problemKeywords.some(k => sentLower.includes(k)) ||
          modernizationKeywords.some(k => sentLower.includes(k))) {
        
        painPoints.push({
          point: sentence.trim(),
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
    const key = pp.point.toLowerCase().substring(0, 80);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(pp);
    }
  });
  
  return unique;
}

/**
 * Simple HTTP scraper for GSA Gateway
 * Note: This is a template - actual selectors need to be updated based on real site structure
 */
async function scrapeGSASimple(agencyName) {
  console.log(`\n🔍 Scraping GSA Gateway for: ${agencyName}`);
  
  try {
    const url = 'https://hallway.acquisition.gov/forecast';
    console.log(`📡 Fetching: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': CONFIG.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: CONFIG.timeout
    });
    
    const $ = cheerio.load(response.data);
    const forecasts = [];
    
    // TODO: Update these selectors based on actual GSA Gateway HTML structure
    // This is placeholder code - inspect the actual site and update selectors
    
    console.log('⚠️  Note: This is template code. You need to:');
    console.log('   1. Visit https://hallway.acquisition.gov/forecast');
    console.log('   2. Inspect the HTML structure (F12 in browser)');
    console.log('   3. Update the CSS selectors below to match actual structure');
    
    // Example: Look for forecast entries (UPDATE THESE SELECTORS)
    $('article, .forecast, .opportunity, [data-forecast]').each((i, elem) => {
      const $elem = $(elem);
      
      const forecast = {
        title: $elem.find('h2, h3, .title').first().text().trim(),
        description: $elem.find('p, .description, .summary').text().trim(),
        agency: agencyName,
        url: $elem.find('a').first().attr('href') || ''
      };
      
      if (forecast.description && forecast.description.length > 50) {
        forecasts.push(forecast);
      }
    });
    
    console.log(`✅ Found ${forecasts.length} forecast entries`);
    
    // Extract pain points
    const allPainPoints = [];
    forecasts.forEach(forecast => {
      if (forecast.description) {
        const points = extractPainPoints(
          forecast.description,
          `GSA Acquisition Gateway Forecast FY2025 - ${forecast.title || 'Forecast'}`,
          forecast.url || url
        );
        allPainPoints.push(...points);
      }
    });
    
    console.log(`✅ Extracted ${allPainPoints.length} pain points`);
    
    return {
      forecasts: forecasts,
      painPoints: allPainPoints,
      source: 'GSA Acquisition Gateway',
      sourceUrl: url
    };
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   The site may require JavaScript (use puppeteer version)`);
    }
    return { forecasts: [], painPoints: [], error: error.message };
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Simple HTTP Scraper for Agency Pain Points

Usage: node simple-scraper.js <agency-name> [abbreviation]

Example:
  node simple-scraper.js "Department of Education" "ED"

Note: This is a template. You need to:
  1. Inspect the actual website HTML structure
  2. Update CSS selectors in the code
  3. Test and refine
    `);
    process.exit(1);
  }
  
  const agencyName = args[0];
  const abbreviation = args[1] || '';
  
  console.log(`\n🚀 Scraping: ${agencyName}`);
  
  const results = await scrapeGSASimple(agencyName);
  
  // Save results
  await fs.ensureDir(CONFIG.outputDir);
  const outputFile = path.join(
    CONFIG.outputDir,
    `${abbreviation.toLowerCase() || agencyName.toLowerCase().replace(/\s+/g, '-')}-simple-${Date.now()}.json`
  );
  
  await fs.writeJSON(outputFile, {
    agency: agencyName,
    abbreviation: abbreviation,
    scrapedAt: new Date().toISOString(),
    ...results
  }, { spaces: 2 });
  
  console.log(`\n✅ Results saved: ${outputFile}`);
  console.log(`\n📊 Summary:`);
  console.log(`   Forecasts: ${results.forecasts.length}`);
  console.log(`   Pain Points: ${results.painPoints.length}`);
}

main().catch(console.error);

