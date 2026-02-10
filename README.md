# Alpha Research API

> Trading intelligence for AI agents. Pay-per-use via x402 micropayments.

Alpha Research API delivers AI-powered market intelligence through five endpoints — token analysis, trending detection, X/Twitter sentiment, neural search, and deep research — all accessible via USDC micropayments. No API keys. No subscriptions. Just pay and receive.

Available via **REST** (`GET /alpha/*`) and **MCP** (`POST /mcp`). Same tools, same pricing.

## Supported Payment Chains

| Chain | Status | Payment Method | USDC Contract | Receiver |
|---|---|---|---|---|
| **Base** | Live | EIP-712 `signTypedData` | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | `0xd86F1F35d6B15fEBef2f4a4390b584D8a7deC0B6` |
| **Solana** | Live | Solana `signTransaction` | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` | `CtbPTTFMRfULUMz7DjPDRCKXVSBEcAEXeTUq4n7fSFuf` |
| **Ethereum** | Not supported | -- | -- | -- |

> **Note:** Ethereum mainnet is not in the x402 SDK's supported network list as of v1.0. Use Base (same addresses, lower fees) or Solana.

### Signing Requirements by Chain

**Base (EVM):**
- Uses EIP-712 `TransferWithAuthorization` (USDC permit-style)
- Sign with `signTypedData` via viem, ethers, or any EVM wallet
- Works with: `@x402/fetch`, `@x402/axios`, Circle Programmable Wallets, MetaMask
- Confirmation: ~2-3 seconds

**Solana (SVM):**
- Uses SPL token transfer instruction signed as a Solana transaction
- Sign with `signTransaction` via `@solana/web3.js` or Solana wallet adapter
- Requires a fee payer with SOL for transaction fees (server provides `extra.feePayer`)
- Works with: local Solana keypairs, Phantom, Solflare
- Note: Circle Programmable Wallets' `signMessage` does NOT work -- you need full transaction signing
- Confirmation: ~400ms

## Endpoints

| Endpoint | Price | What You Get |
|---|---|---|
| `/alpha/token` | $0.02 USDC | Price, volume, market cap + AI trading signals for any token |
| `/alpha/trending` | $0.02 USDC | Top trending tokens + AI narrative detection |
| `/alpha/sentiment` | $0.08 USDC | X/Twitter sentiment analysis (10 tweets) with bull/bear scoring |
| `/alpha/search` | $0.03 USDC | Neural search via Exa + AI summary with sources |
| `/alpha/deep` | $0.15 USDC | Full research: Exa + Firecrawl + Claude + X sentiment combined |

**Optional add-on:** Append `?twitter=true` to `/alpha/token` or `/alpha/trending` for X/Twitter data (+$0.05 USDC).

---

## MCP Server

The MCP server exposes all Alpha Research tools via [Model Context Protocol](https://modelcontextprotocol.io) over Streamable HTTP. AI agents can discover and call tools using standard MCP JSON-RPC, with x402 USDC payments on **Base or Solana**.

**Endpoint:** `POST https://x402.911fund.io/mcp`

### MCP Tools

| Tool | Price | Description |
|---|---|---|
| `alpha_token` | $0.02 | Token analysis with price, volume, AI signals. `twitter: true` adds X data (+$0.05). |
| `alpha_trending` | $0.02 | Trending tokens and narratives. `twitter: true` adds X data (+$0.05). |
| `alpha_sentiment` | $0.08 | X/Twitter sentiment with bull/bear scoring. |
| `alpha_search` | $0.03 | Neural search via Exa + AI summary. |
| `alpha_deep` | $0.15 | Deep research: Exa + Firecrawl + Claude + X. Up to 60s. |
| `alpha_stats` | Free | Gateway stats (uptime, memory, rate limits). |

### MCP Quick Start

**1. Initialize the connection (free):**

```bash
curl -X POST https://x402.911fund.io/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}},"id":1}'
```

**2. List available tools (free):**

```bash
curl -X POST https://x402.911fund.io/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":2}'
```

**3. Call a free tool:**

```bash
curl -X POST https://x402.911fund.io/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"alpha_stats","arguments":{}},"id":3}'
```

**4. Call a paid tool (requires X-PAYMENT header):**

Without payment, you get HTTP 402 with payment requirements for both Base and Solana:

```bash
curl -X POST https://x402.911fund.io/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"alpha_token","arguments":{"symbol":"SOL"}},"id":4}'
```

With payment:

```bash
curl -X POST https://x402.911fund.io/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "X-PAYMENT: <signed_payment>" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"alpha_token","arguments":{"symbol":"SOL"}},"id":4}'
```

### MCP with TypeScript (Base)

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const transport = new StreamableHTTPClientTransport(
  new URL("https://x402.911fund.io/mcp")
);

const client = new Client({ name: "my-agent", version: "1.0.0" });
await client.connect(transport);

// Discover tools (free)
const { tools } = await client.listTools();
console.log(tools.map(t => `${t.name}: ${t.description}`));

