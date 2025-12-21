/**
 * Test Server - Run this to test the API endpoints locally
 * Usage: node test-server.js
 */

const axios = require('axios');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

// Test data
const testLinkedInUrl = 'https://linkedin.com/in/test-profile';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testHealthCheck() {
    log('\n🧪 Testing Health Check Endpoint...', 'blue');
    try {
        const response = await axios.get(`${BASE_URL}/api/health`);
        if (response.data.status === 'ok') {
            log('✓ Health check passed', 'green');
            return true;
        } else {
            log('✗ Health check failed - invalid response', 'red');
            return false;
        }
    } catch (error) {
        log(`✗ Health check failed: ${error.message}`, 'red');
        return false;
    }
}

async function testAuditEndpoint() {
    log('\n🧪 Testing Audit Endpoint...', 'blue');
    try {
        const response = await axios.post(`${BASE_URL}/api/audit`, {
            url: testLinkedInUrl
        }, {
            timeout: 60000 // 60 second timeout
        });

        const data = response.data;
        
        // Validate response structure
        const hasScore = typeof data.score === 'number' && data.score >= 0 && data.score <= 100;
        const hasHeadlines = typeof data.currentHeadline === 'string' || typeof data.aiHeadline === 'string';
        const hasFixes = Array.isArray(data.fixes) && data.fixes.length > 0;

        if (hasScore && hasHeadlines && hasFixes) {
            log('✓ Audit endpoint passed', 'green');
            log(`  Score: ${data.score}`, 'green');
            log(`  Fixes: ${data.fixes.length}`, 'green');
            return true;
        } else {
            log('✗ Audit endpoint failed - invalid response structure', 'red');
            log(`  Has score: ${hasScore}`, 'red');
            log(`  Has headlines: ${hasHeadlines}`, 'red');
            log(`  Has fixes: ${hasFixes}`, 'red');
            return false;
        }
    } catch (error) {
        if (error.response) {
            log(`✗ Audit endpoint failed: ${error.response.status} - ${error.response.statusText}`, 'red');
            log(`  Message: ${error.response.data?.message || 'Unknown error'}`, 'red');
        } else {
            log(`✗ Audit endpoint failed: ${error.message}`, 'red');
        }
        return false;
    }
}

async function testInvalidUrl() {
    log('\n🧪 Testing Invalid URL Handling...', 'blue');
    try {
        const response = await axios.post(`${BASE_URL}/api/audit`, {
            url: 'not-a-linkedin-url'
        });
        log('✗ Invalid URL test failed - should have returned 400', 'red');
        return false;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            log('✓ Invalid URL handling works correctly', 'green');
            return true;
        } else {
            log(`✗ Invalid URL test failed: ${error.message}`, 'red');
            return false;
        }
    }
}

async function runAllTests() {
    log('\n🚀 Starting Test Suite...', 'blue');
    log('=' .repeat(50), 'blue');

    const results = {
        health: await testHealthCheck(),
        audit: await testAuditEndpoint(),
        invalidUrl: await testInvalidUrl(),
    };

    log('\n' + '='.repeat(50), 'blue');
    log('\n📊 Test Results Summary:', 'blue');
    log(`  Health Check: ${results.health ? '✓ PASS' : '✗ FAIL'}`, results.health ? 'green' : 'red');
    log(`  Audit Endpoint: ${results.audit ? '✓ PASS' : '✗ FAIL'}`, results.audit ? 'green' : 'red');
    log(`  Invalid URL: ${results.invalidUrl ? '✓ PASS' : '✗ FAIL'}`, results.invalidUrl ? 'green' : 'red');

    const allPassed = Object.values(results).every(r => r === true);
    if (allPassed) {
        log('\n✅ All tests passed!', 'green');
    } else {
        log('\n❌ Some tests failed', 'red');
        process.exit(1);
    }
}

// Run tests
if (require.main === module) {
    runAllTests().catch(error => {
        log(`\n💥 Test suite crashed: ${error.message}`, 'red');
        process.exit(1);
    });
}

module.exports = { testHealthCheck, testAuditEndpoint, testInvalidUrl };










