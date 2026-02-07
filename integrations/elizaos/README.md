# ElizaOS Plugin — Alpha Research

Add AI-powered trading intelligence to your ElizaOS agent via x402 micropayments.

## Actions

| Action | Triggers | Cost |
|---|---|---|
| `ALPHA_TOKEN_ANALYSIS` | "analyze SOL", "what's the signal on $WIF?" | $0.02 |
| `ALPHA_TRENDING` | "what's trending?", "top movers" | $0.02 |
| `ALPHA_SENTIMENT` | "sentiment on $WIF", "what's Twitter saying about ETH?" | $0.08 |
| `ALPHA_SEARCH` | "research Jupiter DEX", "search for Eigenlayer" | $0.03 |
| `ALPHA_DEEP_RESEARCH` | "deep dive on Farcaster", "full research on Base L2" | $0.15 |

## Installation

Copy `plugin.ts` into your ElizaOS agent's plugin directory.

Your agent's wallet must have USDC on Base for payments.

## Configuration

The plugin uses `@x402/fetch` with your agent's wallet client. Set the wallet private key in your ElizaOS runtime configuration.

## Compatibility

Tested with ElizaOS v0.x. Plugin API may change across major versions.

## API Reference

See the [main documentation](../../README.md) for full endpoint details.
