#!/usr/bin/env node

/**
 * Resend MCP Server
 *
 * Tools for interacting with Resend email API:
 * - send_email
 * - send_template_email
 * - add_to_audience
 * - remove_from_audience
 * - check_email_status
 */

const https = require('https');

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.error('Error: RESEND_API_KEY environment variable not set');
  process.exit(1);
}

// MCP Server Tools
const tools = {
  send_email: {
    description: 'Send a transactional email via Resend',
    parameters: {
      type: 'object',
      properties: {
        from: {
          type: 'string',
          description: 'Sender email (e.g., hello@linkedindealmagnet.com)'
        },
        to: {
          type: 'string',
          description: 'Recipient email address'
        },
        subject: {
          type: 'string',
          description: 'Email subject line'
        },
        html: {
          type: 'string',
          description: 'Email HTML content'
        },
        text: {
          type: 'string',
          description: 'Email plain text content (optional)'
        },
        replyTo: {
          type: 'string',
          description: 'Reply-to email address (optional)'
        },
        attachments: {
          type: 'array',
          description: 'Array of attachment objects (optional)',
          items: {
            type: 'object',
            properties: {
              filename: { type: 'string' },
              content: { type: 'string', description: 'Base64 encoded content' }
            }
          }
        }
      },
      required: ['from', 'to', 'subject', 'html']
    }
  },

  send_batch_emails: {
    description: 'Send multiple emails in a single batch',
    parameters: {
      type: 'object',
      properties: {
        emails: {
          type: 'array',
          description: 'Array of email objects',
          items: {
            type: 'object',
            properties: {
              from: { type: 'string' },
              to: { type: 'string' },
              subject: { type: 'string' },
              html: { type: 'string' }
            }
          }
        }
      },
      required: ['emails']
    }
  },

  add_to_audience: {
    description: 'Add contact to email audience/list',
    parameters: {
      type: 'object',
      properties: {
        audienceId: {
          type: 'string',
          description: 'Resend audience ID'
        },
        email: {
          type: 'string',
          description: 'Contact email address'
        },
        firstName: {
          type: 'string',
          description: 'Contact first name (optional)'
        },
        lastName: {
          type: 'string',
          description: 'Contact last name (optional)'
        },
        unsubscribed: {
          type: 'boolean',
          description: 'Whether contact is unsubscribed',
          default: false
        }
      },
      required: ['audienceId', 'email']
    }
  },

  remove_from_audience: {
    description: 'Remove contact from email audience',
    parameters: {
      type: 'object',
      properties: {
        audienceId: {
          type: 'string',
          description: 'Resend audience ID'
        },
        email: {
          type: 'string',
          description: 'Contact email address'
        }
      },
      required: ['audienceId', 'email']
    }
  },

  check_email_status: {
    description: 'Check delivery status of a sent email',
    parameters: {
      type: 'object',
      properties: {
        emailId: {
          type: 'string',
          description: 'Resend email ID returned from send_email'
        }
      },
      required: ['emailId']
    }
  }
};

// HTTP request helper
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(response.message || `HTTP ${res.statusCode}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Tool implementations
async function sendEmail({ from, to, subject, html, text, replyTo, attachments }) {
  try {
    const emailData = {
      from,
      to,
      subject,
      html
    };

    if (text) emailData.text = text;
    if (replyTo) emailData.reply_to = replyTo;
    if (attachments) emailData.attachments = attachments;

    const result = await makeRequest('POST', '/emails', emailData);

    return {
      success: true,
      emailId: result.id,
      message: 'Email sent successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function sendBatchEmails({ emails }) {
  try {
    const results = await Promise.all(
      emails.map(email => sendEmail(email))
    );

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return {
      success: true,
      sent: successful,
      failed: failed,
      results: results
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function addToAudience({ audienceId, email, firstName, lastName, unsubscribed = false }) {
  try {
    const contactData = {
      email,
      unsubscribed
    };

    if (firstName) contactData.first_name = firstName;
    if (lastName) contactData.last_name = lastName;

    const result = await makeRequest('POST', `/audiences/${audienceId}/contacts`, contactData);

    return {
      success: true,
      contactId: result.id,
      message: 'Contact added to audience'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function removeFromAudience({ audienceId, email }) {
  try {
    await makeRequest('DELETE', `/audiences/${audienceId}/contacts/${email}`);

    return {
      success: true,
      message: 'Contact removed from audience'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function checkEmailStatus({ emailId }) {
  try {
    const result = await makeRequest('GET', `/emails/${emailId}`);

    return {
      success: true,
      status: result.last_event,
      created: result.created_at,
      from: result.from,
      to: result.to,
      subject: result.subject
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// MCP Server Implementation
async function handleToolCall(toolName, parameters) {
  switch (toolName) {
    case 'send_email':
      return await sendEmail(parameters);
    case 'send_batch_emails':
      return await sendBatchEmails(parameters);
    case 'add_to_audience':
      return await addToAudience(parameters);
    case 'remove_from_audience':
      return await removeFromAudience(parameters);
    case 'check_email_status':
      return await checkEmailStatus(parameters);
    default:
      return {
        success: false,
        error: `Unknown tool: ${toolName}`
      };
  }
}

// MCP Server Protocol
process.stdin.setEncoding('utf8');

let buffer = '';

process.stdin.on('data', async (chunk) => {
  buffer += chunk;

  let newlineIndex;
  while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, newlineIndex);
    buffer = buffer.slice(newlineIndex + 1);

    if (line.trim() === '') continue;

    try {
      const request = JSON.parse(line);

      if (request.method === 'tools/list') {
        process.stdout.write(JSON.stringify({
          tools: Object.entries(tools).map(([name, def]) => ({
            name,
            description: def.description,
            inputSchema: def.parameters
          }))
        }) + '\n');
      } else if (request.method === 'tools/call') {
        const { name, arguments: params } = request.params;
        const result = await handleToolCall(name, params);
        process.stdout.write(JSON.stringify({
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        }) + '\n');
      }
    } catch (error) {
      process.stderr.write(`Error: ${error.message}\n`);
    }
  }
});

console.error('Resend MCP Server started');
