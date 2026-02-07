"""
Alpha Research API - Trading Agent Decision Loop

REFERENCE PATTERN - Not runnable out-of-box.
See basic_request.py for a runnable example.

Shows how a Python agent can chain endpoints for trading decisions.

Cost per cycle: $0.25 base ($0.35 with twitter addons)
  - trending: $0.02
  - sentiment: $0.08
  - deep research: $0.15
"""

import time
import requests
from dataclasses import dataclass

API_URL = "https://x402.911fund.io"


@dataclass
class TradingDecision:
    symbol: str
    action: str  # BUY, SELL, HOLD
    confidence: float
    reasoning: str


def make_paid_request(endpoint: str, params: dict, payment_proof: str) -> dict:
    """Make a paid API request. Replace with your payment signing logic."""
    headers = {"X-PAYMENT": payment_proof}
    response = requests.get(f"{API_URL}{endpoint}", params=params, headers=headers)
    response.raise_for_status()
    return response.json()


def analyze_market(payment_proof: str) -> list[TradingDecision]:
    decisions = []

    # Step 1: Get trending tokens ($0.02)
    trending = make_paid_request("/alpha/trending", {"twitter": "true"}, payment_proof)
    top_movers = trending["data"]["coingecko"][:3]

    for token in top_movers:
        symbol = token["symbol"]

        # Step 2: Get sentiment ($0.08)
        sentiment = make_paid_request(
            "/alpha/sentiment",
            {"query": f"${symbol}"},
            payment_proof,
        )

        analysis = sentiment["data"]["sentimentAnalysis"].lower()
        is_bullish = "bullish" in analysis
        is_bearish = "bearish" in analysis

        # Step 3: Deep research if signal is clear ($0.15)
        if is_bullish or is_bearish:
            deep = make_paid_request(
                "/alpha/deep",
                {"query": f"{symbol} investment thesis 2026"},
                payment_proof,
            )

            decisions.append(TradingDecision(
                symbol=symbol,
                action="BUY" if is_bullish else "SELL",
                confidence=0.7 if is_bullish else 0.6,
                reasoning=f"Sentiment: {analysis[:100]}...",
            ))
        else:
            decisions.append(TradingDecision(
                symbol=symbol,
                action="HOLD",
                confidence=0.5,
                reasoning="Mixed sentiment",
            ))

    return decisions


def trading_loop(payment_proof: str):
    """Run analysis every 5 minutes."""
    while True:
        try:
            decisions = analyze_market(payment_proof)
            for d in decisions:
                print(f"{d.symbol}: {d.action} ({d.confidence:.0%}) - {d.reasoning}")
        except Exception as e:
            print(f"Cycle failed: {e}")

        time.sleep(300)  # 5 minutes
