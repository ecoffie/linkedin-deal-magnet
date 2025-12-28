/**
 * Component Agency Validation Script
 *
 * This script validates that all contracting offices are mapped to the correct
 * component agencies and flags any potential mismatches.
 *
 * Run this script periodically to catch missing component agency mappings.
 *
 * Usage: node validate-component-agencies.js
 */

const fs = require('fs');
const path = require('path');

// Load configuration files
const componentRules = JSON.parse(fs.readFileSync(path.join(__dirname, 'bootcamp/component-agency-rules.json'), 'utf8'));
const agencyPainPoints = JSON.parse(fs.readFileSync(path.join(__dirname, 'bootcamp/agency-pain-points.json'), 'utf8'));

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

/**
 * Extract component agency from office name using rules
 */
function extractComponentAgency(officeName, parentAgency) {
    if (!officeName || !parentAgency) return null;

    // Get department rules
    const deptRules = componentRules.departmentRules[parentAgency];
    if (!deptRules) return null;

    const officeLower = officeName.toLowerCase();

    // Check components
    for (const component of deptRules.components || []) {
        // Check patterns
        for (const pattern of component.patterns || []) {
            const regex = new RegExp(pattern, 'i');
            if (regex.test(officeName)) {
                return {
                    componentName: component.name,
                    fullName: component.fullName || component.name,
                    hasPainPoints: component.hasPainPoints,
                    fallbackTo: component.fallbackTo,
                    matchType: 'pattern'
                };
            }
        }

        // Check keywords
        for (const keyword of component.keywords || []) {
            if (officeLower.includes(keyword.toLowerCase())) {
                return {
                    componentName: component.name,
                    fullName: component.fullName || component.name,
                    hasPainPoints: component.hasPainPoints,
                    fallbackTo: component.fallbackTo,
                    matchType: 'keyword'
                };
            }
        }

        // Check sub-components (for DOD)
        if (component.subComponents) {
            for (const subComp of component.subComponents) {
                // Check patterns
                for (const pattern of subComp.patterns || []) {
                    const regex = new RegExp(pattern, 'i');
                    if (regex.test(officeName)) {
                        return {
                            componentName: subComp.name,
                            fullName: subComp.fullName || subComp.name,
                            hasPainPoints: subComp.hasPainPoints,
                            fallbackTo: component.name,
                            matchType: 'pattern',
                            isSubComponent: true
                        };
                    }
                }

                // Check keywords
                for (const keyword of subComp.keywords || []) {
                    if (officeLower.includes(keyword.toLowerCase())) {
                        return {
                            componentName: subComp.name,
                            fullName: subComp.fullName || subComp.name,
                            hasPainPoints: subComp.hasPainPoints,
                            fallbackTo: component.name,
                            matchType: 'keyword',
                            isSubComponent: true
                        };
                    }
                }
            }
        }
    }

    return null;
}

/**
 * Check if an agency has pain points in the knowledge base
 */
function hasPainPointsInKB(agencyName) {
    return agencyPainPoints.agencies && agencyPainPoints.agencies[agencyName] !== undefined;
}

/**
 * Validate a single office
 */
function validateOffice(officeName, parentAgency) {
    const issues = [];
    const warnings = [];
    const info = [];

    // Extract component
    const component = extractComponentAgency(officeName, parentAgency);

    if (!component) {
        // No component extracted - using parent agency
        if (hasPainPointsInKB(parentAgency)) {
            info.push(`Using parent agency pain points: ${parentAgency}`);
            return { issues, warnings, info, status: 'ok', painPointSource: parentAgency };
        } else {
            warnings.push(`Parent agency '${parentAgency}' not found in pain points knowledge base`);
            return { issues, warnings, info, status: 'warning', painPointSource: null };
        }
    }

    // Component extracted
    const targetAgency = component.hasPainPoints ? component.componentName : component.fallbackTo;

    if (component.hasPainPoints) {
        // Component should have pain points
        if (hasPainPointsInKB(targetAgency)) {
            info.push(`✓ Component '${component.componentName}' has specific pain points`);
            return { issues, warnings, info, status: 'good', painPointSource: targetAgency, component };
        } else {
            issues.push(`Component '${targetAgency}' marked as having pain points but NOT found in knowledge base`);
            issues.push(`  → Add '${targetAgency}' to bootcamp/agency-pain-points.json`);
            return { issues, warnings, info, status: 'error', painPointSource: null, component };
        }
    } else {
        // Component exists but uses fallback
        if (hasPainPointsInKB(component.fallbackTo)) {
            warnings.push(`Component '${component.componentName}' using fallback to '${component.fallbackTo}'`);
            warnings.push(`  → Consider adding specific pain points for '${component.componentName}'`);
            return { issues, warnings, info, status: 'warning', painPointSource: component.fallbackTo, component };
        } else {
            issues.push(`Fallback agency '${component.fallbackTo}' not found in knowledge base`);
            return { issues, warnings, info, status: 'error', painPointSource: null, component };
        }
    }
}

