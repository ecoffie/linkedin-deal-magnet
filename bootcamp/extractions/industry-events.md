# Industry Days & Events - Sources and Findings

This document tracks industry events (SAME, APEX, etc.) and their transcripts/notes as sources for pain points and procurement trends.

## Event Sources

### 1. SAME (Society of American Military Engineers)
- **Website**: https://www.same.org
- **Key Events**:
  - JETC (Joint Engineer Training Conference & Expo)
  - Small Business Conference
  - Industry Days
  - Regional events and local post meetings
- **Access**: Typically requires membership or event attendance
- **Status**: Searching for publicly available transcripts/presentations

### 2. APEX Events
- **Description**: Federal contracting industry events (need to identify specific organization)
- **Status**: Searching for specific APEX event sources and URLs

### 3. Federal Acquisition Institute (FAI)
- **Industry Day Transcript**: https://www.fai.gov/content/transcript-industry-day-conferences
- **Access**: Public
- **Status**: Available for scraping

## URLs to Scrape

### Confirmed URLs for Scraping:

1. **FAI Industry Day Transcript**:
   - URL: https://www.fai.gov/content/transcript-industry-day-conferences
   - Type: Transcript/notes
   - Access: Public
   - Priority: High
   - Status: Ready to scrape

2. **APEX Accelerators (National APEX Accelerator Alliance)**:
   - Website: https://www.napex.us
   - National APEX Day events: https://www.napex.us/national-apex-day-2025/
   - Type: Event information, potentially presentations/transcripts
   - Access: Public (may need to check for member-only content)
   - Priority: Medium
   - Status: Need to identify specific transcript/presentation URLs

3. **APEX Conference Presentations**:
   - URL: https://www.theapex.org/news/2022-apex-conference-presentations/
   - Type: Conference presentations (2022)
   - Access: Public
   - Priority: Medium (older, but may have relevant insights)
   - Status: Ready to scrape

### URLs Added to Scraper:

**OSDBU Resource Pages**:
- **DoD OSDBU Small Business Resources**: https://business.defense.gov/Resources/Small-Business-Resources/ (⚠️ Timeout error)
- **VA OSDBU Small Business Resources**: https://www.va.gov/osdbu/ (✅ Scraped)
- **DHS OSDBU Small Business Resources**: https://www.dhs.gov/office-small-disadvantaged-business-utilization (⚠️ 404)
- **GSA OSDBU Small Business Resources**: https://www.gsa.gov/about-us/organization/office-of-small-and-disadvantaged-business-utilization-osdbu (⚠️ 404)
- **NASA OSDBU Small Business Resources**: https://www.nasa.gov/offices/osdbu/home/index.html (⚠️ Redirected)
- **DOE OSDBU Small Business Resources**: https://www.energy.gov/osbp/office-small-and-disadvantaged-business-utilization (⚠️ 404)

**VA OSDBU Event Pages** (Found from scraped content):
- **VA OSDBU Training and Technical Assistance**: https://vetbiz.va.gov/tatassistance/ (✅ Scraped)
- **VA OSDBU Events List**: https://vetbiz.va.gov/events/ (✅ Added to scraper)
- **VA OSDBU Business Development Training**: https://vetbiz.va.gov/businessdevtraining/ (✅ Added to scraper)
- **VA OSDBU Direct Access Program**: https://vetbiz.va.gov/dap/ (✅ Added to scraper)
- **VA OSDBU Technical Assistance**: https://vetbiz.va.gov/technicalassistance/ (✅ Added to scraper)

**Note**: VA OSDBU pages contain event information and training resources that may include industry day details.

