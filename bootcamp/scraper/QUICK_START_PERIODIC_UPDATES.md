# Quick Start: Periodic Updates Setup

## 🚀 Fast Setup (5 minutes)

### Step 1: Test the Script Manually

```bash
cd bootcamp/scraper

# Test GAO update check
FIRECRAWL_API_KEY=fc-e76ef9c64efa416a9e012e871a62db82 node periodic-update.js --source=gao

# Test forecast update (small test)
FIRECRAWL_API_KEY=fc-e76ef9c64efa416a9e012e871a62db82 node periodic-update.js --agency="Department of Defense" --source=forecast
```

### Step 2: Install Cron Jobs

```bash
cd bootcamp/scraper
chmod +x cron-setup.sh
chmod +x run-periodic-update.sh
./cron-setup.sh install
```

### Step 3: Verify Installation

```bash
./cron-setup.sh status
```

**Done!** Your cron jobs are now set up.

---

## 📅 Default Schedule

- **Mondays 2:00 AM**: Agency Forecast Updates
- **Mondays 3:00 AM**: GAO Updates Check
- **Sundays 4:00 AM**: Full Update (everything)

---

## 📝 Manual Execution

Run updates manually anytime:

```bash
# All sources
./run-periodic-update.sh all

# Just forecasts
./run-periodic-update.sh forecast

# Just GAO
./run-periodic-update.sh gao

# Specific agency
./run-periodic-update.sh forecast "Department of Defense"
```

---

## 📊 Monitoring

Check logs:
```bash
# View today's log
tail -f bootcamp/scraper/logs/periodic-update-$(date +%Y-%m-%d).log

# View cron execution logs
tail -f bootcamp/scraper/logs/cron-*.log

# Check last update state
cat bootcamp/scraper/last-update-state.json
```

---

## 🔧 Customization

Edit schedule:
```bash
crontab -e
```

Or re-run setup:
```bash
./cron-setup.sh remove
# Edit cron-setup.sh to change times
./cron-setup.sh install
```

---

For detailed documentation, see `PERIODIC_UPDATES.md`

