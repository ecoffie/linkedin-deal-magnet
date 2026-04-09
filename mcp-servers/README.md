# MCP Servers for LinkedIn Deal Magnet

Model Context Protocol (MCP) servers for external service integrations.

---

## Available Servers

### 1. Stripe MCP Server (`mcp-servers/stripe/`)
**Purpose:** Payment processing

**Tools:**
- `create_checkout_session` - Create Stripe checkout for $97 product
- `verify_payment` - Check if payment succeeded
- `get_customer` - Retrieve customer by email or ID
- `list_payments` - List customer's payment history
- `create_refund` - Refund a payment

**Setup:**
```bash
cd mcp-servers/stripe
npm install
chmod +x index.js
```

**Test:**
```bash
STRIPE_SECRET_KEY=sk_test_... node index.js
```

**Usage in Claude Code:**
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "stripe": {
      "command": "node",
      "args": ["/Users/ericcoffie/Linkedin App/mcp-servers/stripe/index.js"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_..."
      }
    }
  }
}
```

Then use: `mcp__stripe__create_checkout_session`

---

### 2. Resend MCP Server (`mcp-servers/resend/`)
**Purpose:** Email delivery

**Tools:**
- `send_email` - Send transactional email
- `send_batch_emails` - Send multiple emails
- `add_to_audience` - Add contact to email list
- `remove_from_audience` - Remove contact from list
- `check_email_status` - Check delivery status

**Setup:**
```bash
cd mcp-servers/resend
npm install
chmod +x index.js
```

**Test:**
```bash
RESEND_API_KEY=re_... node index.js
```

**Usage in Claude Code:**
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "resend": {
      "command": "node",
      "args": ["/Users/ericcoffie/Linkedin App/mcp-servers/resend/index.js"],
      "env": {
        "RESEND_API_KEY": "re_..."
      }
    }
  }
}
```

Then use: `mcp__resend__send_email`

---

## Development

### Creating a New MCP Server

1. **Create directory:**
```bash
mkdir mcp-servers/[service-name]
cd mcp-servers/[service-name]
```

2. **Create `package.json`:**
```json
{
  "name": "[service-name]-mcp-server",
  "version": "1.0.0",
  "description": "MCP Server for [Service]",
  "main": "index.js",
  "bin": {
    "[service]-mcp": "./index.js"
  }
}
```

3. **Create `index.js`:**
```javascript
#!/usr/bin/env node

const tools = {
  tool_name: {
    description: 'What this tool does',
    parameters: {
      type: 'object',
      properties: {
        param1: {
          type: 'string',
          description: 'Description'
        }
      },
      required: ['param1']
    }
  }
};

// Implement tool logic
async function handleToolCall(toolName, parameters) {
  // ... implementation
}

// MCP protocol handler
// ... (see existing servers for template)
```

4. **Make executable:**
```bash
chmod +x index.js
```

5. **Test:**
```bash
API_KEY=... node index.js
```

---

## Testing MCP Servers

### Manual Testing with stdio

```bash
# Start server
STRIPE_SECRET_KEY=sk_test_... node mcp-servers/stripe/index.js

# Send tool list request (in another terminal)
echo '{"method":"tools/list"}' | STRIPE_SECRET_KEY=sk_test_... node mcp-servers/stripe/index.js

# Send tool call request
echo '{"method":"tools/call","params":{"name":"get_customer","arguments":{"email":"test@example.com"}}}' | STRIPE_SECRET_KEY=sk_test_... node mcp-servers/stripe/index.js
```

### Integration Testing

Create `test.js` in each server directory:
```javascript
const { spawn } = require('child_process');

const server = spawn('node', ['index.js'], {
  env: { ...process.env, STRIPE_SECRET_KEY: 'sk_test_...' }
});

server.stdin.write(JSON.stringify({
  method: 'tools/call',
  params: {
    name: 'get_customer',
    arguments: { email: 'test@example.com' }
  }
}) + '\n');

server.stdout.on('data', (data) => {
  console.log('Response:', data.toString());
  server.kill();
});
```

Run: `node test.js`

---

## Deployment

### Production Environment Variables

Set in Vercel (or wherever backend runs):
```bash
STRIPE_SECRET_KEY=sk_live_...
RESEND_API_KEY=re_...
```

### Claude Code Configuration

Update `~/.config/claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "stripe": {
      "command": "node",
      "args": ["/Users/ericcoffie/Linkedin App/mcp-servers/stripe/index.js"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_live_..."
      }
    },
    "resend": {
      "command": "node",
      "args": ["/Users/ericcoffie/Linkedin App/mcp-servers/resend/index.js"],
      "env": {
        "RESEND_API_KEY": "re_..."
      }
    }
  }
}
```

---

## Troubleshooting

### "Command not found"
- Ensure `chmod +x index.js` has been run
- Check shebang line: `#!/usr/bin/env node`

### "API key invalid"
- Verify environment variable is set
- Check for typos in variable name
- Ensure test vs live key matches environment

### "Tool not found"
- Check tool name matches exactly (case-sensitive)
- Verify tool is listed in `tools` object
- Check `handleToolCall` switch statement includes tool

### "No response from server"
- Check server started without errors
- Verify stdio protocol format (newline-delimited JSON)
- Check for console.log interference (use console.error for debugging)

---

**Last Updated:** March 19, 2026
