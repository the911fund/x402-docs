"""
Alpha Research API - Basic Python Example

RUNNABLE: Demonstrates the 402 payment flow.
This example shows how to read the 402 response and understand the payment requirements.
For automatic payment handling, use the @x402/fetch TypeScript SDK.
"""

import json
import requests

API_URL = "https://x402.911fund.io"


def get_payment_requirements(endpoint: str, params: dict) -> dict:
    """Make a request and parse the 402 payment requirements."""
    response = requests.get(f"{API_URL}{endpoint}", params=params)

    if response.status_code == 402:
        payment_info = response.json()
        print(f"Payment required for {endpoint}")
        print(f"  Status: {response.status_code}")
        print(f"  Amount: {payment_info.get('accepts', [{}])[0].get('maxAmountRequired', 'unknown')} (USDC atomic units)")
        print(f"  Pay to: {payment_info.get('accepts', [{}])[0].get('payTo', 'unknown')}")
        print(f"  Network: {payment_info.get('accepts', [{}])[0].get('network', 'unknown')}")
        return payment_info

    print(f"Unexpected status: {response.status_code}")
    return response.json()


def make_paid_request(endpoint: str, params: dict, payment_proof: str) -> dict:
    """Make a paid request with the payment proof header."""
    headers = {"X-PAYMENT": payment_proof}
    response = requests.get(f"{API_URL}{endpoint}", params=params, headers=headers)
    return response.json()


def check_health() -> dict:
    """Check API health (free, no payment required)."""
    response = requests.get(f"{API_URL}/health")
    return response.json()


def get_discovery() -> dict:
    """Get the machine-readable endpoint discovery document (free)."""
    response = requests.get(f"{API_URL}/.well-known/x402.json")
    return response.json()


if __name__ == "__main__":
    # Check health first (free)
    print("=== Health Check ===")
    health = check_health()
    print(json.dumps(health, indent=2))

    # Get discovery document (free)
    print("\n=== Discovery Document ===")
    discovery = get_discovery()
    for resource in discovery.get("resources", []):
        print(f"  {resource['path']} - ${resource['priceUSD']} USDC - {resource['description']}")

    # Try each endpoint (will return 402)
    print("\n=== Payment Requirements ===")

    print("\n--- /alpha/token ---")
    get_payment_requirements("/alpha/token", {"symbol": "SOL"})

    print("\n--- /alpha/trending ---")
    get_payment_requirements("/alpha/trending", {})

    print("\n--- /alpha/sentiment ---")
    get_payment_requirements("/alpha/sentiment", {"query": "$WIF"})

    print("\n--- /alpha/search ---")
    get_payment_requirements("/alpha/search", {"query": "Jupiter DEX Solana"})

    print("\n--- /alpha/deep ---")
    get_payment_requirements("/alpha/deep", {"query": "Should I invest in Farcaster?"})

    print("\nTo make paid requests, sign a USDC transfer on-chain")
    print("and include the proof in the X-PAYMENT header.")
    print("See the TypeScript examples for automatic payment handling with @x402/fetch.")
