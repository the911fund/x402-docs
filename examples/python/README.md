# Python Examples

## Setup

```bash
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and add your wallet private key:

```bash
cp .env.example .env
```

## Run

```bash
python basic_request.py
```

## Files

| File | Type | Description |
|---|---|---|
| `basic_request.py` | Runnable | Demonstrates 402 flow and payment requirements |
| `trading_agent.py` | Reference | Agent trading decision loop pattern |
| `sentiment_monitor.py` | Reference | Continuous sentiment polling for a watchlist |
