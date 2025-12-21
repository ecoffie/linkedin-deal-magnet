#!/usr/bin/env node

/**
 * Automated PDF Forecast Extraction System
 * 
 * Extracts structured data from downloaded forecast PDFs using pdf-parse
 * Can process local PDF files or download and process PDFs from URLs
 * 
 * Features:
 * - Batch processing of PDF files
 * - Structured data extraction (forecasts, pain points, opportunities)
 * - Integration with knowledge base
 * - Supports both local files and URLs
 * 
 * Usage:
 *   node extract-forecast-pdfs.js [options]
 * 
 * Options:
 *   --input <path>        Directory or file path to process
 *   --url <url>           Single PDF URL to download and process
 *   --output <path>       Output directory (default: extractions/scraped/pdf-forecasts)
 *   --agency <name>       Agency name for metadata
 *   --extract-pain-points Extract and identify pain points
 *   --format <json|markdown> Output format (default: json)
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import axios from 'axios';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DEFAULT_OUTPUT_DIR = path.join(__dirname, '..', 'extractions', 'scraped', 'pdf-forecasts');
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit

// Pain point keywords for extraction
const PAIN_POINT_KEYWORDS = [
    'challenge', 'problem', 'issue', 'difficulty', 'bottleneck', 'gap', 'shortage',
    'delay', 'overdue', 'outdated', 'legacy', 'modernization', 'upgrade',
    'cybersecurity', 'security', 'vulnerability', 'risk', 'compliance',
    'workforce', 'staffing', 'recruitment', 'retention', 'training',
    'budget', 'funding', 'resource', 'capacity', 'infrastructure',
    'integration', 'interoperability', 'system', 'platform', 'migration',
    'acquisition', 'procurement', 'contract', 'vendor', 'supplier'
];

// Forecast indicators
const FORECAST_INDICATORS = [
    'forecast', 'opportunity', 'procurement', 'acquisition', 'contract',
    'solicitation', 'rfp', 'rfi', 'rfq', 'bpa', 'idiq', 'task order',
    'naics', 'pcs', 'estimated value', 'contract value', 'period of performance'
];

/**
 * Download PDF from URL
 */
async function downloadPDF(url, outputPath) {
    try {
        console.log(`📥 Downloading PDF: ${url}`);
        
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 120000, // 2 minutes
            maxContentLength: MAX_FILE_SIZE,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; PDF-Extractor/1.0)'
            }
        });
        
        const buffer = Buffer.from(response.data);
        
        if (buffer.length > MAX_FILE_SIZE) {
            throw new Error(`PDF too large: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);
        }
        
        await fs.ensureDir(path.dirname(outputPath));
        await fs.writeFile(outputPath, buffer);
        
        console.log(`✅ Downloaded: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);
        return buffer;
    } catch (error) {
        console.error(`❌ Download failed: ${error.message}`);
        throw error;
    }
}

/**
 * Extract text from PDF file
 */
async function extractPDFText(filePath) {
    try {
        console.log(`📄 Parsing PDF: ${path.basename(filePath)}`);
        
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdfParse(dataBuffer);
        
        console.log(`✅ Extracted ${data.numpages} pages, ${data.text.length} characters`);
        
        return {
            text: data.text,
            numPages: data.numpages,
            info: data.info || {},
            metadata: data.metadata || {}
        };
    } catch (error) {
        console.error(`❌ PDF parsing failed: ${error.message}`);
        throw error;
    }
}

/**
 * Extract forecasts from text
 */
