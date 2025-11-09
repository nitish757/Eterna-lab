export const CFG = {
  cacheTtlSec: Number(process.env.CACHE_TTL_SECONDS || 30),
  upstreamConcurrency: Number(process.env.UPSTREAM_CONCURRENCY || 4),
  priceChangeThreshold: Number(process.env.WEBSOCKET_PRICE_THRESHOLD || 0.02),
  volumeSpikeMultiplier: Number(process.env.WEBSOCKET_VOLUME_SPIKE_MULTIPLIER || 2),
  bases: {
    dexscreener: process.env.DEXSCREENER_BASE || 'https://api.dexscreener.com',
    gecko: process.env.GECKOTERMINAL_BASE || 'https://api.geckoterminal.com',
    jupiter: process.env.JUPITER_BASE || 'https://price.jup.ag',
  },
};
