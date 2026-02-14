# x402 Meta Gateway

> AI-synthesized intelligence from 10+ sources. Pay per query with USDC.

x402 Meta Gateway delivers AI-powered market intelligence through eight endpoints — token analysis, trending detection, X/Twitter sentiment, neural search, deep research, prediction markets, macro economics, and news aggregation — all accessible via USDC micropayments. No API keys. No subscriptions. Just pay and receive.

Available via **REST** (`GET /alpha/*`) and **MCP** (`POST /mcp`). Same tools, same pricing.

## Supported Payment Chains

### REST API (`GET /alpha/*`)

| Chain | Status | Payment Method | USDC Contract | Receiver |
|---|---|---|---|---|
| **Base** | Live | EIP-712 `signTypedData` | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | `0xd86F1F35d6B15fEBef2f4a4390b584D8a7deC0B6` |
| **Ethereum** | Live | EIP-712 `signTypedData` | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` | `0xd86F1F35d6B15fEBef2f4a4390b584D8a7deC0B6` |
| **Solana** | Live | Solana `signTransaction` | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` | `CtbPTTFMRfULUMz7DjPDRCKXVSBEcAEXeTUq4n7fSFuf` |

### MCP Server (`POST /mcp`)

| Chain | Status | Notes |
|---|---|---|
| **Base** | Live | Full support — CDP facilitator verification + settlement |
| **Solana** | Live (limited) | Payment requirements returned. CDP facilitator does not yet verify SVM transactions — on-chain transfers succeed but server-side verification fails. |
| **Ethereum** | Not available | x402 SDK v1.0 does not include Ethereum mainnet in its network mappings (`processPriceToAtomicAmount`). Use Base (same addresses, lower fees) for EVM payments via MCP. |

> **Why the difference?** REST endpoints handle payment verification directly via the Coinbase CDP facilitator, which supports all three chains. The MCP server builds payment requirements using the x402 SDK's `processPriceToAtomicAmount`, which has a more limited set of supported networks in v1.0. These are SDK/CDP limitations, not protocol limitations — support will expand as the SDK matures.

### Signing Requirements by Chain

**Base (EVM):**
- Uses EIP-712 `TransferWithAuthorization` (USDC permit-style)
- Sign with `signTypedData` via viem, ethers, or any EVM wallet
- Works with: `@x402/fetch`, `@x402/axios`, Circle Programmable Wallets, MetaMask
- Confirmation: ~2-3 seconds

**Ethereum (EVM):**
- Same signing method as Base (EIP-712 `signTypedData`)
- Same tooling: `@x402/fetch`, `@x402/axios`, viem, ethers
- Higher gas fees than Base — Base recommended for cost efficiency
- REST API only (MCP pending SDK support)

**Solana (SVM):**
- Uses SPL token transfer instruction signed as a Solana transaction
- Sign with `signTransaction` via `@solana/web3.js` or Solana wallet adapter
- Requires a fee payer with SOL for transaction fees (server provides `extra.feePayer`)
- Works with: local Solana keypairs, Phantom, Solflare
- Note: Circle Programmable Wallets' `signMessage` does NOT work — you need full transaction signing
- Confirmation: ~400ms

## Endpoints

| Endpoint | Price | What You Get |
|---|---|---|
| `/alpha/token` | $0.05 USDC | Price, volume, market cap + X/Twitter engagement data + AI trading signals |
| `/alpha/trending` | $0.05 USDC | Top trending tokens + X/Twitter analysis + AI narrative detection |
| `/alpha/sentiment` | $0.08 USDC | 99 tweets analyzed with full engagement metrics (likes, views, retweets, followers) + bull/bear scoring |
| `/alpha/search` | $0.05 USDC | Neural search via Exa + X/Twitter + AI summary with sources |
| `/alpha/deep` | $0.15 USDC | Full research: Exa + Firecrawl + Claude + 99 tweets with engagement data |
| `/alpha/prediction` | $0.05 USDC | Prediction market intelligence from Polymarket + Kalshi with AI synthesis |
| `/alpha/macro` | $0.08 USDC | Macro economic data from FRED + prediction markets with AI synthesis |
| `/alpha/news` | $0.03 USDC | AI-filtered crypto news from CoinTelegraph, Decrypt, CoinDesk, Blockworks + X |

X/Twitter engagement data (likes, views, retweets, followers, verified status) is included free on all endpoints.

---

## MCP Server

