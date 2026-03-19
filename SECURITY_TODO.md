# Security TODO - Keys to Rotate Before Launch

**IMPORTANT:** The following API keys/secrets were exposed in the git history and should be rotated before public launch.

## Keys to Rotate

### 1. xAI API Key
- **Location:** `server.js`, `.env.example`
- **Action Required:**
  1. Go to xAI dashboard and regenerate API key
  2. Update in `.env` file locally
  3. Update in Vercel Environment Variables
  4. Delete old key from xAI dashboard

### 2. LinkedIn Client Secret
- **Location:** `ENV_SETUP_COMPLETE.md`, `LINKEDIN_SETUP_STATUS.md`
- **Action Required:**
  1. Go to LinkedIn Developer Portal: https://www.linkedin.com/developers/apps
  2. Regenerate Client Secret for your app
  3. Update in `.env` file locally
  4. Update in Vercel Environment Variables

## After Rotating

- [ ] xAI API Key rotated
- [ ] LinkedIn Client Secret rotated
- [ ] Verified app still works with new keys
- [ ] Old keys deleted/invalidated

## Additional Security Recommendations

1. **Remove secrets from markdown files** - Don't document actual secrets in `.md` files
2. **Use `.env.example` with placeholder values** - Never commit real keys
3. **Consider using git-filter-repo** - To remove secrets from git history entirely

---
*Created: January 2026*
*Status: PENDING - Complete before public launch*
