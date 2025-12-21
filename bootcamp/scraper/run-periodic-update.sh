#!/bin/bash

# Wrapper script for running periodic updates
# This script ensures environment variables are set and handles errors

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Set Firecrawl API key if not already set
if [ -z "$FIRECRAWL_API_KEY" ]; then
    export FIRECRAWL_API_KEY="fc-e76ef9c64efa416a9e012e871a62db82"
fi

# Ensure Node.js is available
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    exit 1
fi

# Ensure logs directory exists
mkdir -p logs

# Parse arguments
SOURCE="${1:-all}"
AGENCY="${2:-}"

# Build command
CMD="node periodic-update.js --source=$SOURCE"
if [ -n "$AGENCY" ]; then
    CMD="$CMD --agency=\"$AGENCY\""
fi

# Run the update script
echo "Running periodic update: $CMD"
echo "Timestamp: $(date)"

# Execute and capture output
if $CMD 2>&1 | tee -a "logs/cron-execution-$(date +%Y%m%d).log"; then
    echo "Update completed successfully at $(date)"
    exit 0
else
    echo "Update failed at $(date)" >&2
    exit 1
fi

