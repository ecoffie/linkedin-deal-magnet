#!/usr/bin/env node

/**
 * Test PDF parsing with different methods
 */

import fs from 'fs-extra';
import axios from 'axios';

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || 'fc-e76ef9c64efa416a9e012e871a62db82';

/**
 * Test Firecrawl with PDF
 */
async function testFirecrawlPDF(pdfUrl) {
  console.log('\n🔥 Testing Firecrawl with PDF...');
  console.log(`URL: ${pdfUrl}\n`);
  
  try {
    const response = await axios.post(
      'https://api.firecrawl.dev/v1/scrape',
      {
        url: pdfUrl,
        formats: ['markdown', 'html'],
        onlyMainContent: true
      },
      {
        headers: {
          'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );
    
    const content = response.data?.data || response.data;
    
    if (content?.markdown) {
      console.log('✅ Firecrawl successfully extracted PDF!');
      console.log(`📄 Markdown length: ${content.markdown.length} chars`);
      console.log(`\nFirst 500 chars:\n${content.markdown.substring(0, 500)}...\n`);
      return content.markdown;
    } else {
      console.log('❌ No markdown content returned');
      return null;
    }
  } catch (error) {
    console.error('❌ Firecrawl error:', error.response?.data?.error || error.message);
    return null;
  }
}

/**
 * Test pdf-parse library (if installed)
 */
async function testPDFParse(pdfPath) {
  try {
    // Dynamic import to avoid error if not installed
    const pdf = await import('pdf-parse').catch(() => null);
    if (!pdf || !pdf.default) {
      console.log('\n⚠️  pdf-parse not installed. Install with: npm install pdf-parse');
      return null;
    }
    
    console.log('\n📦 Testing pdf-parse library...');
    console.log(`File: ${pdfPath}\n`);
    
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf.default(dataBuffer);
    
    console.log('✅ pdf-parse successfully extracted text!');
    console.log(`📄 Text length: ${data.text.length} chars`);
    console.log(`📑 Pages: ${data.numpages}`);
    console.log(`\nFirst 500 chars:\n${data.text.substring(0, 500)}...\n`);
    
    return data.text;
  } catch (error) {
    console.error('❌ pdf-parse error:', error.message);
    return null;
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
PDF Parsing Test

Usage:
  node pdf-parse-test.js <pdf-url>              # Test Firecrawl with PDF URL
  node pdf-parse-test.js <pdf-path>             # Test pdf-parse with local file

Examples:
  node pdf-parse-test.js https://example.gov/report.pdf
  node pdf-parse-test.js ./document.pdf

Note: Firecrawl works with URLs. pdf-parse works with local files.
    `);
    process.exit(1);
  }
  
  const input = args[0];
  
  // Check if it's a URL or file path
  if (input.startsWith('http://') || input.startsWith('https://')) {
    // Test Firecrawl
    await testFirecrawlPDF(input);
  } else {
    // Test pdf-parse
    await testPDFParse(input);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

