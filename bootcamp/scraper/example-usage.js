#!/usr/bin/env node

/**
 * Example usage of the scraper
 * Shows how to use the scraper programmatically
 */

import { scrapeAgency } from './scraper.js';

async function example() {
  console.log('🚀 Example: Scraping Department of Education\n');
  
  try {
    const results = await scrapeAgency('Department of Education', 'ED');
    
    console.log('\n📋 Summary:');
    console.log(`Agency: ${results.agency}`);
    console.log(`Forecasts Found: ${results.forecasts.length}`);
    console.log(`Pain Points Extracted: ${results.painPoints.length}`);
    
    if (results.painPoints.length > 0) {
      console.log('\n🔍 Sample Pain Points:');
      results.painPoints.slice(0, 3).forEach((pp, i) => {
        console.log(`\n${i + 1}. ${pp.point.substring(0, 100)}...`);
        console.log(`   Priority: ${pp.priority}`);
        console.log(`   Source: ${pp.source}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run example
example();

