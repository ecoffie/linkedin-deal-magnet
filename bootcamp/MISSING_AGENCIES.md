# Missing Agencies from Knowledge Base

Based on the dropdown list, here are the agencies we're **missing**:

## ❌ Missing Agencies (7 total)

1. **Department of Labor** (DOL)
   - Forecast URL: https://www.dol.gov/agencies/oasam/centers-offices/business-operations-center/osdbu/procurement-forecast
   - Abbreviation: DOL

2. **Small Business Administration** (SBA)
   - Forecast URL: (May need to find - SBA typically helps other agencies, not major procurer)
   - Abbreviation: SBA

3. **Office of Personnel Management** (OPM)
   - Forecast URL: https://www.opm.gov/about-us/doing-business-with-opm/contracting-opportunities/
   - Abbreviation: OPM

4. **Social Security Administration** (SSA)
   - Forecast URL: https://www.ssa.gov/osdbu/contract-forecast-intro.html
   - Abbreviation: SSA

5. **Nuclear Regulatory Commission** (NRC)
   - Forecast URL: https://www.nrc.gov/about-nrc/contracting/small-business/forecast.html
   - Abbreviation: NRC

6. **Federal Communications Commission** (FCC)
   - Forecast URL: (Need to find)
   - Abbreviation: FCC

7. **Department of State** (DOS)
   - Forecast URL: https://www.state.gov/Procurement-Forecast
   - Abbreviation: DOS

## ✅ Agencies We Have (from the list)

1. ✅ General Services Administration (GSA) - `gsa.json`
2. ✅ Department of the Interior (DOI) - `doi.json`
3. ✅ Department of Veterans Affairs (VA) - `va.json`
4. ✅ Department of Commerce (DOC) - Listed but points to wrong file (dod.json) ⚠️
5. ✅ Department of Health and Human Services (HHS) - `hhs.json`
6. ✅ Department of Transportation (DOT) - `dot.json`

## ⚠️ Issue Found

**Department of Commerce** is in `index.json` but incorrectly points to `dod.json`. It should either:
- Have its own `commerce.json` file, OR
- Be properly mapped to the correct file

## Next Steps

1. Create JSON knowledge base files for the 7 missing agencies
2. Fix Department of Commerce mapping
3. Add forecast URLs to scraper configuration
4. Run scraper to extract pain points for each