function extractForecasts(text, agencyName = '') {
    const forecasts = [];
    const lines = text.split('\n');
    
    let currentForecast = null;
    let inForecastSection = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Detect forecast indicators
        const hasForecastIndicator = FORECAST_INDICATORS.some(indicator =>
            line.toLowerCase().includes(indicator.toLowerCase())
        );
        
        if (hasForecastIndicator && line.length > 20) {
            // Start new forecast
            if (currentForecast) {
                forecasts.push(currentForecast);
            }
            
            currentForecast = {
                title: line.substring(0, 200),
                description: '',
                agency: agencyName,
                detectedAt: i,
                keywords: []
            };
            
            inForecastSection = true;
        } else if (inForecastSection && currentForecast) {
            // Continue building forecast description
            if (line.length > 10 && !line.match(/^\d+$/)) {
                currentForecast.description += line + ' ';
                
                // Check for NAICS codes
                const naicsMatch = line.match(/\b\d{6}\b|\b\d{3,4}xx\b/i);
                if (naicsMatch) {
                    currentForecast.keywords.push(`NAICS: ${naicsMatch[0]}`);
                }
                
                // Check for dollar amounts
                const dollarMatch = line.match(/\$[\d,]+(?:\.\d+)?\s*(?:million|billion|M|B)?/i);
                if (dollarMatch) {
                    currentForecast.keywords.push(`Value: ${dollarMatch[0]}`);
                }
            }
            
            // Limit description length
            if (currentForecast.description.length > 500) {
                inForecastSection = false;
            }
        }
    }
    
    // Add last forecast
    if (currentForecast) {
        forecasts.push(currentForecast);
    }
    
    return forecasts;
}

/**
 * Extract pain points from text
 */
function extractPainPoints(text, agencyName = '') {
    const painPoints = [];
    const sentences = text.split(/[.!?]\s+/);
    
    for (const sentence of sentences) {
        const lowerSentence = sentence.toLowerCase();
        
        // Check if sentence contains pain point keywords
        const matchedKeywords = PAIN_POINT_KEYWORDS.filter(keyword =>
            lowerSentence.includes(keyword.toLowerCase())
        );
        
        if (matchedKeywords.length >= 2 && sentence.length > 30) {
            // Likely a pain point
            painPoints.push({
                point: sentence.trim().substring(0, 500),
                source: `PDF Forecast - ${agencyName}`,
                priority: matchedKeywords.length >= 3 ? 'high' : 'medium',
                keywords: matchedKeywords,
                agency: agencyName
            });
        }
    }
    
    // Remove duplicates and limit
    const uniquePainPoints = [];
    const seen = new Set();
    
    for (const pp of painPoints) {
        const key = pp.point.substring(0, 100).toLowerCase();
        if (!seen.has(key) && uniquePainPoints.length < 20) {
            seen.add(key);
            uniquePainPoints.push(pp);
        }
    }
    
    return uniquePainPoints;
}

/**
 * Process a single PDF file
 */
async function processPDF(filePath, options = {}) {
    const {
        agencyName = '',
        extractPainPoints: extractPP = true,
        outputDir = DEFAULT_OUTPUT_DIR
    } = options;
    
    try {
        // Extract text
        const { text, numPages, info, metadata } = await extractPDFText(filePath);
        
        // Extract forecasts
        const forecasts = extractForecasts(text, agencyName);
        
        // Extract pain points if requested
        const painPoints = extractPP ? extractPainPoints(text, agencyName) : [];
        
        // Create output object
        const result = {
            source: path.basename(filePath),
            sourcePath: filePath,
            agency: agencyName,
            extractedAt: new Date().toISOString(),
            metadata: {
                numPages,
                info,
                metadata,
                textLength: text.length
            },
            forecasts: forecasts,
            painPoints: painPoints,
            summary: {
                forecastCount: forecasts.length,
                painPointCount: painPoints.length,
                estimatedWords: text.split(/\s+/).length
            }
        };
        
        // Save result
        const outputPath = path.join(
            outputDir,
            `${path.basename(filePath, '.pdf')}-extracted-${Date.now()}.json`
        );
        
        await fs.ensureDir(outputDir);
        await fs.writeJSON(outputPath, result, { spaces: 2 });
        
        console.log(`✅ Processed: ${forecasts.length} forecasts, ${painPoints.length} pain points`);
        console.log(`📁 Saved: ${outputPath}`);
        
        return result;
    } catch (error) {
        console.error(`❌ Failed to process ${filePath}: ${error.message}`);
        throw error;
    }
}

/**
 * Process directory of PDFs
 */
