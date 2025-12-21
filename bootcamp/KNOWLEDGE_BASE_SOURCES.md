# Knowledge Base Source Documentation

This document tracks the authoritative sources used to populate agency pain points and strategic priorities in the knowledge base.

## Source Priority Ranking

### Tier 1: Primary Sources (Most Authoritative)
1. **Agency Acquisition/Procurement Forecasts**
   - Why: Direct statements of upcoming needs and implicit pain points
   - Update Frequency: Annual (FY2025, FY2026, etc.) with quarterly updates
   - Format: PDFs, web pages, structured data
   - Key Sites:
     - **GSA Acquisition Gateway**: https://hallway.acquisition.gov/forecast (Centralized forecasts from multiple agencies - see `GSA_ACQUISITION_GATEWAY_GUIDE.md` for detailed usage)
     - DoD: https://business.defense.gov
     - DHS: https://www.dhs.gov/acquisition-forecast
     - VA: https://www.va.gov/osdbu/acquisition-forecast
     - DOE: https://www.energy.gov/osbp/acquisition-forecast

2. **GAO High-Risk List & Reports**
   - Why: Explicit identification of government-wide and agency-specific challenges
   - Update Frequency: Biennial major update (2023, 2025, 2027) + ongoing testimonies
   - Format: PDFs, web reports
   - Key Site: https://www.gao.gov/highrisk
   - **2025 High-Risk Series Key Reports**:
     - Improving IT Acquisitions and Management (Government-wide)
     - Improving the Delivery of Federal Disaster Assistance (NEW - FEMA/DHS)
     - VA IT Management
     - Defense Supply Chain
     - Critical Infrastructure Protection
     - DOE Environmental Cleanup
     - DOI Federal Real Property
   - **Agency-Specific Testimonies**: Congressional testimonies provide detailed findings on specific issues (e.g., DoD weapon systems delays, VA EHR challenges)
   - Key Site: https://www.gao.gov/testimonies
   - See `GAO_HIGH_RISK_GUIDE.md`, `GAO_2025_HIGH_RISK_SUMMARY.md`, and `GAO_TESTIMONIES_GUIDE.md` for detailed extraction guidance

