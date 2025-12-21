#!/bin/bash

# Firecrawl API Scraper Wrapper
# Usage: ./scrape.sh "Agency Name" "Abbreviation"

FIRECRAWL_API_KEY=fc-e76ef9c64efa416a9e012e871a62db82

if [ -z "$1" ]; then
    echo "Usage: ./scrape.sh \"Agency Name\" [Abbreviation]"
    echo ""
    echo "Examples:"
    echo "  ./scrape.sh \"Department of Education\" \"ED\""
    echo "  ./scrape.sh \"Department of Defense\" \"DoD\""
    exit 1
fi

export FIRECRAWL_API_KEY
node scraper-firecrawl.js "$1" "$2"