/**
 * Generate validation report
 */
function generateReport(testCases) {
    console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║  Component Agency Validation Report                           ║${colors.reset}`);
    console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

    let totalTests = 0;
    let passed = 0;
    let warnings = 0;
    let errors = 0;

    for (const testCase of testCases) {
        totalTests++;
        const result = validateOffice(testCase.officeName, testCase.parentAgency);

        console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
        console.log(`${colors.magenta}Office:${colors.reset} ${testCase.officeName}`);
        console.log(`${colors.magenta}Parent:${colors.reset} ${testCase.parentAgency}`);
        console.log(`${colors.magenta}Location:${colors.reset} ${testCase.location || 'N/A'}`);

        if (result.component) {
            console.log(`${colors.cyan}Component Detected:${colors.reset} ${result.component.fullName} (${result.component.matchType} match)`);
        }

        if (result.painPointSource) {
            console.log(`${colors.green}Pain Point Source:${colors.reset} ${result.painPointSource}`);
        }

        // Display issues
        if (result.issues.length > 0) {
            errors++;
            console.log(`\n${colors.red}✗ ISSUES:${colors.reset}`);
            result.issues.forEach(issue => console.log(`  ${colors.red}${issue}${colors.reset}`));
        }

        // Display warnings
        if (result.warnings.length > 0) {
            warnings++;
            console.log(`\n${colors.yellow}⚠ WARNINGS:${colors.reset}`);
            result.warnings.forEach(warning => console.log(`  ${colors.yellow}${warning}${colors.reset}`));
        }

        // Display info
        if (result.info.length > 0) {
            console.log(`\n${colors.green}ℹ INFO:${colors.reset}`);
            result.info.forEach(info => console.log(`  ${colors.green}${info}${colors.reset}`));
        }

        if (result.status === 'good' || result.status === 'ok') {
            passed++;
            console.log(`\n${colors.green}Status: PASS ✓${colors.reset}`);
        } else if (result.status === 'warning') {
            console.log(`\n${colors.yellow}Status: WARNING ⚠${colors.reset}`);
        } else {
            console.log(`\n${colors.red}Status: FAIL ✗${colors.reset}`);
        }

        console.log('');
    }

    // Summary
    console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║  Summary                                                       ║${colors.reset}`);
    console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}`);
    console.log(`${colors.blue}Total Tests:${colors.reset} ${totalTests}`);
    console.log(`${colors.green}Passed:${colors.reset} ${passed}`);
    console.log(`${colors.yellow}Warnings:${colors.reset} ${warnings}`);
    console.log(`${colors.red}Errors:${colors.reset} ${errors}`);
    console.log('');

    const successRate = ((passed / totalTests) * 100).toFixed(1);
    if (errors === 0) {
        console.log(`${colors.green}✓ All critical validations passed! (${successRate}% success rate)${colors.reset}\n`);
    } else {
        console.log(`${colors.red}✗ ${errors} critical issues found. Please review and fix.${colors.reset}\n`);
    }
}

// ===========================
// Test Cases
// ===========================

const testCases = [
    // DHS - Coast Guard
    {
        officeName: 'U.S. Coast Guard Training Center Cape May',
        parentAgency: 'Department of Homeland Security',
        location: 'CAPE MAY COURT HOUSE, NJ'
    },
    {
        officeName: 'U.S. Coast Guard Headquarters',
        parentAgency: 'Department of Homeland Security',
        location: 'Washington, DC'
    },

    // DHS - CBP
    {
        officeName: 'U.S. Customs and Border Protection',
        parentAgency: 'Department of Homeland Security',
        location: 'Various'
    },

    // DHS - CISA (no specific pain points - should use fallback)
    {
        officeName: 'Cybersecurity and Infrastructure Security Agency (CISA)',
        parentAgency: 'Department of Homeland Security',
        location: 'Arlington, VA'
    },

    // USACE - MILCON
    {
        officeName: 'U.S. Army Corps of Engineers - Tobyhanna',
        parentAgency: 'Department of Defense',
        location: 'TOBYHANNA, PA'
    },

    // USACE - Civil Works
    {
        officeName: 'U.S. Army Corps of Engineers - Baltimore District',
        parentAgency: 'Department of Defense',
        location: 'Baltimore, MD'
    },

    // HHS - NIH
    {
        officeName: 'National Institutes of Health',
        parentAgency: 'Department of Health and Human Services',
        location: 'Bethesda, MD'
    },

    // HHS - CDC
    {
        officeName: 'Centers for Disease Control and Prevention',
        parentAgency: 'Department of Health and Human Services',
        location: 'Atlanta, GA'
    },

    // HHS - FDA
    {
        officeName: 'Food and Drug Administration',
        parentAgency: 'Department of Health and Human Services',
        location: 'Silver Spring, MD'
    },

    // HHS - CMS
    {
        officeName: 'Centers for Medicare & Medicaid Services',
        parentAgency: 'Department of Health and Human Services',
        location: 'Baltimore, MD'
    },

    // DOE - NNSA
    {
        officeName: 'Los Alamos National Laboratory',
        parentAgency: 'Department of Energy',
        location: 'Los Alamos, NM'
    },

    // DOE - Office of Science
    {
        officeName: 'Argonne National Laboratory',
        parentAgency: 'Department of Energy',
        location: 'Lemont, IL'
    },

    // DOE - Nuclear Energy
    {
        officeName: 'Idaho National Laboratory',
        parentAgency: 'Department of Energy',
        location: 'Idaho Falls, ID'
    },

    // DOE - Fossil Energy
    {
        officeName: 'National Energy Technology Laboratory',
        parentAgency: 'Department of Energy',
        location: 'Pittsburgh, PA'
    },

    // DOT - FAA
    {
        officeName: 'Federal Aviation Administration',
        parentAgency: 'Department of Transportation',
        location: 'Washington, DC'
    },

    // DOT - FHWA
    {
        officeName: 'Federal Highway Administration',
        parentAgency: 'Department of Transportation',
        location: 'Washington, DC'
    },

    // DOT - FTA
    {
        officeName: 'Federal Transit Administration',
        parentAgency: 'Department of Transportation',
        location: 'Washington, DC'
    },

    // DOT - FRA
    {
        officeName: 'Federal Railroad Administration',
        parentAgency: 'Department of Transportation',
        location: 'Washington, DC'
    },

    // DOC - NOAA
    {
        officeName: 'National Oceanic and Atmospheric Administration',
        parentAgency: 'Department of Commerce',
        location: 'Silver Spring, MD'
    },

    // DOC - NIST
    {
        officeName: 'National Institute of Standards and Technology',
        parentAgency: 'Department of Commerce',
        location: 'Gaithersburg, MD'
    },

    // DOC - Census Bureau
    {
        officeName: 'U.S. Census Bureau',
        parentAgency: 'Department of Commerce',
        location: 'Suitland, MD'
    },

    // Defense-Wide - DLA
    {
        officeName: 'Defense Logistics Agency',
        parentAgency: 'Department of Defense',
        location: 'Fort Belvoir, VA'
    },

    // Defense-Wide - MDA
    {
        officeName: 'Missile Defense Agency',
        parentAgency: 'Department of Defense',
        location: 'Huntsville, AL'
    },

    // Defense-Wide - DISA
    {
        officeName: 'Defense Information Systems Agency',
        parentAgency: 'Department of Defense',
        location: 'Fort Meade, MD'
    },

    // Defense-Wide - DCMA
    {
        officeName: 'Defense Contract Management Agency',
        parentAgency: 'Department of Defense',
        location: 'Fort Gregg-Adams, VA'
    },

    // Defense-Wide - DCAA
    {
        officeName: 'Defense Contract Audit Agency',
        parentAgency: 'Department of Defense',
        location: 'Fort Belvoir, VA'
    },

    // Defense-Wide - DARPA
    {
        officeName: 'Defense Advanced Research Projects Agency',
        parentAgency: 'Department of Defense',
        location: 'Arlington, VA'
    },

    // Navy - NAVFAC
    {
        officeName: 'Naval Facilities Engineering Systems Command (NAVFAC) Atlantic',
        parentAgency: 'Department of the Navy',
        location: 'Norfolk, VA'
    },

    // Navy - NAVAIR
    {
        officeName: 'Naval Air Warfare Center Aircraft Division',
        parentAgency: 'Department of the Navy',
        location: 'Patuxent River, MD'
    },

    // Air Force
    {
        officeName: 'Air Force Materiel Command',
        parentAgency: 'Department of the Air Force',
        location: 'Wright-Patterson AFB, OH'
    },

    // Generic parent agency (no component detected)
    {
        officeName: 'Department of Veterans Affairs',
        parentAgency: 'Department of Veterans Affairs',
        location: 'Washington, DC'
    }
];

// Run validation
generateReport(testCases);
