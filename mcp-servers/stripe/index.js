#!/usr/bin/env node

/**
 * Stripe MCP Server
 *
 * Tools for interacting with Stripe API:
 * - create_checkout_session
 * - verify_payment
 * - get_customer
 * - list_payments
 * - create_refund
 */

const Stripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('Error: STRIPE_SECRET_KEY environment variable not set');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

// MCP Server Tools
const tools = {
  create_checkout_session: {
    description: 'Create a Stripe checkout session for payment',
    parameters: {
      type: 'object',
      properties: {
        priceId: {
          type: 'string',
          description: 'Stripe price ID (e.g., price_1SedI3K5zyiZ50PBOx0luGnq)'
        },
        customerEmail: {
          type: 'string',
          description: 'Customer email address'
        },
        successUrl: {
          type: 'string',
          description: 'URL to redirect to after successful payment'
        },
        cancelUrl: {
          type: 'string',
          description: 'URL to redirect to if payment cancelled'
        },
        metadata: {
          type: 'object',
          description: 'Optional metadata to attach (e.g., auditId, userId)'
        }
      },
      required: ['priceId', 'customerEmail', 'successUrl', 'cancelUrl']
    }
  },

  verify_payment: {
    description: 'Verify if a payment was successful',
    parameters: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          description: 'Stripe checkout session ID'
        }
      },
      required: ['sessionId']
    }
  },

  get_customer: {
    description: 'Get customer details by email or ID',
    parameters: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Customer email address'
        },
        customerId: {
          type: 'string',
          description: 'Stripe customer ID (alternative to email)'
        }
      }
    }
  },

  list_payments: {
    description: 'List payments for a customer',
    parameters: {
      type: 'object',
      properties: {
        customerId: {
          type: 'string',
          description: 'Stripe customer ID'
        },
        email: {
          type: 'string',
          description: 'Customer email (alternative to customerId)'
        },
        limit: {
          type: 'number',
          description: 'Max number of payments to return',
          default: 10
        }
      }
    }
  },

  create_refund: {
    description: 'Create a refund for a payment',
    parameters: {
      type: 'object',
      properties: {
        paymentIntentId: {
          type: 'string',
          description: 'Stripe payment intent ID'
        },
        amount: {
          type: 'number',
          description: 'Amount to refund in cents (optional, full refund if not specified)'
        },
        reason: {
          type: 'string',
          enum: ['duplicate', 'fraudulent', 'requested_by_customer'],
          description: 'Reason for refund'
        }
      },
      required: ['paymentIntentId']
    }
  }
};

// Tool implementations
async function createCheckoutSession({ priceId, customerEmail, successUrl, cancelUrl, metadata = {} }) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata
    });

    return {
      success: true,
      sessionId: session.id,
      sessionUrl: session.url,
      paymentIntentId: session.payment_intent
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function verifyPayment({ sessionId }) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return {
      success: true,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details?.email,
      metadata: session.metadata
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function getCustomer({ email, customerId }) {
  try {
    if (customerId) {
      const customer = await stripe.customers.retrieve(customerId);
      return {
        success: true,
        customer: {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          created: customer.created
        }
      };
    }

    if (email) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      if (customers.data.length === 0) {
        return {
          success: false,
          error: 'Customer not found'
        };
      }

      const customer = customers.data[0];
      return {
        success: true,
        customer: {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          created: customer.created
        }
      };
    }

    return {
      success: false,
      error: 'Either email or customerId required'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function listPayments({ customerId, email, limit = 10 }) {
  try {
    // Get customer ID if email provided
    if (email && !customerId) {
      const customerResult = await getCustomer({ email });
      if (!customerResult.success) {
        return customerResult;
      }
      customerId = customerResult.customer.id;
    }

    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId,
      limit: limit
    });

    return {
      success: true,
      payments: paymentIntents.data.map(pi => ({
        id: pi.id,
        amount: pi.amount,
        currency: pi.currency,
        status: pi.status,
        created: pi.created,
        description: pi.description
      }))
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function createRefund({ paymentIntentId, amount, reason = 'requested_by_customer' }) {
  try {
    const refundParams = {
      payment_intent: paymentIntentId,
      reason: reason
    };

    if (amount) {
      refundParams.amount = amount;
    }

    const refund = await stripe.refunds.create(refundParams);

    return {
      success: true,
      refundId: refund.id,
      amount: refund.amount,
      status: refund.status
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
    case 'create_checkout_session':
      return await createCheckoutSession(parameters);
    case 'verify_payment':
      return await verifyPayment(parameters);
    case 'get_customer':
      return await getCustomer(parameters);
    case 'list_payments':
      return await listPayments(parameters);
    case 'create_refund':
      return await createRefund(parameters);
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

console.error('Stripe MCP Server started');
