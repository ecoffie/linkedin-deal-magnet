# AI Model Priority System

## Overview

The LinkedIn Deal Magnet app supports **3 AI providers** with automatic fallback:
- **Claude** (Anthropic) - High quality, costs credits
- **Grok** (X.AI) - Good quality, unlimited
- **OpenAI** (GPT-4o-mini) - Good quality, separate credits

## How It Works

Set `PRIMARY_AI_MODEL` environment variable to control which model runs **first**.

All other models become **automatic fallbacks** if the primary fails.

## Configuration

### Local Development

Edit `.env`:
```bash
PRIMARY_AI_MODEL=grok    # Use Grok first (default)
# or
PRIMARY_AI_MODEL=claude  # Use Claude first
# or
PRIMARY_AI_MODEL=openai  # Use OpenAI first
```

Then restart server:
```bash
npm start
```

### Vercel Production

```bash
# Set to Grok (preserves Anthropic credits)
echo "grok" | vercel env add PRIMARY_AI_MODEL production

# Or set to Claude (uses Anthropic credits)
echo "claude" | vercel env add PRIMARY_AI_MODEL production

# Then redeploy
vercel --prod
```

## Execution Order Examples

### Example 1: PRIMARY_AI_MODEL=grok (Default)
1. Try **Grok** first → succeeds ✅ (returns result)
2. ~~Claude fallback~~ (not needed)
3. ~~OpenAI fallback~~ (not needed)

### Example 2: PRIMARY_AI_MODEL=claude
1. Try **Claude** first → succeeds ✅ (uses Anthropic credits)
2. ~~Grok fallback~~ (not needed)
3. ~~OpenAI fallback~~ (not needed)

### Example 3: PRIMARY_AI_MODEL=grok, Grok fails
1. Try **Grok** first → fails ❌
2. Try **Claude** fallback → succeeds ✅ (uses credits)
3. ~~OpenAI fallback~~ (not needed)

### Example 4: All models fail
1. Try **Grok** → fails ❌
2. Try **Claude** → fails ❌
3. Try **OpenAI** → fails ❌
4. Return **default analysis** (hardcoded fixes)

## Why Use This?

**Preserve Anthropic credits for CLI work** while still having it as a fallback:
- Set `PRIMARY_AI_MODEL=grok` in the app
- App uses Grok API (unlimited)
- Your CLI environment still has full Anthropic access
- If Grok ever fails, Claude kicks in automatically

## Cost Comparison

| Provider | Cost | Quality | Speed |
|----------|------|---------|-------|
| **Grok** | Unlimited (X Premium+) | Good | Fast |
| **Claude** | $5/1M tokens | Excellent | Medium |
| **OpenAI** | $0.15/1M tokens | Good | Fast |

## Recommended Settings

| Environment | Setting | Reason |
|-------------|---------|--------|
| **Local Dev** | `grok` | Preserve Anthropic for CLI |
| **Production** | `grok` | Cost-effective, reliable |
| **Testing** | `claude` | Highest quality responses |

## Logs

The app logs which model it's using:

```
🤖 Primary AI Model: grok
🤖 Trying Grok...
✅ Grok analysis successful
```

Or if it fails:
```
🤖 Primary AI Model: grok
🤖 Trying Grok...
❌ grok error: Network timeout
🤖 Trying Claude...
✅ Claude analysis successful
```

## API Keys Required

All 3 keys can stay in your `.env`:
```bash
ANTHROPIC_API_KEY=sk-ant-...   # Keep as fallback
GROK_API_KEY=xai-...           # Primary
OPENAI_API_KEY=sk-proj-...     # Fallback
```

The `PRIMARY_AI_MODEL` just controls **order**, not **availability**.

## Quick Commands

```bash
# Switch to Grok locally
echo "PRIMARY_AI_MODEL=grok" >> .env

# Switch to Claude locally
echo "PRIMARY_AI_MODEL=claude" >> .env

# Switch production to Grok
echo "grok" | vercel env add PRIMARY_AI_MODEL production

# Check current setting
vercel env ls | grep PRIMARY
```

---

**Last Updated:** April 8, 2026
