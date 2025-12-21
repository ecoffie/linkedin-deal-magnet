#!/usr/bin/env node

/**
 * Periodic Update Script for Agency Forecasts and GAO Updates
 * 
 * This script can be run via cron job or n8n workflow to periodically:
 * 1. Scrape new agency forecasts from GSA Acquisition Gateway and agency sites
 * 2. Check for GAO High-Risk List updates
 * 3. Check for new GAO testimonies and reports
 * 4. Update knowledge base JSON files with new findings
 * 
 * Usage:
 *   node periodic-update.js [--agency=agency-name] [--source=forecast|gao|all]
 * 
 * Examples:
 *   node periodic-update.js --source=forecast
 *   node periodic-update.js --agency="Department of Defense"
 *   node periodic-update.js --source=all
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
// Import will be done at runtime in the updateAgencyForecasts function
// Using dynamic import to handle module loading issues

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || 'fc-e76ef9c64efa416a9e012e871a62db82';
const OUTPUT_DIR = path.join(__dirname, '..', 'extractions', 'scraped');
const LOG_DIR = path.join(__dirname, 'logs');
const STATE_FILE = path.join(__dirname, 'last-update-state.json');
const KB_DIR = path.join(__dirname, '..', 'agencies');

// Ensure directories exist
await fs.ensureDir(OUTPUT_DIR);
await fs.ensureDir(LOG_DIR);

/**
 * Get last update timestamp for a source
 */
function getLastUpdateState() {
    try {
        if (fs.existsSync(STATE_FILE)) {
            return fs.readJSONSync(STATE_FILE);
        }
    } catch (error) {
        console.error('Error reading state file:', error.message);
    }
    return {};
}

/**
 * Save last update timestamp
 */
function saveLastUpdateState(source, timestamp) {
    try {
        const state = getLastUpdateState();
        state[source] = timestamp;
        fs.writeJSONSync(STATE_FILE, state, { spaces: 2 });
    } catch (error) {
        console.error('Error saving state file:', error.message);
    }
}

/**
 * Log message with timestamp
 */
