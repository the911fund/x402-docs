/**
 * Alpha Research API — Trading Decision Loop
 *
 * REFERENCE PATTERN — Not runnable out-of-box.
 * See basic-fetch.ts for a runnable example.
 *
 * This pattern shows how an AI agent can chain multiple endpoints
 * to make informed trading decisions.
 *
 * Cost per cycle: $0.25 base ($0.35 with twitter addons)
 *   - trending: $0.02
 *   - sentiment: $0.08
 *   - deep research: $0.15
 */

import { createX402Fetch } from "@x402/fetch";
import type { WalletClient } from "viem";

const API_URL = "https://x402.911fund.io";

interface TradingDecision {
  symbol: string;
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string;
}

async function analyzeMarket(x402Fetch: ReturnType<typeof createX402Fetch>): Promise<TradingDecision[]> {
  const decisions: TradingDecision[] = [];

  // Step 1: Get trending tokens ($0.02)
  const trendingRes = await x402Fetch(`${API_URL}/alpha/trending?twitter=true`);
  const trending = await trendingRes.json();

  // Step 2: For top movers, get sentiment ($0.08 each)
  const topMovers = trending.data.coingecko.slice(0, 3);

  for (const token of topMovers) {
    const sentimentRes = await x402Fetch(
      `${API_URL}/alpha/sentiment?query=${encodeURIComponent("$" + token.symbol)}`
    );
    const sentiment = await sentimentRes.json();

    // Step 3: If sentiment is strong, run deep research ($0.15)
    const sentimentText = sentiment.data.sentimentAnalysis.toLowerCase();
    const isBullish = sentimentText.includes("bullish");
    const isBearish = sentimentText.includes("bearish");

    if (isBullish || isBearish) {
      const deepRes = await x402Fetch(
        `${API_URL}/alpha/deep?query=${encodeURIComponent(token.symbol + " investment thesis 2026")}`
      );
      const deep = await deepRes.json();

      decisions.push({
        symbol: token.symbol,
        action: isBullish ? "BUY" : "SELL",
        confidence: isBullish ? 0.7 : 0.6,
        reasoning: `Sentiment: ${sentiment.data.sentimentAnalysis.slice(0, 100)}... | Deep: ${JSON.stringify(deep.data).slice(0, 200)}...`,
      });
    } else {
      decisions.push({
        symbol: token.symbol,
        action: "HOLD",
        confidence: 0.5,
        reasoning: "Mixed sentiment — insufficient conviction",
      });
    }
  }

  return decisions;
}

// Example: Run every 5 minutes
async function tradingLoop(walletClient: WalletClient) {
  const x402Fetch = createX402Fetch(walletClient);

  while (true) {
    try {
      const decisions = await analyzeMarket(x402Fetch);

      for (const decision of decisions) {
        console.log(`${decision.symbol}: ${decision.action} (${Math.round(decision.confidence * 100)}%)`);
        console.log(`  ${decision.reasoning}\n`);

        // Execute trade logic here...
      }
    } catch (error) {
      console.error("Analysis cycle failed:", error);
    }

    // Wait 5 minutes before next cycle
    await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000));
  }
}
