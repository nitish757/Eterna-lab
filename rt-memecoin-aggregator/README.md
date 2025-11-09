# Real-time Meme Coin Aggregator (Backend Task 1)

A production-ready backend that aggregates **real-time meme coin data** from multiple DEX sources with efficient caching and real-time updates. It closely follows the assignment's **Core Requirements**, **Technical Context**, and **Deliverables**.

## Key Features
- **Data Aggregation** from ≥2 real APIs: DexScreener + GeckoTerminal (+ optional Jupiter Price enrichment).
- **Exponential backoff** with jitter for upstream rate limits.
- **Duplicate merge** by token address.
- **Redis cache** (configurable TTL, default 30s).
- **WebSockets (Socket.IO)** for live price/volume updates after the initial page load.
- **Filtering & Sorting** (by timeframe 1h/24h/7d and by price/volume/mcap/priceChange).
- **Cursor-based pagination**.
- **Dockerized** with redis; **Jest** tests; **Postman** collection.

## Quickstart
```bash
# 1) install deps
npm i

# 2) configure
cp .env.example .env

# 3) start redis
docker compose up -d redis
# or: docker run -d -p 6379:6379 redis:7-alpine

# 4) run dev
npm run dev
```

### REST Endpoints
- `GET /health`
- `GET /tokens?limit=25&sortBy=volume&sortDir=desc&timeframe=24h&search=dog`
- `POST /tokens/refresh`

### WebSocket
- Namespace: `/ws`
- Events: `price:update`, `volume:spike`

### Env
```
PORT=8080
NODE_ENV=development
REDIS_URL=redis://localhost:6379
CACHE_TTL_SECONDS=30
UPSTREAM_CONCURRENCY=4
WEBSOCKET_PRICE_THRESHOLD=0.02
WEBSOCKET_VOLUME_SPIKE_MULTIPLIER=2
DEXSCREENER_BASE=https://api.dexscreener.com
GECKOTERMINAL_BASE=https://api.geckoterminal.com
JUPITER_BASE=https://price.jup.ag
```

## Scripts
- `npm run dev` — ts-node-dev
- `npm run build` — TypeScript build
- `npm start` — run compiled app
- `npm test` — Jest tests

## Deploy (free hosting)
- Works on Render/Railway/Fly/Koyeb. Build Docker image and set env vars including `REDIS_URL`.
- Expose port `${PORT}`.

## Notes Mapping to PDF
- ≥2 APIs (DexScreener + GeckoTerminal) + backoff + Redis TTL + merge by token address ✅
- WebSocket updates for price/volume after initial HTTP fetch ✅
- Filtering/sorting + cursor pagination ✅
- Postman + ≥10 tests (unit/integration) ✅
