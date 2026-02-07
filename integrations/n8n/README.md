# n8n Workflow — Alpha Research

Import the included workflow to add Alpha Research API calls to your n8n automations.

## Import

1. Open your n8n instance
2. Go to **Workflows** > **Import from File**
3. Select `workflow.json`

## Configuration

The workflow uses HTTP Request nodes. For paid endpoints, you need to:

1. Make a USDC payment on Base to the receiver address
2. Include the payment proof in the `X-PAYMENT` header

For testing, the workflow includes free endpoint calls (`/health`, `/.well-known/x402.json`) that work without payment.

## Workflow Overview

The included workflow demonstrates:
1. Health check (free)
2. Token analysis request (shows 402 payment flow)
3. Trending tokens request

## Compatibility

Tested with n8n v1.x. Uses standard HTTP Request nodes — no custom nodes required.

## API Reference

See the [main documentation](../../README.md) for full endpoint details.
