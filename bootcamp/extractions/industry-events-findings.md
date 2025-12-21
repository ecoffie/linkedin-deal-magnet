# Industry Events - Findings and Pain Points Extraction

## ⚠️ NOTE: This document focuses on SMALL BUSINESS challenges

For **GOVERNMENT AGENCY challenges and pain points** that vendors can offer solutions for, see: `government-pain-points-from-events.md`

## Overview

This document summarizes findings from scraped industry day events, SAME/APEX events, and OSDBU resources.

**Scraped Date**: January 2025
**Total URLs Scraped**: 13 successful, 1 failed (APEX PDF - now using pdf-parse fallback)

---

## VA OSDBU Events - Industry Day Details

### Event Types Found

1. **Quarterly Virtual Business Opportunity Sessions**
   - VHA Procurement & Logistics Office (P&LO) Regional Program Offices
   - Multiple regional offices (RPO West, RPO Central)
   - Different Network Contracting Offices (NCO 10, NCO 15, NCO 19, NCO 20, NCO 21)
   - **Frequency**: Quarterly
   - **Format**: Virtual
   - **Purpose**: Business opportunity sessions for small businesses

2. **Office of Construction and Facilities Management Virtual Scheduled One-on-One Meetings**
   - **Frequency**: Quarterly (2nd Quarter, 3rd Quarter FY 2026)
   - **Format**: Virtual one-on-one meetings
   - **Purpose**: Direct access to contracting opportunities

3. **Prime Contractor Virtual Business Opportunity Sessions**
   - General Dynamics Information Technology (GDIT)
   - Deloitte Consulting
   - ICF
   - **Purpose**: Connect small businesses with prime contractors

### Key Event Details from VA OSDBU

**Business Development Training Topics**:
- Obtaining GSA Multiple Award Contracts
- Preparing proposals
- Developing teaming strategies
- Business readiness enhancement

**Technical Assistance Services**:
- Capabilities Statement Review
- Connection to Small Business Liaisons (SBLs)
- Connection to Procurement Decision Makers (PDMs)
- Direct Access Program for SDVOSB/VOSB businesses

**Training Resources**:
- Live training sessions (via OSDBU events calendar)
- Archived training on OSDBU YouTube channel
- Training tailored for various experience levels (new entrants and seasoned contractors)

---

## DoD OSDBU Resources - Industry Day Content

### Webinar/Training Topics Found

1. **Using the Tools on the SAM.gov Portal** (Defense Small Business Series)
2. **Small Business Innovation, RRTO and SBIR/STTR**
3. **SBA Update and Government Contracting**
4. **Regulatory and Protest Update from the SBA**
5. **Procurement Technical Assistance Program (PTAP)** - How Businesses Can Access Training
6. **Roadmap to Getting a Facility Clearance**
7. **FedMall: How DoD Small Businesses Can Purchase & Sell PPE**
8. **The Future of Telework - Successful Practices for the Virtual Environment**

### Key Resources

- **"Best of Small Business Resources"** - OSBP curated collection (Oct 2025)
  - Tools, training, and programs to navigate and compete in federal marketplace
  - For businesses "just starting out or ready to scale"
  
- **Guide to Marketing to DoD** - Step-by-step guide for getting started

---

## Pain Points Extracted from VA OSDBU Content

### 1. Small Business Readiness Challenges
- **Finding**: Training focuses on "building essential skills and knowledge needed to effectively compete for and secure Federal contracts"
- **Pain Point**: Small businesses lack essential skills and knowledge for federal contracting
- **Source**: VA OSDBU Business Development Training page
- **Priority**: High

### 2. Procurement Readiness Gap
- **Finding**: Training aims to "enhance their procurement-readiness"
- **Pain Point**: Many small businesses are not procurement-ready
- **Source**: VA OSDBU Business Development Training page
- **Priority**: High

### 3. Capabilities Statement Quality Issues
- **Finding**: OSDBU advises that small businesses often struggle with creating effective capabilities statements
- **Pain Point**: Small businesses need help with capabilities statement preparation (past performance, core competencies, business information presentation)
- **Source**: VA OSDBU Technical Assistance page
- **Priority**: Medium

### 4. Small Business Access to Decision Makers
- **Finding**: Direct Access Program connects small businesses with Procurement Decision Makers "with small business needs"
- **Pain Point**: Small businesses have difficulty accessing procurement decision makers
- **Source**: VA OSDBU Technical Assistance page
- **Priority**: High

