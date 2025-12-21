# FPDS Contract Finder - Scaling Strategy

## Current Implementation

**Fetches**: 200 pages = **2,000 contracts maximum**
- FPDS returns 10 records per page
- Fetches in batches of 10 requests
- 200ms delay between batches

**Result**: Aggregates into contracting offices and returns top 20

## Why Fetch Thousands?

1. **Better Coverage**: More contracts = more unique agencies to choose from
2. **More Accurate Prioritization**: With more data, set-aside spending calculations are more reliable
3. **Geographic Diversity**: More contracts across different locations
4. **Quality Results**: Can filter out outliers and focus on best matches

## Performance Considerations

### FPDS Rate Limits
- FPDS doesn't have documented strict rate limits, but we should be respectful
- Current approach: Batch requests with delays
- 200 requests = ~40 seconds (with batching and delays)

### Processing Time
- XML parsing: Fast, handles 2000 contracts in seconds
- Aggregation: Grouping by office is efficient
- Total time: ~60-90 seconds for full fetch

### Memory Usage
- 2000 contracts in memory: ~10-20 MB (reasonable)
- XML responses: Parsed and discarded
- Final result: Only top 20 offices returned

## Optimization Strategies

### Option 1: Current Approach (Recommended)
- Fetch all 200 pages upfront
- Process and aggregate
- Return top 20

**Pros**: Complete dataset, best results
**Cons**: Longer initial wait time

### Option 2: Progressive Fetching (Future Enhancement)
- Fetch first 50 pages (500 contracts)
- If < 20 agencies, fetch more
- Continue until 20+ agencies found

**Pros**: Faster when fewer contracts needed
**Cons**: More complex, may need multiple round trips

### Option 3: Caching
- Cache FPDS results by NAICS code
- Refresh daily/weekly
- Instant results for cached queries

**Pros**: Much faster for repeated searches
**Cons**: Data may be slightly stale

## Monitoring

Watch for:
- Request failures (some are expected with 200 requests)
- Processing time (should be < 2 minutes)
- Memory usage (should stay reasonable)
- Results quality (should get 20+ agencies)

## Current Settings

```javascript
const maxRequests = 200; // 2000 contracts max
const batchSize = 10; // 10 requests per batch
const delay = 200; // 200ms between batches
```

## Expected Results

With 2000 contracts:
- **Unique Offices**: 50-200+ (depending on NAICS)
- **Top 20 Selected**: Best matches by set-aside spending and location
- **Processing Time**: 60-90 seconds
- **Success Rate**: High (plenty of data to work with)

## Future Improvements

1. **Smart Fetching**: Start with 100 pages, check if enough agencies, fetch more if needed
2. **Caching Layer**: Cache results for 24 hours per NAICS code
3. **Background Processing**: Queue long searches, notify when complete
4. **Progress Updates**: Stream progress to frontend during fetch