3. **Agency Strategic Plans & Budget Justifications** ⭐ ENHANCED
   - Why: Reveal priorities like AI adoption, zero trust cybersecurity, legacy modernization (common 2025 pains), strategic initiatives, funding allocations, and implementation timelines
   - Update Frequency: Annual (budgets), 3-5 years (strategic plans)
   - Format: PDFs, web pages
   - Key Sites:
     - **Performance.gov**: Agency performance plans and strategic objectives (https://www.performance.gov)
     - **Congressional Budget Justifications (CBJ)**: Detailed budget requests to Congress (https://www.whitehouse.gov/omb or agency sites like DoD: https://comptroller.defense.gov/Budget-Materials/)
     - **Agency Budget Justifications**: Individual agency budget documents (typically `agency.gov/budget` or `agency.gov/about/budget`)
     - **Agency Strategic Plans**: Individual agency strategic planning documents (typically `agency.gov/strategic-plan` or `agency.gov/about/strategic-plan`)
     - **OMB**: https://www.whitehouse.gov/omb (Government-wide budget and agency justifications)
   - **Common 2025 Priorities to Extract**:
     - **AI Adoption**: Artificial intelligence and machine learning initiatives, responsible AI governance
     - **Zero Trust Cybersecurity**: Zero trust architecture implementation, cybersecurity modernization
     - **Legacy Modernization**: Legacy system replacement, IT infrastructure modernization, mainframe migration
     - **Cloud Migration**: Cloud computing adoption, multi-cloud strategies
     - **Data Modernization**: Data analytics capabilities, data sharing, interoperability
     - **Workforce Modernization**: Skills gaps, training needs, recruitment strategies
   - **Extraction Strategy**:
     1. Review strategic plan executive summary for top priorities
     2. Scan budget justifications for major funding allocations
     3. Look for "strategic goals", "key initiatives", "priority areas"
     4. Identify pain points implied by priorities (e.g., "AI adoption" → need for AI expertise, data infrastructure)
     5. Cross-reference with acquisition forecasts for procurement priorities
   - See `STRATEGIC_PLANS_GUIDE.md` for detailed extraction guidance

### Tier 2: Secondary Sources (Supporting Context)
5. **Inspector General Reports**
   - Why: Agency-specific audits identifying specific problems
   - Update Frequency: Ongoing
   - Format: PDFs
   - Example: DHS OIG, VA OIG

6. **Comprehensive Agency Scorecards & Forecasts**
   - **PSC Federal Business Forecast Scorecard** (70+ agencies)
     - Why: Annual evaluation of procurement forecasts from 70+ federal agencies, assessing transparency, clarity, and forecasting effectiveness
     - Update Frequency: Annual
     - Format: Web-based scorecard with downloadable reports
     - Key Site: https://www.pscouncil.org/scorecard
     - Coverage: Evaluates 15 key attributes including project descriptions, contact info, solicitation dates
     - Value: Identifies agencies with "good", "fair", or "needs improvement" forecasting - reveals pain points indirectly
     - Example: 2024 Scorecard highlighted Department of Labor (excellent) vs. NSF (needs improvement - PDF format issues)
   
   - **GovConChamber.com Agency Lists**
     - Why: Comprehensive listings and analysis of agency procurement forecasts
     - Update Frequency: Ongoing/annual
     - Format: Web articles, reports
     - Key Site: https://www.govconchamber.com (verify exact URL)
     - Coverage: Aggregated agency forecasts and procurement trends
   
   - **SBA Procurement Scorecards**
     - Why: Annual assessment of how well agencies meet small business contracting goals (grades A+ to F)
     - Update Frequency: Annual
     - Format: Web-based scorecards with downloadable reports
     - Key Site: https://www.sba.gov/federal-contracting/contracting-data/small-business-procurement-scorecard
     - Value: Reveals agencies struggling with small business goals - indicates pain points in small business access
     - Example: Department of Energy consistently receives high grades

7. **Industry Analyses & Trend Reports** ⭐ ENHANCED
   - Why: Summarize pain points from forecasts, GAO reports, and other sources, providing synthesized insights on trends like contract consolidation, small business access challenges, and procurement modernization
   - Update Frequency: Ongoing/annual
   - Format: PDFs, web articles, research reports
   - **Reliable Sources**:
     - **GovWin/Deltek Reports**:
       - Why: Comprehensive market research on federal contracting trends, consolidation patterns, and agency spending
       - Key Site: https://www.deltek.com/en/products/govwin-iq (subscription-based)
       - Coverage: Market analysis, contract consolidation trends, small business impacts, agency spending forecasts
       - Value: Synthesizes multiple sources into actionable insights on procurement trends and pain points
     - **Professional Services Council (PSC) Forecast Scorecard**:
       - Why: Annual evaluation of procurement forecasts from 70+ federal agencies (see `PSC_SCORECARD_GUIDE.md` for detailed usage)
       - Key Site: https://www.pscouncil.org/scorecard
       - Coverage: Forecast quality, transparency, small business access, consolidation patterns
       - Note: Already documented separately as Tier 2 source #6
     - **FedBizAccess**:
       - Why: Industry insights on federal contracting trends, market analysis, and agency spending patterns
       - Key Site: https://www.fedbizaccess.com (verify exact URL)
       - Coverage: Market trends, small business opportunities, contract consolidation impacts
       - Format: Articles, trend reports, market analyses
     - **ExecutiveGov**:
       - Why: News and analysis on federal government contracting, technology trends, and agency priorities
       - Key Site: https://www.executivegov.com
       - Coverage: Contract awards, industry trends, agency modernization initiatives, small business access
       - Format: Articles, trend reports, industry analysis
   - **Common Topics Covered**:
     - Contract consolidation impacts on small businesses
     - Small business access challenges
     - Procurement modernization trends
     - Agency spending patterns and forecasts
     - Technology adoption trends (AI, cloud, cybersecurity)
     - Set-aside program effectiveness
   - **How to Use**:
     1. Review annual/quarterly trend reports for synthesized insights
     2. Cross-reference with original sources (forecasts, GAO reports) for validation
     3. Extract pain points mentioned in trend analysis
     4. Identify patterns across multiple agencies
     5. Use as supporting context rather than primary source
   - **Extraction Strategy**:
     - Look for "pain points", "challenges", "trends", "concerns" sections
     - Extract synthesized insights that summarize multiple source findings
     - Cross-reference cited sources back to original documents
     - Use industry reports to identify which agency pain points are most significant or widespread
   - See `INDUSTRY_REPORTS_GUIDE.md` for detailed guidance on using industry analyses and trend reports
   - Note: PSC Forecast Scorecard is documented separately in `PSC_SCORECARD_GUIDE.md`

### Tier 3: Supporting Sources
8. **Industry Days/Events**
   - Transcripts from SAME, APEX, and other industry events
   - Source: Professional networks

9. **Expert Knowledge**
   - Curated insights from domain experts
   - Source: Internal expertise, client feedback

## Extraction Strategy

### Current Approach
- Manual curation of pain points from Tier 1 sources
- Structured JSON format with source citations
- Priority levels (critical, high, medium, low)

### Future Automation Opportunities
1. **PDF Parsing**
   - Use `pdf-parse` or `pdfjs` to extract text from forecast PDFs
   - Parse structured sections (pain points, priorities, funding)

2. **Web Scraping**
   - Scrape acquisition forecast web pages
   - Parse HTML tables and lists

3. **API Integration**
   - Where available, use official APIs
   - Most agencies don't provide structured APIs (yet)

4. **Scheduled Updates**
   - Cron job or n8n workflow
   - Check for new forecast publications
   - Alert for review and manual curation

## Source Citation Format

Each pain point or priority includes:
```json
{
  "point": "Description of pain point",
  "source": "Source document name and year",
  "priority": "high|medium|low",
  "url": "https://..." // Optional
}
```

## Update Schedule

- **Quarterly Review**: Check for new GAO reports, OIG findings
- **Annual Update**: Refresh all acquisition forecasts (typically published Q2-Q3)
- **As-Needed**: Update for major policy changes or new strategic plans

## Maintenance Checklist

- [ ] Check GAO High-Risk List updates (biennial)
- [ ] Review agency acquisition forecasts (annual)
- [ ] **Review agency strategic plans and budget justifications (annual)**
- [ ] **Review Congressional Budget Justifications via whitehouse.gov/omb (annual)**
- [ ] **Review Performance.gov for agency performance plans (quarterly/annual)**
- [ ] **Review OPM Federal Workforce Priorities Report (annual)**
- [ ] **Review PSC Federal Business Forecast Scorecard (annual - Q2/Q3)**
- [ ] **Review SBA Procurement Scorecards (annual)**
- [ ] Scan OIG reports for new findings (quarterly)
- [ ] Review strategic plan updates (as published)
- [ ] Validate URLs and links (quarterly)
- [ ] Cross-reference with industry reports (quarterly)
- [ ] **Identify new agencies from PSC Scorecard for knowledge base expansion**

## Notes

- Always verify sources are publicly available (FAR-compliant)
- Prioritize official agency sources over third-party summaries
- Include source URLs when available for GEO authority
- Mark priority levels based on frequency in sources and funding allocated

