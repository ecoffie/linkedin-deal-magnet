# Component Agency Mapping Guide

## Problem Statement

Previously, the system showed **parent agency pain points** for all contracting offices, even when those offices belonged to specific component agencies with their own unique priorities.

### Example of the Problem:
- **Cape May, NJ office** → Showed as "Department of Homeland Security" with generic DHS pain points
- **Reality**: This is U.S. Coast Guard Training Center Cape May, which has Coast Guard-specific priorities (shore infrastructure, vessel acquisition, etc.)

## Solution Implemented

We've created a **two-tier agency mapping system**:
1. **Component-level agencies** (e.g., U.S. Coast Guard, NAVFAC, USACE Civil Works)
2. **Parent agencies** (e.g., Department of Homeland Security, Department of Defense)

---

## How It Works Now

### 1. Office Code Mapping (server.js:2941-2942)
```javascript
'70Z023': 'U.S. Coast Guard Headquarters',
'00042': 'U.S. Coast Guard Training Center Cape May',
```

The server maps office codes to their full component agency names.

### 2. Pain Points Lookup (content-engine-test.html:1349-1365)
The system now searches for pain points in this priority order:

1. **Full office name** (e.g., "U.S. Coast Guard Training Center Cape May")
2. **Component agency extracted** (e.g., "U.S. Coast Guard")
   - Coast Guard
   - Customs and Border Protection
   - CISA, FEMA, ICE, TSA
   - USACE (with mission-area awareness)
   - NAVFAC, NAVSEA, NAVWAR, NAVAIR
3. **Parent agency** (e.g., "Department of Homeland Security") - only as fallback

### 3. Pain Points Database (bootcamp/agency-pain-points.json)
Contains component-level agencies with their specific pain points:

```json
{
  "U.S. Coast Guard": {
    "painPoints": [
      "Shore infrastructure backlog - $7 billion needed",
      "Offshore Patrol Cutter (OPC) program delays",
      "Acquisition cost overruns",
      ...
    ]
  }
}
```

---

## File Structure

### Main Files:
1. **`bootcamp/agency-pain-points.json`**
   - Contains pain points for all agencies
   - Now includes component-level agencies (Coast Guard, CBP, etc.)

2. **`bootcamp/usace-office-specific-pain-points.json`**
   - USACE-specific mapping by mission area
   - Maps offices to: Civil Works, MILCON, Environmental, Emergency Ops

3. **`server.js`** (lines 2928-2980)
   - Maps office codes to full component agency names
   - Example: `'00042'` → `'U.S. Coast Guard Training Center Cape May'`

4. **`content-engine-test.html`** (lines 1343-1372)
   - Updated pain points search logic
   - Extracts component agency from office name

---

## Examples

### Before Fix:
**Cape May Coast Guard Office:**
- Displayed: "Department of Homeland Security"
- Pain Points: Generic DHS (border security, immigration IT, etc.) ❌

### After Fix:
**Cape May Coast Guard Office:**
- Displayed: "U.S. Coast Guard Training Center Cape May"
- Pain Points: Coast Guard-specific ($7B shore infrastructure, OPC delays, etc.) ✅

---

## USACE Special Case

USACE has **four mission areas** with different pain points:

| Mission Area | Example Offices | Pain Points Focus |
|--------------|----------------|-------------------|
| **Civil Works** | Baltimore District, Philadelphia District | Navigation, waterways, flood control |
| **Military Construction (MILCON)** | Tobyhanna Army Depot, Huntsville Center | Base infrastructure, C5ISR facilities, PFAS |
| **Environmental** | Buffalo District, Sacramento District | Superfund sites, PFAS remediation |
| **Emergency Operations** | New Orleans District (hurricanes) | Disaster response, critical infrastructure |

### Example: Tobyhanna, PA
- **Before**: Showed navigation/waterways pain points ❌
- **After**: Shows MILCON pain points (depot modernization, C5ISR, cybersecurity) ✅

See `bootcamp/usace-office-specific-pain-points.json` for full USACE mappings.

---

## DHS Component Agencies

The system now recognizes these DHS components:

| Component | Pain Points File Entry | Key Focus Areas |
|-----------|----------------------|-----------------|
| U.S. Coast Guard | `"U.S. Coast Guard"` | Shore infrastructure, vessel acquisition |
| U.S. Customs and Border Protection | `"U.S. Customs and Border Protection"` | Border surveillance, port modernization |
| CISA | `"CISA"` | Cybersecurity, critical infrastructure |
| FEMA | `"FEMA"` | Emergency response, disaster assistance |
| ICE | `"ICE"` | Immigration enforcement |
| TSA | `"TSA"` | Transportation security |

---

## How to Add New Component Agencies

### Step 1: Add Office Code Mapping (server.js)
```javascript
// In lookupOfficeNameFromSAM function (around line 2940)
'OFFICE_CODE': 'Full Component Agency Name',
```

### Step 2: Add Pain Points (bootcamp/agency-pain-points.json)
```json
{
  "Full Component Agency Name": {
    "painPoints": [
      "Pain point 1",
      "Pain point 2"
    ]
  }
}
```

### Step 3: Add Extraction Logic (content-engine-test.html)
```javascript
// In searchStrategies array (around line 1352)
officeName?.match(/Component|Abbreviation/i) ? 'Full Component Agency Name' : null,
```

---

## Validation

To verify the system is working:

1. **Search for a contract** with a specific office (e.g., Cape May, NJ)
2. **Click the office tile** to open the modal
3. **Check "Office Information"** section:
   - "Contracting Office" should show the full component name
   - "Parent Agency" should show the department
4. **Check "Agency Priorities & Pain Points"**:
   - Should show component-specific pain points, not parent agency

---

## Sources & Research

### Coast Guard Pain Points:
- [GAO Shore Infrastructure Report - $7B Backlog](https://www.gao.gov/products/gao-25-108064)
- [GAO Offshore Patrol Cutter Report](https://news.usni.org/2025/11/28/gao-report-on-the-u-s-coast-guards-offshore-patrol-cutter-program)
- [Coast Guard FY2026 Budget](https://www.dhs.gov/sites/default/files/2025-06/25_0613_uscg_fy26-congressional-budget-justificatin.pdf)

### USACE Pain Points:
- [USACE Civil Works Overview](https://www.congress.gov/crs-product/IN11810)
- [USACE Military Construction](https://www.congress.gov/crs-product/R44710)
- [USACE Organization Structure](https://www.usace.army.mil/About/Offices-and-Units/)

---

## Future Enhancements

### USACE Dynamic Mission Mapping
Currently, USACE defaults to generic "USACE" pain points. Future enhancement could:
- Check office location/name against `usace-office-specific-pain-points.json`
- Return mission-area-specific pain points (Civil Works vs MILCON vs Environmental)

### API Integration
Could fetch real-time pain points from:
- SAM.gov Forecast API
- Agency budget justifications
- GAO reports

---

## Summary

✅ **Component agencies now show their specific pain points**
✅ **Parent agency shown separately for context**
✅ **Search logic prioritizes component over parent**
✅ **USACE has mission-area-specific mappings**
✅ **DHS components (Coast Guard, CBP, etc.) properly separated**

The system now provides **relevant, targeted pain points** that match what each specific contracting office actually works on, rather than generic department-wide priorities.
