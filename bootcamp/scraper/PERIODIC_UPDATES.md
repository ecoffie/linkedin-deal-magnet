# Periodic Updates Setup Guide

This guide explains how to set up automated periodic scraping and updates for agency forecasts and GAO reports.

## Overview

The periodic update system allows you to automatically:
- Scrape new agency forecasts from GSA Acquisition Gateway and agency-specific sites
- Check for GAO High-Risk List updates
- Check for new GAO testimonies and reports
- Update knowledge base JSON files with new findings

## Two Options: Cron Jobs or n8n Workflows

### Option 1: Cron Jobs (Unix/Linux/macOS)

Cron jobs are built into Unix-like systems and run scheduled tasks automatically.

#### Setup

1. **Make the setup script executable**:
   ```bash
   chmod +x bootcamp/scraper/cron-setup.sh
   ```

2. **Install cron jobs**:
   ```bash
   cd bootcamp/scraper
   ./cron-setup.sh install
   ```

3. **Check status**:
   ```bash
   ./cron-setup.sh status
   ```

4. **Remove cron jobs** (if needed):
   ```bash
   ./cron-setup.sh remove
   ```

#### Default Schedule

- **Agency Forecasts**: Weekly on Mondays at 2:00 AM
- **GAO Updates**: Weekly on Mondays at 3:00 AM  
- **Full Update**: Weekly on Sundays at 4:00 AM

#### Manual Execution

You can also run the update script manually:

```bash
# Update all sources
node periodic-update.js --source=all

# Update only forecasts
node periodic-update.js --source=forecast

# Update only GAO content
node periodic-update.js --source=gao

# Update specific agency
node periodic-update.js --agency="Department of Defense" --source=forecast
```

#### Environment Variables

Set the Firecrawl API key:
```bash
export FIRECRAWL_API_KEY="fc-your-api-key-here"
```

Or edit `cron-setup.sh` and update the default API key.

---

### Option 2: n8n Workflows (Visual Automation)

n8n is a workflow automation tool with a visual interface, ideal for users who prefer GUI over command line.

#### Setup

1. **Install n8n** (if not already installed):
   ```bash
   npm install -g n8n
   ```

2. **Start n8n**:
   ```bash
   n8n start
   ```

3. **Import workflow**:
   - Open n8n at http://localhost:5678
   - Click "Import from File"
   - Select `n8n-workflow.json`
   - Update the file paths in the workflow nodes to match your system

4. **Configure**:
   - Update the script paths in "Execute Forecast Update" and "Execute GAO Update" nodes
   - Set environment variables (FIRECRAWL_API_KEY, TELEGRAM_CHAT_ID if using notifications)
   - Adjust schedule times in the cron nodes if needed

5. **Activate workflow**:
   - Click the "Active" toggle to enable the workflow

#### Customizing the n8n Workflow

The provided workflow includes:
- Two cron triggers (one for forecasts, one for GAO)
- Command execution nodes to run the update script
- Success/error checking
- Optional Telegram notifications

You can customize:
- Schedule times
- Notification channels (Email, Slack, Discord, etc.)
- Additional processing steps
- Error handling logic

---

## How It Works

### State Tracking

The `periodic-update.js` script maintains a state file (`last-update-state.json`) that tracks:
- Last update timestamps for each source
- Last modified dates from websites
- Prevents unnecessary re-scraping

### Update Detection

**For GAO Updates**:
- Checks HTTP `Last-Modified` header
- Compares with last known modification date
- Only triggers full scrape if content has changed

**For Agency Forecasts**:
- Runs full scrape (forecasts change frequently)
- Uses state file to track last run time
- Outputs to timestamped files to prevent overwrites

### Logging

All updates are logged to:
- Console output (for manual runs)
- Daily log files in `bootcamp/scraper/logs/`
- Summary JSON files with update results

Example log file: `logs/periodic-update-2025-12-21.log`

---

## Customizing the Schedule

### For Cron Jobs

