# FPDS Contract Finder - Testing Guide

Quick guide for testing the Government Contract Finder.

## 🧪 Quick Test

1. **Start server**:
   ```bash
   npm run dev
   ```

2. **Open contract finder**:
   - Visit: `http://localhost:3000/contract-finder`
   - Or: `http://localhost:3000/content-engine-test.html`

3. **Fill in test data**:
   - **NAICS Code**: `541330` (Engineering Services)
   - **Business Formation**: `small-business`
   - **Zip Code**: `10001` (New York)
   - **Goods or Services**: `services`
   - **Veteran Status**: `not-applicable`

4. **Click "Find Agencies"**

5. **Check results**:
   - Should show top contracting offices
   - Sorted by set-aside spending
   - Includes office IDs for SAM.gov

## 📊 Test Scenarios

### Scenario 1: Small Business Construction
- NAICS: `236220` (Commercial and Institutional Building Construction)
- Formation: `small-business`
- Zip: `22102` (Virginia)
- Services: `services`

### Scenario 2: Women-Owned IT Services
- NAICS: `541511` (Custom Computer Programming Services)
- Formation: `women-owned`
- Zip: `20001` (DC)
- Services: `services`

### Scenario 3: 8(a) HVAC
- NAICS: `238220` (Plumbing, Heating, and Air-Conditioning Contractors)
- Formation: `8a`
- Zip: `33101` (Florida)
- Services: `services`

## 🔍 What to Check

✅ **API Response**:
- Console shows FPDS requests
- XML parsing succeeds
- Awards are extracted correctly

✅ **Results**:
- Top 20 offices displayed
- Sorted by set-aside spending
- Office IDs are valid
- Spending amounts look reasonable

✅ **Set-Aside Matching**:
- Offices with set-aside contracts appear first
- Set-aside spending > 0 for relevant offices

✅ **Error Handling**:
- Invalid NAICS codes handled gracefully
- Network errors show user-friendly messages
- Empty results show appropriate message

## 🐛 Troubleshooting

### Issue: No results returned
**Check**:
- NAICS code is valid 6-digit code
- FPDS API is accessible (check network tab)
- XML parsing is working (check console logs)

### Issue: Wrong set-aside matching
**Check**:
- Set-aside codes in FPDS response
- Console logs show target set-asides
- String matching is working correctly

### Issue: Slow response
**Normal**: FPDS can take 15-30 seconds
- Making 2 API requests
- XML parsing takes time
- Consider caching for production

## 📝 Console Logs to Watch

Look for:
```
Government contract search request: {...}
FPDS query criteria: ...
States to search: [...]
Target set-aside types: [...]
FPDS API Response: X awards found
Sample award keys: [...]
```

These help debug issues.

## ✅ Expected Results

For a typical search, you should see:
- 15-20 contracting offices
- Offices sorted by set-aside spending
- Total spending in millions
- Office IDs that can be used on SAM.gov
- Links to SAM.gov opportunities

## 🚀 Next Steps After Testing

Once working well:
1. Add more pagination (fetch more results)
2. Add caching for common searches
3. Add export functionality (CSV/Excel)
4. Add filters for more specific results
5. Link to actual SAM.gov opportunities





