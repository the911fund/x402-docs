/**
 * Alpha Research API — Basic TypeScript Example
 *
 * RUNNABLE: Install deps and run with `npx tsx basic-fetch.ts`
 * Requires: USDC balance on Base in the wallet specified by PRIVATE_KEY
 */

import "dotenv/config";
import { createX402Fetch } from "@x402/fetch";
import { createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const API_URL = "https://x402.911fund.io";

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});

const x402Fetch = createX402Fetch(walletClient);

async function main() {
  // Token analysis — $0.02 USDC
  console.log("Fetching token analysis for SOL...");
  const tokenRes = await x402Fetch(`${API_URL}/alpha/token?symbol=SOL`);
  const tokenData = await tokenRes.json();
  console.log("Token:", JSON.stringify(tokenData, null, 2));

  // Trending tokens — $0.02 USDC
  console.log("\nFetching trending tokens...");
  const trendingRes = await x402Fetch(`${API_URL}/alpha/trending`);
  const trendingData = await trendingRes.json();
  console.log("Trending:", JSON.stringify(trendingData, null, 2));

  // Sentiment analysis — $0.08 USDC
  console.log("\nFetching sentiment for $WIF...");
  const sentimentRes = await x402Fetch(`${API_URL}/alpha/sentiment?query=$WIF`);
  const sentimentData = await sentimentRes.json();
  console.log("Sentiment:", JSON.stringify(sentimentData, null, 2));
}

main().catch(console.error);
