#!/usr/bin/env node

/**
 * Batch PDF Processor with LangChain-style structured extraction
 * 
 * Advanced PDF processing with structured data extraction
 * Can integrate with LangChain if needed for more sophisticated extraction
 * 
 * Usage:
 *   node batch-pdf-processor.js --dir <pdf-directory> --agency <agency-name>
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractPDFText, extractForecasts, extractPainPoints } from './extract-forecast-pdfs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Structured extraction using patterns (LangChain-compatible approach)
 */
async function extractStructuredData(pdfText, agencyName) {
    const structured = {
        opportunities: [],
        painPoints: [],
        strategicPriorities: [],
        contractTypes: [],
        naicsCodes: [],
        estimatedValues: [],
        timelines: []
    };
    
    // Extract opportunities/forecasts
    const forecasts = extractForecasts(pdfText, agencyName);
    structured.opportunities = forecasts;
    
    // Extract pain points
    const painPoints = extractPainPoints(pdfText, agencyName);
    structured.painPoints = painPoints;
    
    // Extract NAICS codes
    const naicsPattern = /\b(\d{6}|\d{3,4}xx)\b/gi;
    const naicsMatches = pdfText.match(naicsPattern) || [];
    structured.naicsCodes = [...new Set(naicsMatches)];
    
    // Extract dollar values
    const dollarPattern = /\$[\d,]+(?:\.\d+)?\s*(?:million|billion|M|B|thousand|K)?/gi;
    const dollarMatches = pdfText.match(dollarPattern) || [];
    structured.estimatedValues = [...new Set(dollarMatches)];
    
    // Extract dates/timelines
    const datePattern = /(?:FY|Q[1-4]|calendar|fiscal)\s*\d{4}|\d{1,2}\/\d{1,2}\/\d{4}/gi;
    const dateMatches = pdfText.match(datePattern) || [];
    structured.timelines = [...new Set(dateMatches)];
    
    // Extract contract types
    const contractTypes = ['IDIQ', 'BPA', 'FSS', 'GWAC', 'RFP', 'RFI', 'RFQ', 'Task Order', 'Delivery Order'];
    structured.contractTypes = contractTypes.filter(type => 
        pdfText.toUpperCase().includes(type)
    );
    
    // Extract strategic priorities (keywords in context)
    const priorityKeywords = ['modernization', 'transformation', 'digital', 'cloud', 'cybersecurity', 'zero trust', 'AI', 'machine learning'];
    structured.strategicPriorities = priorityKeywords.filter(keyword => 
        pdfText.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return structured;
}

/**
 * Process batch of PDFs with structured extraction
 */
async function processBatch(pdfDirectory, agencyName, outputDir) {
    const files = await fs.readdir(pdfDirectory);
    const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));
    
    console.log(`\n📚 Processing ${pdfFiles.length} PDF(s) for ${agencyName}\n`);
    
    const results = [];
    
    for (const fileName of pdfFiles) {
        const filePath = path.join(pdfDirectory, fileName);
        
        try {
            console.log(`\nProcessing: ${fileName}`);
            
            // Extract text
            const { text } = await extractPDFTextLocal(filePath);
            
            // Extract structured data
            const structured = await extractStructuredData(text, agencyName);
            
            // Save structured output
            const outputPath = path.join(
                outputDir,
                `${path.basename(fileName, '.pdf')}-structured-${Date.now()}.json`
            );
            
            await fs.ensureDir(outputDir);
            await fs.writeJSON(outputPath, {
                source: fileName,
                agency: agencyName,
                extractedAt: new Date().toISOString(),
                ...structured
            }, { spaces: 2 });
            
            console.log(`✅ Extracted:`);
            console.log(`   - ${structured.opportunities.length} opportunities`);
            console.log(`   - ${structured.painPoints.length} pain points`);
            console.log(`   - ${structured.naicsCodes.length} NAICS codes`);
            console.log(`   - ${structured.estimatedValues.length} value estimates`);
            
            results.push({
                success: true,
                file: fileName,
                structured
            });
            
        } catch (error) {
            console.error(`❌ Failed: ${error.message}`);
            results.push({
                success: false,
                file: fileName,
                error: error.message
            });
        }
    }
    
    return results;
}

// Main
async function main() {
    const args = process.argv.slice(2);
    let pdfDir = null;
    let agencyName = '';
    let outputDir = path.join(__dirname, '..', 'extractions', 'scraped', 'pdf-forecasts');
    
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--dir' || args[i] === '-d') {
            pdfDir = args[++i];
        } else if (args[i] === '--agency' || args[i] === '-a') {
            agencyName = args[++i];
        } else if (args[i] === '--output' || args[i] === '-o') {
            outputDir = args[++i];
        }
    }
    
    if (!pdfDir) {
        console.error('Usage: node batch-pdf-processor.js --dir <pdf-directory> --agency <agency-name>');
        process.exit(1);
    }
    
    await processBatch(pdfDir, agencyName, outputDir);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { processBatch, extractStructuredData };

