#!/bin/bash
# Alpha Research API — curl examples
# https://github.com/the911fund/x402-docs
#
# All endpoints return HTTP 402 without payment.
# Use @x402/fetch SDK for automatic payment handling.

BASE_URL="https://x402.911fund.io"

# ============================================================
# /alpha/token — Token Analysis ($0.02 USDC)
# ============================================================

# By symbol (default chain: base)
curl -s "$BASE_URL/alpha/token?symbol=SOL" | jq .

# By contract address on Base
curl -s "$BASE_URL/alpha/token?address=0x532f27101965dd16442E59d40670FaF5eBB142E4&chain=base" | jq .

# With Twitter sentiment data (+$0.05 USDC)
curl -s "$BASE_URL/alpha/token?symbol=WIF&twitter=true" | jq .

# On Solana
curl -s "$BASE_URL/alpha/token?address=JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN&chain=solana" | jq .

# ============================================================
# /alpha/trending — Market Movers ($0.02 USDC)
# ============================================================

# Basic trending
curl -s "$BASE_URL/alpha/trending" | jq .

# With Twitter mentions (+$0.05 USDC)
curl -s "$BASE_URL/alpha/trending?twitter=true" | jq .

# Limited results
curl -s "$BASE_URL/alpha/trending?limit=5" | jq .

# ============================================================
# /alpha/sentiment — X/Twitter Analysis ($0.08 USDC)
# ============================================================

# By cashtag
curl -s "$BASE_URL/alpha/sentiment?query=\$WIF" | jq .

# By topic
curl -s "$BASE_URL/alpha/sentiment?topic=Solana+ecosystem" | jq .

# By token name
curl -s "$BASE_URL/alpha/sentiment?token=ETH" | jq .

# ============================================================
# /alpha/search — Quick Research ($0.03 USDC)
# ============================================================

# Research query
curl -s "$BASE_URL/alpha/search?query=Jupiter+DEX+Solana" | jq .

# Using q alias
curl -s "$BASE_URL/alpha/search?q=Eigenlayer+restaking" | jq .

# ============================================================
# /alpha/deep — Full Research Suite ($0.15 USDC)
# ============================================================

# Research question
curl -s "$BASE_URL/alpha/deep?query=Should+I+invest+in+Farcaster" | jq .

# By topic
curl -s "$BASE_URL/alpha/deep?topic=Base+L2+growth+metrics" | jq .

# By URL
curl -s "$BASE_URL/alpha/deep?url=https://example.com/article" | jq .

# ============================================================
# With payment header (after signing on-chain)
# ============================================================

# Base (EVM) — uses X-PAYMENT header
curl -s -H "X-PAYMENT: <signed_payment_payload>" \
  "$BASE_URL/alpha/token?symbol=SOL" | jq .

# Solana — uses X-Payment-Proof header
curl -s -H "X-Payment-Proof: <solana_transaction_signature>" \
  "$BASE_URL/alpha/token?symbol=SOL&chain=solana" | jq .

# ============================================================
# Free endpoints (no payment required)
# ============================================================

# Health check
curl -s "$BASE_URL/health" | jq .

# Stats
curl -s "$BASE_URL/stats" | jq .

# Discovery document
curl -s "$BASE_URL/.well-known/x402.json" | jq .
