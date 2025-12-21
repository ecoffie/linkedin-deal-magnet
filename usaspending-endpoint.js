// New USAspending API implementation
// Replace lines 845-1892 in server.js with this code

app.post('/api/government-contracts/search', async (req, res) => {
    try {
        const {
            businessFormation,
            naicsCode,
            zipCode,
            goodsOrServices,
            veteranStatus
        } = req.body;

        console.log('🔍 Government contract search request:', req.body);

        // Map business formation to USAspending set-aside codes
        const setAsideMap = {
            'women-owned': ['WOSB', 'EDWOSB'],
            'hubzone': ['HZBZ', 'HUBZ'],
            '8a': ['8A', '8AN', '8A COMPETED', '8A SOLE SOURCE'],
            'small-business': ['SBA', 'SBP', 'SMALL BUSINESS SET-ASIDE', 'TOTAL SMALL BUSINESS SET-ASIDE (FAR 19.5)'],
            'dot-certified': ['SBP']
        };

        const veteranMap = {
            'veteran-owned': ['VOSB', 'VO'],
            'service-disabled-veteran': ['SDVOSB', 'SDVOSBC']
        };

        // Build set-aside type codes array for USAspending API
        const setAsideTypeCodes = [];
        if (businessFormation && setAsideMap[businessFormation]) {
            setAsideTypeCodes.push(...setAsideMap[businessFormation]);
        }
        if (veteranStatus && veteranMap[veteranStatus]) {
            setAsideTypeCodes.push(...veteranMap[veteranStatus]);
        }

        console.log('🎯 Target set-aside codes:', setAsideTypeCodes);

        // Build USAspending API request
        const filters = {
            award_type_codes: ['A', 'B', 'C', 'D'], // Contracts only (A=BPA, B=Purchase Order, C=Delivery Order, D=Definitive Contract)
            time_period: [
                {
                    start_date: '2022-10-01', // Last 3 fiscal years
                    end_date: '2025-09-30'
                }
            ]
        };

        // Add NAICS filter if provided
        if (naicsCode && naicsCode.trim()) {
            filters.naics_codes = [naicsCode.trim()];
        }

        // Add set-aside filter if we have business formation or veteran status
        if (setAsideTypeCodes.length > 0) {
            filters.set_aside_type_codes = setAsideTypeCodes;
        }

        // Add location filter based on zip code
        if (zipCode && zipCode.trim()) {
            const stateFromZip = getStateFromZip(zipCode);
            if (stateFromZip) {
                const borderingStates = getBorderingStates(stateFromZip);
                const stateCodes = [stateFromZip, ...borderingStates];

                filters.place_of_performance_locations = stateCodes.map(state => ({
                    country: 'USA',
                    state: state
                }));

                console.log('📍 Searching in states:', stateCodes);
            }
        }

        console.log('🌐 USAspending API filters:', JSON.stringify(filters, null, 2));

        // Fields to request from USAspending API
        const fields = [
            'Award ID',
            'Recipient Name',
            'Award Amount',
            'Awarding Agency',
            'Awarding Sub Agency',
            'Awarding Office',
            'NAICS Code',
            'NAICS Description',
            'Place of Performance State Code',
            'Set-Aside Type'
        ];

        // Fetch contracts from USAspending API (multiple pages for comprehensive results)
        const allAwards = [];
        const maxPages = 10; // 10 pages × 100 records = 1000 contracts max
        const limit = 100;

        console.log(`📊 Fetching up to ${maxPages * limit} contracts from USAspending API...`);

        for (let page = 1; page <= maxPages; page++) {
            try {
                const response = await axios.post('https://api.usaspending.gov/api/v2/search/spending_by_award/', {
                    filters,
                    fields,
                    page,
                    limit,
                    order: 'desc',
                    sort: 'Award Amount'
                }, {
                    timeout: 30000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data && response.data.results) {
                    allAwards.push(...response.data.results);
                    console.log(`   Page ${page}: Retrieved ${response.data.results.length} contracts`);

                    // Stop if we got fewer results than the limit (last page)
                    if (response.data.results.length < limit) {
                        console.log(`   Reached last page at page ${page}`);
                        break;
                    }
                } else {
                    break;
                }
            } catch (error) {
                console.error(`Error fetching page ${page}:`, error.message);
                break;
            }

            // Small delay between requests to be respectful
            if (page < maxPages) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        console.log(`✅ Retrieved ${allAwards.length} total contracts from USAspending`);

        if (allAwards.length === 0) {
            console.log('⚠️ No contracts found. Check filters:');
            console.log('   NAICS:', naicsCode || 'none');
            console.log('   Business formation:', businessFormation || 'none');
            console.log('   Set-aside codes:', setAsideTypeCodes);

            return res.json({
                success: true,
                searchCriteria: { businessFormation, naicsCode, zipCode, goodsOrServices, veteranStatus },
                summary: {
                    totalAwards: 0,
                    totalAgencies: 0,
                    totalSpending: 0
                },
                agencies: []
            });
        }

        // Aggregate contracts by contracting office/agency
        const officeSpending = {};

        allAwards.forEach(award => {
            // Extract office information
            const awardingAgency = award['Awarding Agency'] || 'Unknown Agency';
            const awardingSubAgency = award['Awarding Sub Agency'] || awardingAgency;
            const awardingOffice = award['Awarding Office'] || awardingSubAgency;
            const location = award['Place of Performance State Code'] || null;
            const amount = award['Award Amount'] || 0;
            const setAsideType = award['Set-Aside Type'] || 'None';

            // Use agency slug as office ID (from internal_id or generated_internal_id)
            const officeId = award.agency_slug || award.awarding_agency_id || awardingAgency;

            // Create unique key for this office
            const officeKey = `${officeId}|${awardingSubAgency}`;

            if (!officeSpending[officeKey]) {
                officeSpending[officeKey] = {
                    agencyId: officeId,
                    agencyName: awardingSubAgency,
                    parentAgency: awardingAgency,
                    location: location,
                    totalSpending: 0,
                    setAsideSpending: 0,
                    contractCount: 0,
                    setAsideContractCount: 0
                };
            }

            // Add to totals
            officeSpending[officeKey].totalSpending += amount;
            officeSpending[officeKey].contractCount += 1;

            // Count set-aside spending
            const isSetAside = setAsideType && setAsideType !== 'None' && setAsideType !== 'null';
            if (isSetAside) {
                officeSpending[officeKey].setAsideSpending += amount;
                officeSpending[officeKey].setAsideContractCount += 1;
            }
        });

        // Convert to array and sort by set-aside spending (highest first)
        let topOffices = Object.values(officeSpending)
            .sort((a, b) => {
                // Primary: set-aside spending
                if (Math.abs(b.setAsideSpending - a.setAsideSpending) > 1000) {
                    return b.setAsideSpending - a.setAsideSpending;
                }
                // Secondary: total spending
                return b.totalSpending - a.totalSpending;
            })
            .slice(0, 50); // Top 50 agencies

        console.log(`📈 Aggregated into ${topOffices.length} unique agencies`);
        console.log(`💰 Total set-aside spending: $${(topOffices.reduce((sum, o) => sum + o.setAsideSpending, 0) / 1000000).toFixed(2)}M`);

        // Enhance office names using our lookup function
        console.log('🔍 Enhancing office names...');
        const officeNameLookups = await Promise.allSettled(
            topOffices.map(async (office) => {
                if (!office.agencyId || office.agencyId === 'N/A') return office;

                try {
                    const samOfficeName = await lookupOfficeNameFromSAM(office.agencyId, office.agencyName);
                    if (samOfficeName && samOfficeName !== office.agencyName && samOfficeName.length > 3) {
                        console.log(`   Enhanced: "${office.agencyName}" → "${samOfficeName}"`);
                        return { ...office, agencyName: samOfficeName };
                    }
                } catch (error) {
                    // Silently continue on lookup errors
                }
                return office;
            })
        );

        topOffices = officeNameLookups.map((result, index) =>
            result.status === 'fulfilled' ? result.value : topOffices[index]
        );

        // Return results
        const responseData = {
            success: true,
            searchCriteria: {
                businessFormation,
                naicsCode,
                zipCode,
                goodsOrServices,
                veteranStatus
            },
            summary: {
                totalAwards: allAwards.length,
                totalAgencies: topOffices.length,
                totalSpending: topOffices.reduce((sum, a) => sum + a.totalSpending, 0)
            },
            agencies: topOffices.map(office => ({
                agencyId: office.agencyId,
                agencyName: office.agencyName,
                parentAgency: office.parentAgency,
                location: office.location,
                totalSpending: office.totalSpending,
                setAsideSpending: office.setAsideSpending,
                contractCount: office.contractCount,
                setAsideContractCount: office.setAsideContractCount
            }))
        };

        console.log('✅ Returning results to client');
        res.json(responseData);

    } catch (error) {
        console.error('❌ Government contract search error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to search government contracts',
            message: error.message,
            details: error.response?.data
        });
    }
});
