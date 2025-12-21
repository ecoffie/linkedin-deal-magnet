#!/usr/bin/env node

/**
 * Site Inspector
 * 
 * Helps you inspect the HTML structure of a website
 * to determine what selectors to use for scraping
 */

import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function inspectSite(url, outputFile) {
  console.log(`\n🔍 Inspecting: ${url}`);
  console.log('This will save the HTML structure to help you write selectors.\n');
  
  const browser = await puppeteer.launch({ headless: false }); // Show browser so you can see it
  
  try {
    const page = await browser.newPage();
    
    // Set larger viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('📡 Loading page...');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Wait a bit for any JavaScript to render
    await page.waitForTimeout(3000);
    
    // Get page HTML
    const html = await page.content();
    
    // Save full HTML
    const fullHtmlFile = outputFile || path.join(__dirname, 'inspected-page.html');
    await fs.writeFile(fullHtmlFile, html);
    console.log(`✅ Full HTML saved: ${fullHtmlFile}`);
    
    // Try to find common forecast/opportunity elements
    console.log('\n🔎 Analyzing page structure...\n');
    
    const analysis = await page.evaluate(() => {
      const results = {
        headings: [],
        links: [],
        potentialForecasts: []
      };
      
      // Find all headings
      document.querySelectorAll('h1, h2, h3, h4').forEach(el => {
        results.headings.push({
          tag: el.tagName,
          text: el.textContent.trim().substring(0, 100),
          className: el.className,
          id: el.id
        });
      });
      
      // Find links (especially those that might be forecasts)
      document.querySelectorAll('a[href*="forecast"], a[href*="opportunity"], a[href*="procurement"]').forEach(el => {
        results.links.push({
          text: el.textContent.trim().substring(0, 100),
          href: el.href,
          className: el.className
        });
      });
      
      // Look for common forecast container patterns
      document.querySelectorAll('[class*="forecast"], [class*="opportunity"], [class*="procurement"], [id*="forecast"]').forEach(el => {
        results.potentialForecasts.push({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          sampleText: el.textContent.trim().substring(0, 200)
        });
      });
      
      return results;
    });
    
    // Save analysis
    const analysisFile = fullHtmlFile.replace('.html', '-analysis.json');
    await fs.writeJSON(analysisFile, analysis, { spaces: 2 });
    console.log(`✅ Analysis saved: ${analysisFile}`);
    
    console.log('\n📊 Found:');
    console.log(`   Headings: ${analysis.headings.length}`);
    console.log(`   Forecast-related links: ${analysis.links.length}`);
    console.log(`   Potential forecast containers: ${analysis.potentialForecasts.length}`);
    
    if (analysis.headings.length > 0) {
      console.log('\n📝 Sample Headings:');
      analysis.headings.slice(0, 5).forEach(h => {
        console.log(`   ${h.tag}${h.className ? '.' + h.className : ''}${h.id ? '#' + h.id : ''}: ${h.text}`);
      });
    }
    
    if (analysis.potentialForecasts.length > 0) {
      console.log('\n🎯 Potential Forecast Containers:');
      analysis.potentialForecasts.slice(0, 3).forEach(f => {
        console.log(`   ${f.tag}${f.className ? '.' + f.className : ''}${f.id ? '#' + f.id : ''}`);
        console.log(`   Sample: ${f.sampleText.substring(0, 100)}...`);
      });
    }
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Open the HTML file in a browser');
    console.log('   2. Inspect elements using DevTools (F12)');
    console.log('   3. Identify CSS selectors for forecast entries');
    console.log('   4. Update scraper.js with correct selectors');
    console.log('\n⏸️  Browser will stay open for 10 seconds so you can inspect...');
    
    await page.waitForTimeout(10000);
    
  } finally {
    await browser.close();
  }
}

// CLI
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(`
Site Inspector - Analyze HTML structure for scraping

Usage: node inspect-site.js <url> [output-file]

Example:
  node inspect-site.js "https://hallway.acquisition.gov/forecast" gsa-gateway.html

This will:
  - Load the page in a browser
  - Save the HTML
  - Analyze structure
  - Help you identify selectors for scraping
  `);
  process.exit(1);
}

inspectSite(args[0], args[1]).catch(console.error);