The MCP server exposes all AI Intelligence tools via [Model Context Protocol](https://modelcontextprotocol.io) over Streamable HTTP. AI agents can discover and call tools using standard MCP JSON-RPC, with x402 USDC payments on **Base or Solana**.

**Endpoint:** `POST https://x402.911fund.io/mcp`

### MCP Tools

| Tool | Price | Description |
|---|---|---|
| `alpha_token` | $0.05 | Token analysis with price, volume, X/Twitter engagement data, and AI signals. |
| `alpha_trending` | $0.05 | Trending tokens and narratives with X/Twitter analysis. |
| `alpha_sentiment` | $0.08 | 99 tweets with full engagement metrics + bull/bear scoring. |
| `alpha_search` | $0.05 | Neural search via Exa + X/Twitter + AI summary. |
| `alpha_deep` | $0.15 | Deep research: Exa + Firecrawl + Claude + 99 tweets. Up to 60s. |
| `alpha_prediction` | $0.05 | Prediction market odds from Polymarket + Kalshi with AI synthesis. |
| `alpha_macro` | $0.08 | Macro economic intelligence from FRED + prediction markets. |
| `alpha_news` | $0.03 | Crypto news from major publications + Twitter with AI synthesis. |
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
- **Payment chains:** Base (USDC), Solana (USDC). Ethereum pending x402 SDK support.
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

// Token analysis -- $0.05
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

X/Twitter engagement data included automatically.

### GET /alpha/trending -- Market Movers

| Param | Required | Description |
|---|---|---|
| `category` | No | Filter by category |
| `limit` | No | Number of results |

X/Twitter analysis included automatically.

### GET /alpha/sentiment -- X/Twitter Analysis

| Param | Required | Description |
|---|---|---|
| `query` | Yes* | Search query -- cashtag (`$WIF`), topic, or account |
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

### GET /alpha/prediction -- Prediction Markets

| Param | Required | Description |
|---|---|---|
| `query` | Yes | Prediction query (e.g., `fed chair`, `trump tariff`, `bitcoin 150k`, `recession`, `election`) |
| `category` | No | Filter: `crypto`, `politics`, `economics`, `sports`, `other` |

Sources: Polymarket, Kalshi. AI synthesis via Grok.

### GET /alpha/macro -- Macro Economics

| Param | Required | Description |
|---|---|---|
| `theme` | No | Macro theme (e.g., `inflation`, `employment`, `rates`). Defaults to broad overview. |

Sources: FRED (Federal Reserve Economic Data), Polymarket, Kalshi. AI synthesis via Grok.

### GET /alpha/news -- Crypto News

| Param | Required | Description |
|---|---|---|
| `query` | No | Search keyword (e.g., `bitcoin`, `ETF`, `regulation`, `solana`) |
| `category` | No | Filter by source: `coindesk`, `cointelegraph`, `decrypt`, `blockworks` |

Sources: CoinTelegraph, Decrypt, CoinDesk, Blockworks (via RSS), X/Twitter. AI synthesis via Grok.

---

## How x402 Payment Works

### 1. Request Without Payment

```
GET /alpha/token?symbol=SOL  ->  HTTP 402 Payment Required
```

The 402 response includes payment options for each supported chain.

### 2. Sign Payment

- **Base:** EIP-712 `TransferWithAuthorization` via `signTypedData`
- **Ethereum:** Same as Base (EIP-712 `signTypedData`)
- **Solana:** SPL token transfer instruction via `signTransaction`

### 3. Retry With Payment Proof

```
GET /alpha/token?symbol=SOL
X-PAYMENT: <payment_proof>
```

The `@x402/fetch` SDK handles steps 1-3 automatically for EVM chains (Base, Ethereum).

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
| **REST Chains** | Base, Ethereum, Solana |
| **MCP Chains** | Base, Solana (Ethereum pending SDK support) |
| **Token** | USDC |
| **Protocol** | x402 (HTTP 402 Payment Required) |
| **Facilitator** | Coinbase CDP |
| **Settlement** | Direct to wallet |
| **Rate Limit** | 30 requests/minute per IP |

## Known CDP/SDK Limitations

These are limitations of the current Coinbase CDP facilitator and x402 SDK (v1.0), not protocol limitations:

- **MCP + Ethereum:** The x402 SDK's `processPriceToAtomicAmount` does not include Ethereum mainnet in its network mappings. Use Base for EVM payments via MCP (same wallet address, lower fees). REST API supports Ethereum normally.
- **MCP + Solana verification:** The CDP facilitator does not yet verify SVM (Solana) transactions. On-chain USDC transfers succeed, but server-side `verify()` returns `invalid_payload`. Base verification works correctly.
- **Solana + Circle Wallets:** Circle Programmable Wallets' `signMessage` does not produce valid Solana x402 payments. Use `signTransaction` via `@solana/web3.js` or a Solana wallet adapter instead.

These limitations will resolve as the SDK and CDP facilitator add broader chain support.

## Machine-Readable Discovery

Three auto-discovery endpoints for AI clients and tooling:

```
GET https://x402.911fund.io/.well-known/x402.json          # x402 payment discovery
GET https://x402.911fund.io/.well-known/mcp                 # MCP manifest (SEP-1960)
GET https://x402.911fund.io/.well-known/mcp/server-card.json # MCP server card (SEP-1649)
```

The **MCP manifest** lets AI clients auto-detect the MCP endpoint, transport, and payment requirements. The **server card** provides tool listings and server metadata per the MCP specification.

## Stats & Health

```
GET https://x402.911fund.io/health
GET https://x402.911fund.io/stats
```

## Links

- **API:** https://x402.911fund.io
- **x402scan Server:** https://www.x402scan.com/server/6b9891e8-6939-4c9c-842f-9658f99cb6f3
- **AI Agent (Chat):** https://www.x402scan.com/composer/agent/f0808374-e57c-4192-87f0-390dd7758953/chat
- **Docs:** https://github.com/the911fund/x402-docs
- **x402 Protocol:** https://x402.org
- **x402 Coinbase Docs:** https://docs.cdp.coinbase.com/x402
- **@x402/fetch SDK:** https://github.com/coinbase/x402

## Built by

[911Fund Studio](https://911fund.io) -- Building autonomous AI agent infrastructure.

## License

MIT
