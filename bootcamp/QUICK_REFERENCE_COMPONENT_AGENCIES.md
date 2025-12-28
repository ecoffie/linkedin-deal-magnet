# Quick Reference: Component vs Parent Agencies

## Why This Matters

When a contracting office in **Cape May, NJ** shows up as "Department of Homeland Security," users see generic DHS pain points about border security and immigration - but this office is actually the **U.S. Coast Guard Training Center** focused on shore infrastructure and vessel acquisition.

**Wrong pain points = irrelevant outreach = missed opportunities.**

---

## Department of Homeland Security (DHS) Components

| Office Location Example | Component Agency | NOT Parent Agency |
|------------------------|------------------|-------------------|
| Cape May, NJ | **U.S. Coast Guard** | ~~Department of Homeland Security~~ |
| San Diego, CA (Port) | **U.S. Customs and Border Protection** | ~~Department of Homeland Security~~ |
| Arlington, VA (Cyber) | **CISA** | ~~Department of Homeland Security~~ |
| Washington, DC (Emergency) | **FEMA** | ~~Department of Homeland Security~~ |

### Pain Points Differences:

**Generic DHS:**
- Border surveillance technology
- Immigration system IT modernization
- Biometric identification systems

**U.S. Coast Guard:**
- $7 billion shore infrastructure backlog
- Offshore Patrol Cutter delays (5+ years late)
- Aviation readiness decline

**See the difference?** ✅

---

## Department of Defense - Navy Components

| Office Example | Component Agency | NOT Parent Agency |
|---------------|------------------|-------------------|
| Norfolk, VA | **NAVFAC Atlantic** | ~~Department of the Navy~~ |
| San Diego, CA | **NAVFAC Southwest** | ~~Department of the Navy~~ |
| Patuxent River, MD | **NAVAIR** | ~~Department of the Navy~~ |
| Washington, DC | **NAVSEA** | ~~Department of the Navy~~ |

---

## Department of Defense - Army (USACE) Special Case

USACE is **divided by mission area**, not just location:

| Office | Mission Area | Pain Points Focus |
|--------|-------------|-------------------|
| Tobyhanna, PA | **MILCON** | Base infrastructure, C5ISR facilities, PFAS |
| Baltimore, MD | **Civil Works** | Navigation, flood control, waterways |
| New Orleans, LA | **Civil Works + Emergency** | Coastal flood risk, disaster response |
| Huntsville, AL | **MILCON + Environmental** | Installation modernization, PFAS remediation |

**Key Point:** Two USACE offices can have completely different pain points based on their mission area!

---

## How to Identify the Right Component

### Method 1: Office Code Lookup
Office codes are mapped in `server.js` (lines 2933-2980):

```
'70Z023' → U.S. Coast Guard Headquarters
'00042' → U.S. Coast Guard Training Center Cape May
'TFMSCD' → U.S. Customs and Border Protection
'70RCSJ' → CISA
```

### Method 2: Office Name Pattern Matching
The system automatically extracts component agencies from office names:

- "U.S. Coast Guard Training Center Cape May" → **U.S. Coast Guard**
- "Naval Facilities Engineering Command Atlantic" → **NAVFAC**
- "Customs and Border Protection - San Diego" → **U.S. Customs and Border Protection**

### Method 3: Check Recent Contracts on SAM.gov
Look at what the office actually contracts for:
- Shore infrastructure contracts → **Coast Guard**
- Port of entry modernization → **CBP**
- Navigation/dredging → **USACE Civil Works**
- Base construction → **USACE MILCON**

---

## Pain Points Files Reference

### Primary File: `bootcamp/agency-pain-points.json`
Contains component-level agencies:
- U.S. Coast Guard
- U.S. Customs and Border Protection
- NAVFAC, NAVSEA, NAVWAR, NAVAIR
- USACE (generic)

### Specialty File: `bootcamp/usace-office-specific-pain-points.json`
Contains USACE mission-area-specific mappings:
- Civil Works
- Military Construction (MILCON)
- Environmental
- Emergency Operations

---

## Common Mistakes to Avoid

❌ **Wrong:** All DHS offices get DHS pain points
✅ **Right:** Coast Guard offices get Coast Guard pain points

❌ **Wrong:** All USACE offices get navigation/waterways pain points
✅ **Right:** Only USACE Civil Works districts get those; MILCON gets base infrastructure pain points

❌ **Wrong:** Showing "Department of the Navy" as the contracting office
✅ **Right:** Showing "NAVFAC Atlantic" or "NAVSEA" as the contracting office

---

## Testing Checklist

When you update the system, verify:

- [ ] Cape May, NJ shows **U.S. Coast Guard** pain points (not DHS)
- [ ] Tobyhanna, PA shows **MILCON** pain points (not Civil Works navigation)
- [ ] CBP offices show **CBP** pain points (not generic DHS)
- [ ] NAVFAC offices show **NAVFAC** pain points (not generic Navy)
- [ ] Modal displays component agency prominently, parent in context

---

## Quick Fix Workflow

If pain points are wrong for an office:

1. **Identify the component** (Coast Guard, CBP, NAVFAC, etc.)
2. **Add to office code mapping** (server.js line ~2940)
3. **Add pain points** (agency-pain-points.json)
4. **Add extraction pattern** (content-engine-test.html line ~1352)
5. **Test** by searching for that office and checking the modal

Total time: ~10 minutes per component agency.

---

## Summary

**Parent Agency** = Department (DHS, DOD, etc.) - Too generic ❌
**Component Agency** = Actual contracting entity (Coast Guard, NAVFAC, USACE MILCON) - What matters ✅

The system now automatically detects and displays component agencies, ensuring users see **relevant, actionable pain points** for each contracting office.