Edit the cron jobs directly:
```bash
crontab -e
```

Example schedules:
```bash
# Daily at 3 AM
0 3 * * * cd /path/to/scraper && node periodic-update.js --source=forecast

# Twice weekly (Monday and Thursday at 2 AM)
0 2 * * 1,4 cd /path/to/scraper && node periodic-update.js --source=forecast

# Monthly on the 1st at midnight
0 0 1 * * cd /path/to/scraper && node periodic-update.js --source=all
```

### For n8n

Edit the cron node settings in the n8n interface to adjust:
- Frequency (daily, weekly, monthly)
- Specific days/times
- Timezone

---

## Monitoring and Notifications

### Log Files

Check log files for execution status:
```bash
# View today's log
tail -f bootcamp/scraper/logs/periodic-update-$(date +%Y-%m-%d).log

# View summary
cat bootcamp/scraper/logs/update-summary-$(date +%Y-%m-%d).json
```

### Email Notifications (Cron)

Add email notifications to cron jobs:
```bash
0 2 * * 1 cd /path/to/scraper && node periodic-update.js --source=forecast | mail -s "Forecast Update" your@email.com
```

### n8n Notifications

The provided n8n workflow includes Telegram notifications. You can add:
- Email nodes
- Slack nodes
- Discord nodes
- Webhook nodes
- Custom notification logic

---

## Troubleshooting

### Cron Jobs Not Running

1. Check if cron service is running:
   ```bash
   # Linux
   systemctl status cron
   
   # macOS
   sudo launchctl list | grep cron
   ```

2. Check cron logs:
   ```bash
   # Linux
   grep CRON /var/log/syslog
   
   # macOS
   grep cron /var/log/system.log
   ```

3. Verify script paths are absolute in cron jobs:
   ```bash
   crontab -l
   ```

4. Check script permissions:
   ```bash
   ls -l bootcamp/scraper/periodic-update.js
   chmod +x bootcamp/scraper/periodic-update.js
   ```

### n8n Issues

1. Check n8n execution logs in the n8n interface
2. Verify file paths are correct and absolute
3. Check environment variables are set
4. Verify Node.js version compatibility

### API Key Issues

Ensure FIRECRAWL_API_KEY is set:
```bash
# For cron jobs, set in crontab or script
export FIRECRAWL_API_KEY="fc-your-key"

# For n8n, set in workflow environment variables
```

### Memory/Performance Issues

If running updates for many agencies, consider:
- Running updates for fewer agencies per execution
- Increasing Node.js memory limit: `node --max-old-space-size=4096 periodic-update.js`
- Running updates during off-peak hours
- Spacing out agency updates with longer delays

---

## Best Practices

1. **Start with Manual Runs**: Test the script manually before setting up automation
2. **Monitor Initially**: Watch the first few automated runs to ensure they work correctly
3. **Set Appropriate Schedules**: Weekly updates are usually sufficient; daily may be overkill
4. **Rotate Logs**: Implement log rotation to prevent log files from growing too large
5. **Backup State Files**: The state file tracks update history; backup periodically
6. **Error Handling**: Monitor for errors and set up alerts for critical failures
7. **Resource Usage**: Be mindful of API rate limits and server resources

---

## Advanced Configuration

### Selective Agency Updates

Update only specific agencies:
```bash
node periodic-update.js --agency="Department of Defense" --source=forecast
node periodic-update.js --agency="Department of Veterans Affairs" --source=forecast
```

### Custom Output Directories

Modify `periodic-update.js` to use custom output directories by editing the `OUTPUT_DIR` constant.

### Integration with Knowledge Base Updates

After scraping, you can add logic to:
- Parse scraped content for pain points
- Update agency JSON files automatically
- Generate change summaries
- Create pull requests (if using Git)

---

## Support

For issues or questions:
1. Check the logs first
2. Review this documentation
3. Test the script manually with `--source=forecast` or `--source=gao`
4. Verify API keys and permissions
5. Check network connectivity and firewall rules

