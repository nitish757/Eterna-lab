import type { FastifyInstance } from 'fastify';
import { listTokensCached, refreshTokens } from '../services/aggregator.js';
import { decodeCursor, encodeCursor } from '../utils/pagination.js';
import type { ListQuery, Token } from '../types.js';
import type { WsBroker } from '../ws/broker.js';

export async function registerRoutes(app: FastifyInstance, ws: WsBroker) {
  app.get('/health', async () => ({ ok: true }));

  app.get('/tokens', async (req, rep) => {
    const q = req.query as any as ListQuery;
    const limit = Math.min(Math.max(Number(q.limit || 25), 1), 100);
    const sortBy = (q.sortBy || 'volume') as any;
    const sortDir = (q.sortDir || 'desc') as 'asc' | 'desc';
    const timeframe = (q.timeframe || '24h') as any;
    const search = (q.search || '').toLowerCase();

    const tokens = await listTokensCached();
    let filtered = tokens.map(t => ({ ...t, priceChangePct: t.priceChangePct })) as Token[];

    if (search) {
      filtered = filtered.filter(t => `${t.tokenName} ${t.tokenTicker}`.toLowerCase().includes(search));
    }

    filtered.sort((a, b) => compare(a, b, sortBy, sortDir));

    const cur = decodeCursor<{ idx: number }>(q.cursor) || { idx: 0 };
    const slice = filtered.slice(cur.idx, cur.idx + limit);
    const nextCursor = cur.idx + limit < filtered.length ? encodeCursor({ idx: cur.idx + limit }) : undefined;

    return rep.send({ items: slice, nextCursor, count: slice.length });
  });

  app.post('/tokens/refresh', async (_req, rep) => {
    const data = await refreshTokens();
    rep.send({ refreshed: data.length });
  });

  setInterval(async () => {
    try {
      const tokens = await listTokensCached();
      ws.pushPriceDeltas(tokens);
      ws.detectVolumeSpikes(tokens);
    } catch {}
  }, 5000);
}

function compare(a: Token, b: Token, by: string, dir: 'asc' | 'desc') {
  const key = (t: Token) => {
    switch (by) {
      case 'price': return t.priceSol ?? -Infinity;
      case 'marketCap': return t.marketCapSol ?? -Infinity;
      case 'priceChange': return t.priceChangePct ?? -Infinity;
      default: return t.volumeSol ?? -Infinity;
    }
  };
  const av = key(a), bv = key(b);
  return dir === 'asc' ? (av - bv) : (bv - av);
}