function log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    console.log(logMessage);
    
    // Also write to log file
    const logFile = path.join(LOG_DIR, `periodic-update-${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, logMessage + '\n');
}

/**
 * Check GAO High-Risk List for updates
 */
async function checkGAOHighRiskUpdates() {
    log('Checking GAO High-Risk List for updates...');
    
    try {
        const gaoHighRiskUrl = 'https://www.gao.gov/highrisk';
        const response = await axios.get(gaoHighRiskUrl, {
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; AgencyKB-Bot/1.0)'
            }
        });
        
        // Extract last modified date or content hash to detect changes
        const lastModified = response.headers['last-modified'] || new Date().toISOString();
        const state = getLastUpdateState();
        const lastCheck = state['gao-high-risk'] || '';
        
        if (lastCheck !== lastModified) {
            log(`GAO High-Risk List updated: ${lastModified}`);
            saveLastUpdateState('gao-high-risk', lastModified);
            return {
                updated: true,
                timestamp: lastModified,
                url: gaoHighRiskUrl
            };
        } else {
            log('GAO High-Risk List: No updates detected');
            return { updated: false };
        }
    } catch (error) {
        log(`Error checking GAO High-Risk List: ${error.message}`, 'error');
        return { updated: false, error: error.message };
    }
}

/**
 * Check GAO Reports/Testimonies for new content
 */
async function checkGAOReportsUpdates() {
    log('Checking GAO Reports and Testimonies for updates...');
    
    try {
        // Check GAO reports RSS feed or recent reports page
        const gaoReportsUrl = 'https://www.gao.gov/reports-testimonies';
        const response = await axios.get(gaoReportsUrl, {
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; AgencyKB-Bot/1.0)'
            }
        });
        
        // Simple check - in production, you'd parse the HTML and check for new reports
        const lastModified = response.headers['last-modified'] || new Date().toISOString();
        const state = getLastUpdateState();
        const lastCheck = state['gao-reports'] || '';
        
        if (lastCheck !== lastModified) {
            log(`GAO Reports page updated: ${lastModified}`);
            saveLastUpdateState('gao-reports', lastModified);
            return {
                updated: true,
                timestamp: lastModified,
                url: gaoReportsUrl
            };
        } else {
            log('GAO Reports: No updates detected');
            return { updated: false };
        }
    } catch (error) {
        log(`Error checking GAO Reports: ${error.message}`, 'error');
        return { updated: false, error: error.message };
    }
}

/**
 * Update agency forecasts
 */
async function updateAgencyForecasts(agencyName = null) {
    log(`Updating agency forecasts${agencyName ? ` for ${agencyName}` : ''}...`);
    
    try {
        // Dynamically import scraper module
        const scraperModule = await import('./scraper-firecrawl.js');
        const scrapeAgencyForecasts = scraperModule.scrapeAgencyForecastsWithFirecrawl;
        
        // If specific agency, scrape just that one
        if (agencyName) {
            await scrapeAgencyForecasts(agencyName, FIRECRAWL_API_KEY);
            log(`Completed forecast update for ${agencyName}`);
        } else {
            // Scrape all agencies (or a subset)
            const agenciesToUpdate = [
                'Department of Defense',
                'Department of Veterans Affairs',
                'Department of Homeland Security',
                'General Services Administration',
                'Department of Energy',
                'NASA'
            ];
            
            for (const agency of agenciesToUpdate) {
                log(`Scraping forecasts for ${agency}...`);
                await scrapeAgencyForecasts(agency, FIRECRAWL_API_KEY);
                // Small delay between agencies
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
            
            log(`Completed forecast updates for ${agenciesToUpdate.length} agencies`);
        }
        
        saveLastUpdateState('forecasts', new Date().toISOString());
        return { success: true };
    } catch (error) {
        log(`Error updating agency forecasts: ${error.message}`, 'error');
        return { success: false, error: error.message };
    }
}

/**
 * Main update function
 */
async function runPeriodicUpdate(options = {}) {
    const { source = 'all', agency = null } = options;
    
    log('='.repeat(60));
    log('Starting periodic update process');
    log(`Source: ${source}, Agency: ${agency || 'all'}`);
    log('='.repeat(60));
    
    const results = {
        timestamp: new Date().toISOString(),
        forecasts: null,
        gaoHighRisk: null,
        gaoReports: null
    };
    
    try {
        // Update forecasts
        if (source === 'all' || source === 'forecast') {
            results.forecasts = await updateAgencyForecasts(agency);
        }
        
        // Check GAO High-Risk List
        if (source === 'all' || source === 'gao' || source === 'gao-high-risk') {
            results.gaoHighRisk = await checkGAOHighRiskUpdates();
        }
        
        // Check GAO Reports
        if (source === 'all' || source === 'gao' || source === 'gao-reports') {
            results.gaoReports = await checkGAOReportsUpdates();
        }
        
        // Save results summary
        const summaryFile = path.join(LOG_DIR, `update-summary-${new Date().toISOString().split('T')[0]}.json`);
        await fs.writeJSON(summaryFile, results, { spaces: 2 });
        
        log('='.repeat(60));
        log('Periodic update process completed');
        log('='.repeat(60));
        
        return results;
    } catch (error) {
        log(`Fatal error in periodic update: ${error.message}`, 'error');
        log(error.stack, 'error');
        throw error;
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {};

args.forEach(arg => {
    if (arg.startsWith('--source=')) {
        options.source = arg.split('=')[1];
    } else if (arg.startsWith('--agency=')) {
        options.agency = arg.split('=')[1];
    }
});

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runPeriodicUpdate(options)
        .then(results => {
            console.log('\nUpdate Summary:', JSON.stringify(results, null, 2));
            process.exit(0);
        })
        .catch(error => {
            console.error('Update failed:', error);
            process.exit(1);
        });
}

export { runPeriodicUpdate, checkGAOHighRiskUpdates, checkGAOReportsUpdates, updateAgencyForecasts };

