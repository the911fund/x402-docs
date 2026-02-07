"""
Alpha Research API - Sentiment Monitor

REFERENCE PATTERN - Not runnable out-of-box.
See basic_request.py for a runnable example.

Continuously monitors sentiment for a watchlist of tokens.

Cost: $0.08 USDC per token per check
"""

import time
import json
import requests
from datetime import datetime

API_URL = "https://x402.911fund.io"

# Tokens to monitor
WATCHLIST = ["SOL", "ETH", "WIF", "VIRTUAL", "PEPE"]

# Alert thresholds
BULLISH_THRESHOLD = 7  # out of 10 tweets
BEARISH_THRESHOLD = 3


def check_sentiment(query: str, payment_proof: str) -> dict:
    """Check sentiment for a query. Returns parsed response."""
    headers = {"X-PAYMENT": payment_proof}
    response = requests.get(
        f"{API_URL}/alpha/sentiment",
        params={"query": f"${query}"},
        headers=headers,
    )
    response.raise_for_status()
    return response.json()


def monitor(payment_proof: str, interval_minutes: int = 15):
    """Monitor sentiment for watchlist tokens."""
    print(f"Monitoring {len(WATCHLIST)} tokens every {interval_minutes} minutes")
    print(f"Cost per cycle: ${len(WATCHLIST) * 0.08:.2f} USDC")
    print(f"Daily cost estimate: ${len(WATCHLIST) * 0.08 * (60 / interval_minutes) * 24:.2f} USDC")
    print("---")

    while True:
        timestamp = datetime.now().isoformat()

        for symbol in WATCHLIST:
            try:
                result = check_sentiment(symbol, payment_proof)
                data = result["data"]
                analysis = data["sentimentAnalysis"]

                # Simple alert logic
                bullish_count = analysis.lower().count("bullish")
                bearish_count = analysis.lower().count("bearish")

                status = "NEUTRAL"
                if bullish_count >= BULLISH_THRESHOLD:
                    status = "ALERT: BULLISH"
                elif bearish_count >= BEARISH_THRESHOLD:
                    status = "ALERT: BEARISH"

                print(f"[{timestamp}] ${symbol}: {status}")
                print(f"  Tweets: {data['tweetsAnalyzed']} | Likes: {data['totalLikes']} | RTs: {data['totalRetweets']}")
                print(f"  Analysis: {analysis[:120]}...")
                print()

            except Exception as e:
                print(f"[{timestamp}] ${symbol}: ERROR - {e}")

        print(f"--- Next check in {interval_minutes} minutes ---\n")
        time.sleep(interval_minutes * 60)


# Usage:
# monitor(payment_proof="<your_payment_proof>", interval_minutes=15)
