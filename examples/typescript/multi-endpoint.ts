/**
 * Alpha Research API — Multi-Endpoint Chaining
 *
 * REFERENCE PATTERN — Not runnable out-of-box.
 * See basic-fetch.ts for a runnable example.
 *
 * Shows how to call multiple endpoints in parallel using Promise.all.
 *
 * Cost: $0.13 total ($0.02 + $0.03 + $0.08)
 */

import { createX402Fetch } from "@x402/fetch";

const API_URL = "https://x402.911fund.io";

interface TokenIntelligence {
  token: {
    price: number;
    volume24h: number;
    analysis: string;
  };
  research: {
    sources: number;
    summary: string;
  };
  sentiment: {
    tweetsAnalyzed: number;
    analysis: string;
  };
}

async function getFullIntelligence(
  x402Fetch: ReturnType<typeof createX402Fetch>,
  symbol: string
): Promise<TokenIntelligence> {
  // Run all three endpoints in parallel — $0.13 total
  const [tokenRes, searchRes, sentimentRes] = await Promise.all([
    x402Fetch(`${API_URL}/alpha/token?symbol=${symbol}`),
    x402Fetch(`${API_URL}/alpha/search?query=${encodeURIComponent(symbol + " crypto analysis")}`),
    x402Fetch(`${API_URL}/alpha/sentiment?query=${encodeURIComponent("$" + symbol)}`),
  ]);

  const [token, search, sentiment] = await Promise.all([
    tokenRes.json(),
    searchRes.json(),
    sentimentRes.json(),
  ]);

  return {
    token: {
      price: token.data.coingecko?.price ?? token.data.dexscreener?.price,
      volume24h: token.data.coingecko?.volume24h ?? token.data.dexscreener?.volume24h,
      analysis: token.data.grokAnalysis,
    },
    research: {
      sources: search.data.exa.resultsFound,
      summary: search.data.summary,
    },
    sentiment: {
      tweetsAnalyzed: sentiment.data.tweetsAnalyzed,
      analysis: sentiment.data.sentimentAnalysis,
    },
  };
}

// Usage:
// const intel = await getFullIntelligence(x402Fetch, "SOL");
// console.log(intel);
