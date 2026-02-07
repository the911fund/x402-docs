/**
 * ElizaOS Plugin — Alpha Research API
 *
 * Adds trading intelligence actions to your ElizaOS agent.
 * Requires: @x402/fetch, viem, USDC balance on Base
 */

import { createX402Fetch } from "@x402/fetch";

const API_URL = "https://x402.911fund.io";

function extractSymbol(text: string): string {
  const match = text.match(/\$([A-Z]+)/i) || text.match(/\b(SOL|ETH|BTC|WIF|PEPE|VIRTUAL|DOGE)\b/i);
  return match ? match[1].toUpperCase() : "BTC";
}

function extractQuery(text: string): string {
  return text.replace(/^(research|search|analyze|look up|find)\s+/i, "").trim();
}

const tokenAnalysisAction = {
  name: "ALPHA_TOKEN_ANALYSIS",
  description: "Get AI-powered token analysis with trading signals ($0.02 USDC)",
  examples: [
    [{ user: "user1", content: { text: "analyze SOL for me" } }],
    [{ user: "user1", content: { text: "what's the signal on $WIF?" } }],
    [{ user: "user1", content: { text: "check ETH price and analysis" } }],
  ],
  handler: async (runtime: any, message: any) => {
    const x402Fetch = createX402Fetch(runtime.walletClient);
    const symbol = extractSymbol(message.content.text);
    const res = await x402Fetch(`${API_URL}/alpha/token?symbol=${symbol}&twitter=true`);
    const data = await res.json();
    const analysis = data.data.grokAnalysis || "No analysis available";
    const price = data.data.coingecko?.price || data.data.dexscreener?.price || "unknown";
    return {
      text: `${symbol}: $${price}\n\n${analysis}`,
    };
  },
};

const trendingAction = {
  name: "ALPHA_TRENDING",
  description: "Get top trending tokens with AI narrative detection ($0.02 USDC)",
  examples: [
    [{ user: "user1", content: { text: "what's trending in crypto?" } }],
    [{ user: "user1", content: { text: "top movers today" } }],
  ],
  handler: async (runtime: any, message: any) => {
    const x402Fetch = createX402Fetch(runtime.walletClient);
    const res = await x402Fetch(`${API_URL}/alpha/trending?twitter=true`);
    const data = await res.json();
    const tokens = data.data.coingecko.slice(0, 5);
    const list = tokens.map((t: any) => `${t.symbol}: $${t.price} (${t.volumeChange > 0 ? "+" : ""}${t.volumeChange}% vol)`).join("\n");
    const narrative = data.data.narrativeSummary || "";
    return {
      text: `Top trending:\n${list}\n\n${narrative}`,
    };
  },
};

const sentimentAction = {
  name: "ALPHA_SENTIMENT",
  description: "Analyze X/Twitter sentiment for any token or topic ($0.08 USDC)",
  examples: [
    [{ user: "user1", content: { text: "what's the sentiment on $WIF?" } }],
    [{ user: "user1", content: { text: "what's Twitter saying about Solana?" } }],
  ],
  handler: async (runtime: any, message: any) => {
    const x402Fetch = createX402Fetch(runtime.walletClient);
    const query = extractQuery(message.content.text);
    const res = await x402Fetch(`${API_URL}/alpha/sentiment?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    return {
      text: `Sentiment for "${data.query}" (${data.data.tweetsAnalyzed} tweets):\n\n${data.data.sentimentAnalysis}`,
    };
  },
};

const searchAction = {
  name: "ALPHA_SEARCH",
  description: "Quick neural search with AI summary ($0.03 USDC)",
  examples: [
    [{ user: "user1", content: { text: "research Jupiter DEX" } }],
    [{ user: "user1", content: { text: "search for Eigenlayer restaking" } }],
  ],
  handler: async (runtime: any, message: any) => {
    const x402Fetch = createX402Fetch(runtime.walletClient);
    const query = extractQuery(message.content.text);
    const res = await x402Fetch(`${API_URL}/alpha/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    const sources = data.data.exa.results.slice(0, 3).map((r: any) => `- ${r.title}: ${r.url}`).join("\n");
    return {
      text: `${data.data.summary}\n\nSources:\n${sources}`,
    };
  },
};

const deepResearchAction = {
  name: "ALPHA_DEEP_RESEARCH",
  description: "Full multi-source research with Claude analysis ($0.15 USDC)",
  examples: [
    [{ user: "user1", content: { text: "deep dive on Farcaster" } }],
    [{ user: "user1", content: { text: "full research on Base L2 growth" } }],
  ],
  handler: async (runtime: any, message: any) => {
    const x402Fetch = createX402Fetch(runtime.walletClient);
    const query = extractQuery(message.content.text);
    const res = await x402Fetch(`${API_URL}/alpha/deep?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    const sources = data.sources.join(", ");
    return {
      text: `Deep research on "${data.query}" (sources: ${sources}):\n\n${JSON.stringify(data.data, null, 2).slice(0, 2000)}`,
    };
  },
};

const alphaResearchPlugin = {
  name: "alpha-research",
  description: "Trading intelligence via Alpha Research API (x402 micropayments)",
  actions: [
    tokenAnalysisAction,
    trendingAction,
    sentimentAction,
    searchAction,
    deepResearchAction,
  ],
};

export default alphaResearchPlugin;
