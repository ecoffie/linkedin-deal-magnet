# Opportunity Scout - USAspending API Integration

Guide for the Opportunity Scout feature using USAspending API (formerly used FPDS).

## 🎯 What It Does

The Opportunity Scout helps users identify government agencies and contracting offices that award contracts matching their business profile (NAICS code, set-asides, location, etc.).

## 📊 Features

- **NAICS Code Search**: Filter contracts by industry code
- **Set-Aside Filtering**: Find agencies that award contracts to your business type (WOSB, 8(a), small business, etc.)
- **Veteran Status**: Filter by veteran-owned or service-disabled veteran-owned
- **Location-Based**: Search by zip code (includes bordering states)
- **Goods vs Services**: Filter by contract type
- **Top Agencies Ranking**: Sorted by set-aside spending (offices that spend most on your business type)

## 🔧 Technical Implementation

### API Endpoint

**POST** `/api/government-contracts/search`

**Request Body**:
```json
{
  "businessFormation": "women-owned" | "8a" | "small-business" | "dot-certified",
  "naicsCode": "541330",
  "zipCode": "10001",
  "goodsOrServices": "goods" | "services" | "both",
  "veteranStatus": "veteran-owned" | "service-disabled-veteran" | "not-applicable"
}
```

**Response**:
```json
{
  "success": true,
  "searchCriteria": { ... },
  "summary": {
    "totalAwards": 20,
    "totalAgencies": 15,
    "totalSpending": 50000000
  },
  "agencies": [
    {
      "agencyId": "123456",
      "agencyName": "Contracting Office Name",
      "parentAgency": "Department Name",
      "location": "VA",
      "totalSpending": 10000000,
      "setAsideSpending": 2000000,
      "contractCount": 50,
      "setAsideContractCount": 10
    }
  ]
}
```

### USAspending API Integration

Uses USAspending API: `https://api.usaspending.gov/api/v2/search/spending_by_award/`

**Features**:
- JSON responses (no XML parsing needed!)
- Multiple paginated requests (10 pages = 1000 contracts max)
- Direct set-aside type filtering in API
- Office-level aggregation by awarding agency/sub-agency
- Spending calculation and sorting
- Much more reliable than FPDS (official US Treasury API)

## 📋 Set-Aside Code Mapping

| Business Formation | USAspending Set-Aside Codes |
|-------------------|------------------------------|
| women-owned | WOSB, EDWOSB |
| hubzone | HZBZ, HUBZ |
| 8a | 8A, 8AN, 8A COMPETED, 8A SOLE SOURCE |
| small-business | SBA, SBP, SMALL BUSINESS SET-ASIDE, TOTAL SMALL BUSINESS SET-ASIDE (FAR 19.5) |
| veteran-owned | VOSB, VO |
| service-disabled-veteran | SDVOSB, SDVOSBC |

## 🗺️ Location Features

### Zip Code to State Mapping
- Converts zip code to state code
- Includes bordering states in search
- Helps find opportunities in nearby regions

### State Code Mapping
- Maps 2-letter state codes to full names
- Used for FPDS queries and display

## 📊 Data Aggregation

The API aggregates contract data by **contracting office** and calculates:
- **Total Spending**: All contracts awarded by office
- **Set-Aside Spending**: Contracts matching user's business type
- **Contract Counts**: Total contracts and set-aside contracts
- **Top Contracts**: Up to 3 sample contracts per office

## 🎯 Sorting Logic

Results are sorted by:
1. **Primary**: Set-aside spending (highest first)
2. **Secondary**: Total spending (highest first)

This prioritizes offices that award the most contracts to businesses like yours.

## 🔍 Search Filters

### Required Filters
- **Date Range**: Last 3 fiscal years (Oct 2022 - Sep 2025)
- **NAICS Code**: If provided, filters to that industry

### Optional Filters
- **Business Formation**: Filters set-aside types
- **Veteran Status**: Additional set-aside filtering
- **Zip Code**: Location-based search (with bordering states)
- **Goods/Services**: Contract type filtering

## 🚀 Usage

### Frontend Access
Visit: `http://localhost:3000/contract-finder`

Or: `http://localhost:3000/content-engine-test.html`

### API Direct Access
```javascript
const response = await fetch('/api/government-contracts/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        naicsCode: '541330',
        businessFormation: 'small-business',
        zipCode: '10001',
        goodsOrServices: 'services',
        veteranStatus: 'not-applicable'
    })
});
```

## 🐛 Known Limitations

1. **FPDS Rate Limits**: Only fetches 20 records (2 requests x 10 records)
   - FPDS limits to 10 records per request
   - Could be extended with more pagination

2. **State Filtering**: Currently searches all states, not just user's state
   - Zip code is used for display/context, not filtering
   - Could be enhanced to filter FPDS results by state

3. **Set-Aside Matching**: Uses string matching on set-aside codes
   - May miss some variations
   - Could be more robust with regex or exact code matching

4. **XML Parsing**: Relies on consistent FPDS XML structure
   - May break if FPDS changes format
   - Error handling in place to skip malformed entries

## 🔧 Improvements You Could Make

1. **Increase Result Count**: 
   - Make more paginated requests (currently 2 = 20 records)
   - Add pagination to UI for more results

2. **Better State Filtering**:
   - Actually filter FPDS queries by state
   - Use state code in FPDS query string

3. **Caching**:
   - Cache FPDS results for common searches
   - Reduce API calls for repeated queries

4. **More Detail**:
   - Show sample contracts per office
   - Include contact information if available
   - Link to SAM.gov opportunities

5. **Error Handling**:
   - Better error messages for users
   - Retry logic for failed FPDS requests
   - Fallback if FPDS is down

## 📝 Testing

Test with different combinations:
- Different NAICS codes
- Various set-aside types
- Different zip codes
- Goods vs services

Check console logs for:
- FPDS query strings
- Number of awards found
- Office aggregation results
- Set-aside matching

## ✅ Current Status

- ✅ FPDS ATOM feed integration
- ✅ XML parsing working
- ✅ Office-level aggregation
- ✅ Set-aside spending calculation
- ✅ Results sorted by relevance
- ✅ UI displays results in table format
- ✅ Links to SAM.gov for opportunities

The Contract Finder is functional and ready for testing! 🚀