### 5. Geographic/Location-Based Connection Challenges
- **Finding**: OSDBU connects businesses with SBLs "based on the geographical location of their business"
- **Pain Point**: Small businesses may face challenges if their location doesn't align with VA office structure
- **Source**: VA OSDBU Technical Assistance page
- **Priority**: Medium

### 6. GSA Multiple Award Contract Acquisition Challenges
- **Finding**: Training specifically covers "obtaining the GSA Multiple Award Contract"
- **Pain Point**: Small businesses struggle with GSA MAC acquisition process
- **Source**: VA OSDBU Business Development Training page
- **Priority**: Medium

### 7. Proposal Preparation Difficulties
- **Finding**: Training covers "preparing a proposal"
- **Pain Point**: Small businesses need assistance with proposal preparation
- **Source**: VA OSDBU Business Development Training page
- **Priority**: High

### 8. Teaming Strategy Development Needs
- **Finding**: Training covers "developing teaming strategies"
- **Pain Point**: Small businesses lack knowledge/experience with teaming strategies
- **Source**: VA OSDBU Business Development Training page
- **Priority**: Medium

---

## Pain Points Extracted from DoD OSDBU Content

### 9. SAM.gov Portal Usage Challenges
- **Finding**: Webinar topic: "Using the Tools on the SAM.gov Portal"
- **Pain Point**: Small businesses struggle with navigating and using SAM.gov portal tools
- **Source**: DoD OSDBU Small Business Resources (Defense Small Business Series)
- **Priority**: High

### 10. Facility Clearance Process Complexity
- **Finding**: Webinar topic: "Roadmap to Getting a Facility Clearance"
- **Pain Point**: Small businesses need guidance on facility clearance process for DoD contracting
- **Source**: DoD OSDBU Small Business Resources
- **Priority**: High (critical for DoD contracts)

### 11. SBIR/STTR Program Awareness and Access
- **Finding**: Webinar topic: "Small Business Innovation, RRTO and SBIR/STTR"
- **Pain Point**: Small businesses may lack awareness or knowledge of SBIR/STTR programs
- **Source**: DoD OSDBU Small Business Resources
- **Priority**: Medium

### 12. Marketing to DoD Navigation Challenges
- **Finding**: Guide available: "How to get started with marketing to the Department of Defense"
- **Pain Point**: Small businesses don't know how to start marketing to DoD
- **Source**: DoD OSDBU Small Business Resources
- **Priority**: High

### 13. Procurement Technical Assistance Awareness
- **Finding**: Webinar topic: "How Businesses Can Access Training to Help Them Contract with DoD"
- **Pain Point**: Small businesses may not be aware of available PTAP training resources
- **Source**: DoD OSDBU Small Business Resources
- **Priority**: Medium

---

## Additional Findings

### Event Patterns
- **Virtual Format Dominance**: Most events are virtual, indicating a shift to remote engagement
- **Quarterly Cadence**: Regular quarterly events suggest ongoing need for business opportunity engagement
- **Prime Contractor Focus**: Multiple events with prime contractors (GDIT, Deloitte, ICF) indicate emphasis on subcontracting opportunities

### Training Gaps Identified
- GSA Multiple Award Contract acquisition
- Proposal preparation
- Teaming strategies development
- Business readiness fundamentals
- SAM.gov portal navigation
- Facility clearance process
- DoD marketing strategies

### Resource Availability
- DoD provides curated "Best of Small Business Resources" document (Oct 2025)
- Multiple webinar resources available with PDF presentations
- DAU (Defense Acquisition University) as key training partner
- SBA partnerships for regulatory updates

---

## Next Steps for Extraction

1. **Scrape APEX PDF** using pdf-parse fallback (302 pages) - extract pain points from presentations
2. **Review additional DoD webinar PDFs** for more specific pain points
3. **Search for more SAME/APEX event transcripts** with specific URLs
4. **Extract pain points from event descriptions** in VA events list
5. **Review FAI Industry Day transcript** content if full transcript becomes available

---

## Sources

- VA OSDBU Events List: https://vetbiz.va.gov/events/
- VA OSDBU Business Development Training: https://vetbiz.va.gov/businessdevtraining/
- VA OSDBU Technical Assistance: https://vetbiz.va.gov/technicalassistance/
- VA OSDBU Direct Access Program: https://vetbiz.va.gov/dap/
- DoD OSDBU Small Business Resources: https://business.defense.gov/Resources/Small-Business-Resources/
- FAI Industry Day Transcript: https://www.fai.gov/content/transcript-industry-day-conferences
- APEX Conference Presentations 2022: https://www.theapex.org/news/2022-apex-conference-presentations/
