#!/usr/bin/env node

/**
 * Convert scraped results to knowledge base JSON format
 * 
 * Takes a scraped JSON file and converts it to the format
 * used by the knowledge base agency files.
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertScrapedToKB(scrapedFile, agencyTemplate) {
  console.log(`\n🔄 Converting ${scrapedFile} to knowledge base format...`);
  
  // Read scraped data
  const scraped = await fs.readJSON(scrapedFile);
  
  // Read template (use existing agency file as template)
  const template = await fs.readJSON(agencyTemplate);
  
  // Convert pain points format
  const kbPainPoints = scraped.painPoints.map(pp => ({
    point: pp.point,
    source: pp.source,
    priority: pp.priority
  }));
  
  // Update template with scraped data
  const kbData = {
    ...template,
    name: scraped.agency,
    abbreviation: scraped.abbreviation || template.abbreviation,
    painPoints: kbPainPoints,
    sources: {
      primary: [
        scraped.sources.gsaGateway ? `${scraped.sources.gsaGateway.source} - ${scraped.sources.gsaGateway.url}` : '',
        ...(template.sources?.primary || [])
      ].filter(Boolean),
      secondary: [
        ...(template.sources?.secondary || [])
      ]
    }
  };
  
  // Save converted file
  const outputFile = path.join(
    __dirname,
    '..',
    'agencies',
    `${scraped.abbreviation.toLowerCase() || scraped.agency.toLowerCase().replace(/\s+/g, '-')}-scraped.json`
  );
  
  await fs.writeJSON(outputFile, kbData, { spaces: 2 });
  console.log(`✅ Converted file saved: ${outputFile}`);
  console.log(`\n⚠️  Please review and refine before using in production!`);
  
  return outputFile;
}

// CLI usage
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log(`
Usage: node convert-to-kb.js <scraped-file> [template-file]

Example:
  node convert-to-kb.js scraped/ed-scraped-1234567890.json ../agencies/dod.json

This converts scraped data to knowledge base format using a template.
  `);
  process.exit(1);
}

const scrapedFile = args[0];
const templateFile = args[1] || path.join(__dirname, '..', 'agencies', 'dod.json');

convertScrapedToKB(scrapedFile, templateFile)
  .then(() => console.log('\n✅ Conversion complete!'))
  .catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });

