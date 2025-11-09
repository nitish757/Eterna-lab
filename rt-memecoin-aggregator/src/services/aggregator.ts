import pLimit from 'p-limit';
import { CFG } from '../config.js';
import { Cache } from './cache.js';
import { fetchDexScreenerSamples } from './sources/dexscreener.js';
import { fetchGeckoTerminalSamples } from './sources/geckoterminal.js';
import { enrichWithJupiterPrice } from './sources/jupiter.js';
import { mergeTokens } from './merge.js';
import type { Token } from '../types.js';

const CACHE_KEY = 'tokens:merged';

export async function refreshTokens(): Promise<Token[]> {
  const limit = pLimit(CFG.upstreamConcurrency);
  const results = await Promise.all([
    limit(() => fetchDexScreenerSamples('solana')),
    limit(() => fetchGeckoTerminalSamples('solana')),
  ]);

  let merged = mergeTokens(results.flat());
  merged = await enrichWithJupiterPrice(merged);

  await Cache.set(CACHE_KEY, merged, CFG.cacheTtlSec);
  return merged;
}

export async function listTokensCached(): Promise<Token[]> {
  const cached = await Cache.get<Token[]>(CACHE_KEY);
  if (cached) return cached;
  return await refreshTokens();
}
