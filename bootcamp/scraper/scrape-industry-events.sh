#!/bin/bash

# Scrape Industry Events using Firecrawl
# This script scrapes industry day event transcripts and presentations

# Set Firecrawl API key
export FIRECRAWL_API_KEY="fc-e76ef9c64efa416a9e012e871a62db82"

# Navigate to scraper directory
cd "$(dirname "$0")"

# Ensure output directory exists
mkdir -p ./extractions/scraped/industry-events

# URLs to scrape
URLS=(
    "https://www.fai.gov/content/transcript-industry-day-conferences"
    "https://www.theapex.org/news/2022-apex-conference-presentations/"
)

echo "Starting industry events scraping..."
echo ""

for url in "${URLS[@]}"; do
    echo "Scraping: $url"
    
    # Extract domain name for filename
    filename=$(echo "$url" | sed 's|https\?://||' | sed 's|/|_|g' | sed 's/_$//')
    
    # Use Firecrawl API to scrape
    node -e "
    import('axios').then(async ({ default: axios }) => {
        try {
            const response = await axios.post(
                'https://api.firecrawl.dev/v1/scrape',
                {
                    url: '$url',
                    formats: ['markdown'],
                    onlyMainContent: true,
                    waitFor: 3000
                },
                {
                    headers: {
                        'Authorization': 'Bearer ' + process.env.FIRECRAWL_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    timeout: 60000
                }
            );
            
            const content = response.data?.data?.markdown || response.data?.markdown || '';
            const fs = await import('fs');
            fs.writeFileSync(
                './extractions/scraped/industry-events/${filename}.md',
                content
            );
            console.log('✅ Saved: ${filename}.md');
        } catch (error) {
            console.error('❌ Error scraping $url:', error.message);
        }
    });
    "
    
    echo ""
done

echo "Industry events scraping complete!"
echo "Files saved to: ./extractions/scraped/industry-events/"

