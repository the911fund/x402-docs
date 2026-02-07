# TypeScript Examples

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and add your wallet private key:

```bash
cp .env.example .env
```

Your wallet must have USDC on Base to make paid API calls.

## Run

```bash
npx tsx basic-fetch.ts
```

## Files

| File | Type | Description |
|---|---|---|
| `basic-fetch.ts` | Runnable | Simple token + trending + sentiment calls |
| `trading-loop.ts` | Reference | Agent trading decision loop pattern |
| `multi-endpoint.ts` | Reference | Parallel multi-endpoint chaining |