async function processDirectory(dirPath, options = {}) {
    const files = await fs.readdir(dirPath);
    const pdfFiles = files.filter(f => 
        f.toLowerCase().endsWith('.pdf')
    ).map(f => path.join(dirPath, f));
    
    console.log(`\n📚 Found ${pdfFiles.length} PDF file(s) in ${dirPath}\n`);
    
    const results = [];
    
    for (const filePath of pdfFiles) {
        try {
            const result = await processPDF(filePath, options);
            results.push({ success: true, result });
            
            // Small delay between files
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            results.push({ success: false, file: filePath, error: error.message });
        }
    }
    
    return results;
}

/**
 * Process PDF from URL
 */
async function processPDFFromURL(url, options = {}) {
    const { outputDir = DEFAULT_OUTPUT_DIR } = options;
    
    // Create temp file name
    const urlHash = Buffer.from(url).toString('base64').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
    const tempPath = path.join(outputDir, 'temp', `${urlHash}.pdf`);
    
    try {
        // Download PDF
        await downloadPDF(url, tempPath);
        
        // Process it
        const result = await processPDF(tempPath, options);
        
        // Optionally remove temp file
        // await fs.remove(tempPath);
        
        return result;
    } catch (error) {
        // Clean up temp file on error
        if (await fs.pathExists(tempPath)) {
            await fs.remove(tempPath);
        }
        throw error;
    }
}

/**
 * Main function
 */
async function main() {
    const args = process.argv.slice(2);
    const options = {
        input: null,
        url: null,
        output: DEFAULT_OUTPUT_DIR,
        agency: '',
        extractPainPoints: true,
        format: 'json'
    };
    
    // Parse arguments
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--input':
            case '-i':
                options.input = args[++i];
                break;
            case '--url':
            case '-u':
                options.url = args[++i];
                break;
            case '--output':
            case '-o':
                options.output = args[++i];
                break;
            case '--agency':
            case '-a':
                options.agency = args[++i];
                break;
            case '--no-pain-points':
                options.extractPainPoints = false;
                break;
            case '--format':
            case '-f':
                options.format = args[++i];
                break;
        }
    }
    
    console.log('='.repeat(60));
    console.log('PDF Forecast Extraction System');
    console.log('='.repeat(60));
    console.log(`Output: ${options.output}`);
    console.log(`Agency: ${options.agency || 'Not specified'}`);
    console.log(`Extract Pain Points: ${options.extractPainPoints}`);
    console.log('='.repeat(60));
    console.log();
    
    try {
        let results;
        
        if (options.url) {
            // Process from URL
            console.log(`Processing PDF from URL: ${options.url}\n`);
            results = await processPDFFromURL(options.url, options);
            console.log('\n✅ Single PDF processing complete');
        } else if (options.input) {
            // Check if input is file or directory
            const stats = await fs.stat(options.input);
            
            if (stats.isDirectory()) {
                // Process directory
                results = await processDirectory(options.input, options);
                
                // Summary
                const successful = results.filter(r => r.success).length;
                const failed = results.filter(r => !r.success).length;
                
                console.log('\n' + '='.repeat(60));
                console.log('Processing Summary');
                console.log('='.repeat(60));
                console.log(`✅ Successful: ${successful}`);
                console.log(`❌ Failed: ${failed}`);
                console.log('='.repeat(60));
            } else if (stats.isFile() && options.input.toLowerCase().endsWith('.pdf')) {
                // Process single file
                results = await processPDF(options.input, options);
                console.log('\n✅ Single PDF processing complete');
            } else {
                throw new Error('Input must be a PDF file or directory containing PDFs');
            }
        } else {
            console.error('Error: Please provide --input or --url');
            console.log('\nUsage:');
            console.log('  node extract-forecast-pdfs.js --input <file-or-dir> [options]');
            console.log('  node extract-forecast-pdfs.js --url <pdf-url> [options]');
            console.log('\nOptions:');
            console.log('  --input, -i <path>      PDF file or directory');
            console.log('  --url, -u <url>         PDF URL to download');
            console.log('  --output, -o <path>     Output directory');
            console.log('  --agency, -a <name>     Agency name');
            console.log('  --no-pain-points        Skip pain point extraction');
            console.log('  --format, -f <type>     Output format (json|markdown)');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

// Export functions for use in other modules
export {
    processPDF,
    processDirectory,
    processPDFFromURL,
    extractPDFText,
    extractForecasts,
    extractPainPoints,
    downloadPDF
};