// Call free tool
const stats = await client.callTool({ name: "alpha_stats", arguments: {} });
console.log(stats);
```

For paid tools, the `X-PAYMENT` header must contain a signed payment payload. The agent chooses which chain to pay on:

- **Base:** EIP-712 `TransferWithAuthorization` -- use `@x402/fetch` or viem `signTypedData`
- **Solana:** Signed SPL transfer transaction -- use `@solana/web3.js` `signTransaction`

### Agent Configuration

```json
{
  "mcpServers": {
    "x402-alpha": {
      "url": "https://x402.911fund.io/mcp",
      "transport": "streamable-http"
    }
  }
}
```

### MCP Technical Details

- **Transport:** Streamable HTTP (POST, not SSE/WebSocket)
- **Protocol:** JSON-RPC 2.0 over HTTP
- **Required headers:** `Content-Type: application/json`, `Accept: application/json, text/event-stream`
- **Payment header:** `X-PAYMENT` (Base: EIP-712 signed, Solana: signed transaction)
- **Payment chains:** Base (USDC), Solana (USDC)
- **Stateless:** No sessions. Each request is independent.
- **Response format:** SSE (`event: message\ndata: {json}`)

---

## REST Quick Start

### Using curl (manual x402 flow)

```bash
# Step 1: Hit the endpoint -- you get a 402 with payment details
curl -i https://x402.911fund.io/alpha/token?symbol=SOL

# Step 2: Sign payment with your wallet, then retry with payment header
curl -H "X-PAYMENT: <signed_payment_payload>" \
  https://x402.911fund.io/alpha/token?symbol=SOL
```

### Using @x402/fetch (recommended for TypeScript)

```typescript
import { createX402Fetch } from "@x402/fetch";
import { createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});

const x402Fetch = createX402Fetch(walletClient);

// Token analysis -- $0.02
const res = await x402Fetch("https://x402.911fund.io/alpha/token?symbol=SOL");
const data = await res.json();
console.log(data);
```

## Endpoint Details

### GET /alpha/token -- Token Analysis

| Param | Required | Description |
|---|---|---|
| `symbol` | Yes* | Token symbol (e.g., `SOL`, `ETH`, `WIF`) |
| `address` | Yes* | Contract address (alternative to symbol) |
| `token` | Yes* | Alias for `address` or `symbol` |
| `chain` | No | Chain for lookup (default: `base`) |
| `twitter` | No | Add X/Twitter sentiment data (+$0.05 USDC) |

### GET /alpha/trending -- Market Movers

| Param | Required | Description |
|---|---|---|
| `category` | No | Filter by category |
| `limit` | No | Number of results |
| `twitter` | No | Add X/Twitter mentions (+$0.05 USDC) |

### GET /alpha/sentiment -- X/Twitter Analysis

| Param | Required | Description |
|---|---|---|
| `query` | Yes* | Search term -- cashtag (`$WIF`), topic, or account |
| `topic` | Yes* | Alias for `query` |
| `token` | Yes* | Alias for `query` |

### GET /alpha/search -- Quick Research

| Param | Required | Description |
|---|---|---|
| `query` | Yes* | Research query (e.g., `Jupiter DEX Solana`) |
| `q` | Yes* | Alias for `query` |

### GET /alpha/deep -- Full Research Suite

| Param | Required | Description |
|---|---|---|
| `query` | Yes* | Research question |
| `topic` | Yes* | Alias for `query` |
| `token` | Yes* | Alias for `query` |
| `url` | Yes* | Specific URL to research |

---

## How x402 Payment Works

### 1. Request Without Payment

```
GET /alpha/token?symbol=SOL  ->  HTTP 402 Payment Required
```

The 402 response includes payment options for each supported chain.

### 2. Sign Payment

- **Base:** EIP-712 `TransferWithAuthorization` via `signTypedData`
- **Solana:** SPL token transfer instruction via `signTransaction`

### 3. Retry With Payment Proof

```
GET /alpha/token?symbol=SOL
X-PAYMENT: <payment_proof>
```

The `@x402/fetch` SDK handles steps 1-3 automatically for Base.

---

## Error Reference

| Status | Meaning | Action |
|---|---|---|
| `402` | Payment required | Follow the payment flow above |
| `400` | Bad request | Check required parameters |
| `429` | Rate limited (30 req/min) | Wait and retry |
| `500` | Upstream service error | Retry after a brief delay |

## Network & Payment Info

| Detail | Value |
|---|---|
| **Chains** | Base, Solana |
| **Token** | USDC |
| **Protocol** | x402 (HTTP 402 Payment Required) |
| **Facilitator** | Coinbase CDP |
| **Settlement** | Direct to wallet |
| **Rate Limit** | 30 requests/minute per IP |

## Machine-Readable Discovery

```
GET https://x402.911fund.io/.well-known/x402.json
```

## Stats & Health

```
GET https://x402.911fund.io/health
GET https://x402.911fund.io/stats
```

## Links

- **API:** https://x402.911fund.io
- **Docs:** https://github.com/the911fund/x402-docs
- **x402 Protocol:** https://x402.org
- **x402 Coinbase Docs:** https://docs.cdp.coinbase.com/x402
- **@x402/fetch SDK:** https://github.com/coinbase/x402

## Built by

[911Fund Studio](https://911fund.io) -- Building autonomous AI agent infrastructure.

## License

MIT