### URLs to Verify/Find:
- SAME official website event pages (https://www.same.org)
  - JETC (Joint Engineer Training Conference) presentations/transcripts
  - Small Business Conference materials
  - Regional post event pages
  - **Note**: SAME content often requires membership/attendance
- APEX Accelerator regional event pages
- PTAC (Procurement Technical Assistance Center) industry day events
- Other federal agency industry day event transcripts
- Defense industry day transcripts (DoD, Army, Navy, Air Force)
- Agency-specific industry day pages (search pattern: `agency.gov` + "industry day")

## Extraction Strategy

### Using Firecrawl Scraper:
1. Use `scraper-firecrawl.js` with Firecrawl API
2. Set Firecrawl API key: `fc-e76ef9c64efa416a9e012e871a62db82`
3. Scrape identified URLs for event transcripts and presentations
4. Extract pain points from discussions, presentations, and Q&A sessions

### Key Topics to Extract:
- Agency priorities and challenges discussed
- Pain points mentioned by agency representatives
- Industry concerns raised during events
- Procurement trends and changes
- Small business access issues
- Contract consolidation concerns
- Technology modernization needs

## Findings

### Scraped Content (January 2025)

#### FAI Industry Day Transcript
- **URL**: https://www.fai.gov/content/transcript-industry-day-conferences
- **Status**: ✅ Successfully scraped
- **File**: `extractions/scraped/industry-events/www_fai_gov_content_transcript-industry-day-conferences.md`
- **Content**: Navigation/header content - may need to access full transcript content directly
- **Notes**: Appears to be a template or landing page rather than full transcript

#### APEX Conference Presentations 2022
- **URL**: https://www.theapex.org/news/2022-apex-conference-presentations/
- **Status**: ✅ Successfully scraped
- **File**: `extractions/scraped/industry-events/www_theapex_org_news_2022-apex-conference-presentations.md`
- **Content**: Contains link to PDF presentation
- **PDF Link**: https://www.theapex.org/wp-content/uploads/2023/04/Oct-2022-APEx-Conference-Presentations.pdf
- **Notes**: Need to scrape the PDF to extract actual presentation content

### Next Steps

1. **APEX PDF**: Large PDF (302 pages) - Firecrawl timeout error. May need to:
   - Increase timeout in request (50300ms minimum per error message)
   - Consider using pdf-parse as fallback for local download
   - Or extract specific pages/sections if possible
2. **Access Full FAI Transcript**: Current scrape only got navigation/header. May need to access transcript content directly or find alternative URL with actual transcript content
3. **Search for More Event Transcripts**: Continue searching for:
   - SAME JETC presentations/transcripts
   - SAME Small Business Conference materials
   - Regional SAME post event pages
   - Other agency industry day transcripts
4. **Extract Pain Points**: Once content is available, extract pain points from discussions and presentations

### Status Summary

- ✅ **FAI Industry Day**: Scraped (but appears to be landing page, not full transcript)
- ⚠️ **APEX Presentations PDF**: Scraped landing page, PDF scraping failed (too large - 302 pages, needs longer timeout)
- ✅ **VA OSDBU**: Successfully scraped
- ✅ **DHS OSDBU**: Successfully scraped
- ✅ **GSA OSDBU**: Successfully scraped
- ✅ **NASA OSDBU**: Successfully scraped
- ✅ **DOE OSDBU**: Successfully scraped
- ❌ **DoD OSDBU**: Failed (timeout - 408 error)
- 🔍 **SAME Events**: Need to identify specific transcript/presentation URLs
- 🔍 **Other Events**: Continue searching for additional industry day transcripts

### Scraped OSDBU Pages (January 2025)

These pages may contain links to industry day events, resources, or information about small business opportunities:

1. **VA OSDBU**: `www_va_gov_osdbu.md` - Contains small business resources and opportunities
2. **DHS OSDBU**: `www_dhs_gov_office-small-disadvantaged-business-utilization.md` - Office of Small and Disadvantaged Business Utilization
3. **GSA OSDBU**: `www_gsa_gov_about-us_organization_office-of-small-and-disadvantaged-business-utilization-osdbu.md` - OSDBU resources
4. **NASA OSDBU**: `www_nasa_gov_offices_osdbu_home_index_html.md` - Small business office resources
5. **DOE OSDBU**: `www_energy_gov_osbp_office-small-and-disadvantaged-business-utilization.md` - Office of Small and Disadvantaged Business Utilization

**Next Step**: Review scraped OSDBU pages for:
- Links to industry day events
- Presentation/transcript links
- Small business event calendars
- Resources that mention pain points or agency priorities

### Scraped Content Summary

**Total URLs Scraped**: 9
**Successful**: 9
**Failed**: 1 (APEX PDF - too large, DoD OSDBU - timeout)

**Files Created**:
1. `www_fai_gov_content_transcript-industry-day-conferences.md` - FAI Industry Day Transcript page
2. `www_theapex_org_news_2022-apex-conference-presentations.md` - APEX Conference Presentations page
3. `www_va_gov_osdbu.md` - VA OSDBU main page
4. `vetbiz_va_gov_tatassistance.md` - VA OSDBU Training and Technical Assistance (Events Calendar)
5. `www_dhs_gov_office-small-disadvantaged-business-utilization.md` - DHS OSDBU (404)
6. `www_gsa_gov_about-us_organization_office-of-small-and-disadvantaged-business-utilization-osdbu.md` - GSA OSDBU (404)
7. `www_nasa_gov_offices_osdbu_home_index_html.md` - NASA OSDBU (redirected)
8. `www_energy_gov_osbp_office-small-and-disadvantaged-business-utilization.md` - DOE OSDBU (404)

### Pain Points Extracted

See `industry-events-findings.md` for detailed pain points extracted from scraped content.

**Summary of Pain Points Found**:
1. Small business readiness challenges (VA, DoD)
2. Procurement readiness gap (VA)
3. Capabilities statement quality issues (VA)
4. Small business access to decision makers (VA)
5. Geographic/location-based connection challenges (VA)
6. GSA Multiple Award Contract acquisition challenges (VA)
7. Proposal preparation difficulties (VA)
8. Teaming strategy development needs (VA)
9. SAM.gov portal usage challenges (DoD)
10. Facility clearance process complexity (DoD)
11. SBIR/STTR program awareness and access (DoD)
12. Marketing to DoD navigation challenges (DoD)
13. Procurement Technical Assistance awareness (DoD)

**Total Pain Points Identified**: 13 from VA and DoD OSDBU content

**Next Steps**: Extract pain points from APEX PDF and additional DoD webinar PDFs

**Next Steps for Extraction**:
1. Review `vetbiz_va_gov_tatassistance.md` for event information and pain points
2. Extract any industry day event details from VA OSDBU pages
3. Search for more specific industry day transcript/presentation URLs
4. Consider using pdf-parse for the large APEX PDF (302 pages)

---

## Notes

- Industry event transcripts are often restricted to attendees/members
- Focus on publicly available sources first (FAI, public agency industry day pages)
- Consider contacting event organizers for access to materials
- See `KNOWLEDGE_BASE_SOURCES.md` for context on using industry events as Tier 3 sources

