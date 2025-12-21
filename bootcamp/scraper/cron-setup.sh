#!/bin/bash

# Cron Job Setup Script for Periodic Updates
# 
# This script helps set up cron jobs for periodic scraping and updates
# 
# Usage:
#   ./cron-setup.sh [install|remove|status]
#
# Examples:
#   ./cron-setup.sh install    # Install cron jobs
#   ./cron-setup.sh remove     # Remove cron jobs
#   ./cron-setup.sh status     # Show current cron jobs

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRAPER_DIR="$SCRIPT_DIR"
LOG_DIR="$SCRAPER_DIR/logs"

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Set Firecrawl API key (or use environment variable)
export FIRECRAWL_API_KEY="${FIRECRAWL_API_KEY:-fc-e76ef9c64efa416a9e012e871a62db82}"

# Node.js path (adjust if needed)
NODE_PATH=$(which node)

if [ -z "$NODE_PATH" ]; then
    echo "Error: Node.js not found. Please install Node.js first."
    exit 1
fi

# Cron job commands (using wrapper script for better error handling)
CRON_FORECASTS="0 2 * * 1 $SCRAPER_DIR/run-periodic-update.sh forecast >> $LOG_DIR/cron-forecasts.log 2>&1"
CRON_GAO="0 3 * * 1 $SCRAPER_DIR/run-periodic-update.sh gao >> $LOG_DIR/cron-gao.log 2>&1"
CRON_ALL="0 4 * * 0 $SCRAPER_DIR/run-periodic-update.sh all >> $LOG_DIR/cron-all.log 2>&1"

# Comments for cron jobs
COMMENT_FORECASTS="# Agency Forecast Updates - Weekly (Mondays 2 AM)"
COMMENT_GAO="# GAO Updates - Weekly (Mondays 3 AM)"
COMMENT_ALL="# Full Update - Weekly (Sundays 4 AM)"

install_cron() {
    echo "Installing cron jobs..."
    
    # Get current crontab
    crontab -l > /tmp/crontab_backup.txt 2>/dev/null || touch /tmp/crontab_backup.txt
    
    # Check if jobs already exist
    if grep -q "periodic-update.js" /tmp/crontab_backup.txt; then
        echo "Warning: Cron jobs for periodic-update.js already exist."
        echo "Please remove them first using: ./cron-setup.sh remove"
        exit 1
    fi
    
    # Add new cron jobs
    {
        cat /tmp/crontab_backup.txt
        echo ""
        echo "$COMMENT_FORECASTS"
        echo "$CRON_FORECASTS"
        echo "$COMMENT_GAO"
        echo "$CRON_GAO"
        echo "$COMMENT_ALL"
        echo "$CRON_ALL"
    } > /tmp/crontab_new.txt
    
    # Install new crontab
    crontab /tmp/crontab_new.txt
    
    echo "Cron jobs installed successfully!"
    echo ""
    echo "Schedule:"
    echo "  - Agency Forecasts: Weekly on Mondays at 2:00 AM"
    echo "  - GAO Updates: Weekly on Mondays at 3:00 AM"
    echo "  - Full Update: Weekly on Sundays at 4:00 AM"
    echo ""
    echo "Logs will be written to: $LOG_DIR/"
    
    # Cleanup
    rm -f /tmp/crontab_backup.txt /tmp/crontab_new.txt
}

remove_cron() {
    echo "Removing cron jobs..."
    
    # Get current crontab
    crontab -l > /tmp/crontab_backup.txt 2>/dev/null || touch /tmp/crontab_backup.txt
    
    # Remove lines containing periodic-update or run-periodic-update and related comments
    grep -v "periodic-update\|run-periodic-update\|# Agency Forecast Updates\|# GAO Updates\|# Full Update" /tmp/crontab_backup.txt > /tmp/crontab_new.txt
    
    # Install updated crontab
    crontab /tmp/crontab_new.txt
    
    echo "Cron jobs removed successfully!"
    
    # Cleanup
    rm -f /tmp/crontab_backup.txt /tmp/crontab_new.txt
}

show_status() {
    echo "Current cron jobs for periodic updates:"
    echo ""
    crontab -l 2>/dev/null | grep -A 1 "periodic-update\|run-periodic-update" || echo "No cron jobs found."
    echo ""
    echo "Recent log files:"
    ls -lh "$LOG_DIR"/cron-*.log 2>/dev/null | tail -5 || echo "No log files found."
    echo ""
    echo "Last update state:"
    if [ -f "$SCRAPER_DIR/last-update-state.json" ]; then
        cat "$SCRAPER_DIR/last-update-state.json" | head -20
    else
        echo "No state file found (no updates run yet)."
    fi
}

# Main logic
case "${1:-status}" in
    install)
        install_cron
        ;;
    remove)
        remove_cron
        ;;
    status)
        show_status
        ;;
    *)
        echo "Usage: $0 [install|remove|status]"
        echo ""
        echo "Commands:"
        echo "  install  - Install cron jobs for periodic updates"
        echo "  remove   - Remove cron jobs"
        echo "  status   - Show current cron jobs and recent logs"
        exit 1
        ;;
esac

