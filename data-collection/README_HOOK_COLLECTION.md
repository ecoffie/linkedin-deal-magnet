# Hook Examples Collection Guide

This guide explains how to collect 100-500 LinkedIn hook examples for training the content generator, specifically targeting government contractor (GovCon) content.

## Strategy

**Goal**: Collect hook examples where:
- **Input**: The hook (opening line)
- **Output**: The full post (complete content)

**Target**: 100-500 examples for training data

## Methods

### Method 1: Web Search & Automated Scraping

Use `search_hook_examples.py` to automatically search and extract examples from articles:

```bash
python search_hook_examples.py
```

**Search Queries Used**:
- "best LinkedIn hooks government contractors 2025"
- "LinkedIn hooks GovCon examples"
- "viral LinkedIn posts government contracting"
- "LinkedIn content templates federal contractors"
- "top LinkedIn hooks Neal O'Grady"
- "LinkedIn hooks Jodie Cook examples"
- "Alex Groberman LinkedIn posts"
- "Logan Gott LinkedIn swipe files"
- And more...

**Advantages**:
- Automated
- Can process many sources quickly
- Good for finding lists and roundup articles

**Limitations**:
- May miss some examples due to scraping restrictions
- Requires internet connection
- Rate limits may apply

### Method 2: Manual Collection (Recommended)

Use `manual_hook_collector.py` for reliable, high-quality collection:

```bash
python manual_hook_collector.py
```

**Best Sources to Manually Collect From**:
1. **Neal O'Grady's Content**:
   - "The top 30 hooks on LinkedIn" articles
   - LinkedIn posts sharing hook examples
   - Blog posts with hook breakdowns

2. **Jodie Cook's Forbes Articles**:
   - "25 LinkedIn templates" articles
   - LinkedIn content guides
   - Hook example lists

3. **Alex Groberman's Posts**:
   - Proof-driven post examples
   - LinkedIn profile with example posts
   - Case studies with hooks

4. **Logan Gott's Swipe Files**:
   - Authority-building examples
   - Hook templates
   - Viral post collections

5. **GovCon-Specific Sources**:
   - Government contractor LinkedIn groups
   - B2G sales guides
   - Federal contracting content examples

**Process**:
1. Find an article/post with hook examples
2. Run the manual collector
3. Enter hooks and full posts one by one
4. Save periodically

**Advantages**:
- Most reliable method
- Can extract from PDFs, articles, screenshots
- High quality, curated examples
- Works offline

### Method 3: Direct Post Scraping

Use `scraper.py` to scrape actual LinkedIn posts:

```bash
python scraper.py
# Choose 'M' for manual input (paste posts)
# Or 'L' for LinkedIn URL scraping
```

**Best Use Cases**:
- Collecting your own successful posts
- Collecting from public LinkedIn profiles you follow
- Gathering examples from LinkedIn groups (with permission)

## Data Structure

Each example should have:

```json
{
  "hook": "I've helped 50 contractors win $500M+ in contracts... Here's how",
  "post": "I've helped 50 contractors win $500M+ in contracts over the past 3 years.\n\nAfter analyzing what worked...",
  "source_title": "Neal O'Grady - Top 30 LinkedIn Hooks",
  "source_url": "https://...",
  "collected_at": "2025-01-XX"
}
```

## Collection Targets

### Phase 1: Foundation (50-100 examples)
- Focus on proven creators (Neal O'Grady, Jodie Cook, Alex Groberman, Logan Gott)
- Mix of hook types (question, number, story, pattern, etc.)
- Variety of post lengths (150-300 words)

### Phase 2: Expansion (100-250 examples)
- Add GovCon-specific examples
- Include more hook variations
- Balance between different post structures

### Phase 3: Specialization (250-500 examples)
- Heavy focus on government contractor content
- Industry-specific hooks
- Agency pain point-focused hooks

## Quality Checklist

For each example, verify:
- ✅ Hook is engaging and attention-grabbing
- ✅ Full post is complete (not truncated)
- ✅ Post matches the hook naturally
- ✅ Content is relevant to government contracting (for GovCon examples)
- ✅ Post demonstrates good structure (hook → value → CTA)
- ✅ Source is credited

## Processing Collected Data

After collecting examples:

1. **Analyze patterns**:
   ```bash
   python analyze_posts.py --data-dir scraped-data/hook-examples --export
   ```

2. **Update knowledge base**:
   - Review insights
   - Add new hook patterns to `bootcamp/viral-hooks.json`
   - Update examples in knowledge base

3. **Train content generator**:
   - Use examples to refine prompts
   - Test hook generation quality
   - Iterate based on results

## Example Collection Workflow

1. **Week 1: Foundational Examples**
   - Collect from top creators (Neal O'Grady, etc.)
   - Target: 50-100 examples
   - Focus on proven viral hooks

2. **Week 2: GovCon Examples**
   - Search for government contractor content
   - Collect from GovCon LinkedIn groups
   - Target: 100-150 additional examples

3. **Week 3: Analysis & Refinement**
   - Analyze collected data
   - Identify patterns
   - Fill gaps (missing hook types)

4. **Week 4: Final Collection**
   - Collect remaining examples to reach 300-500
   - Focus on high-quality, relevant examples
   - Verify data quality

## Storage

- Raw examples: `scraped-data/hook-examples/`
- Analysis results: `scraped-data/hook_insights.json`
- Knowledge base updates: `bootcamp/viral-hooks.json`

## Tips

1. **Start with manual collection** for highest quality
2. **Use automated search** to find sources, then manually extract
3. **Focus on quality over quantity** - better to have 100 great examples than 500 mediocre ones
4. **Diversify sources** - don't rely on just one creator
5. **Keep track of sources** for attribution and reference
6. **Review regularly** - ensure examples are still relevant and high-quality

---

**Goal**: Build a comprehensive dataset that enables the content generator to create engaging, viral-worthy LinkedIn hooks specifically for government contractors!

