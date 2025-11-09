import type { Token } from '../types.js';

export function mergeTokens(items: Partial<Token>[]): Token[] {
  const byAddr = new Map<string, Token>();
  for (const it of items) {
    if (!it.tokenAddress) continue;
    const cur = byAddr.get(it.tokenAddress);
    if (!cur) {
      byAddr.set(it.tokenAddress, { ...defaults(it) });
    } else {
      byAddr.set(it.tokenAddress, merge(cur, it));
    }
  }
  return [...byAddr.values()];
}

function defaults(it: Partial<Token>): Token {
  return {
    tokenAddress: it.tokenAddress!,
    tokenName: it.tokenName || '',
    tokenTicker: it.tokenTicker || '',
    priceSol: it.priceSol,
    marketCapSol: it.marketCapSol,
    volumeSol: it.volumeSol,
    liquiditySol: it.liquiditySol,
    txCount: it.txCount,
    priceChangePct: it.priceChangePct,
    protocol: it.protocol,
    lastUpdateTs: Date.now(),
  };
}

function merge(a: Token, b: Partial<Token>): Token {
  return {
    ...a,
    tokenName: a.tokenName || b.tokenName || '',
    tokenTicker: a.tokenTicker || b.tokenTicker || '',
    priceSol: pick(a.priceSol, b.priceSol),
    marketCapSol: pick(a.marketCapSol, b.marketCapSol),
    volumeSol: sum(a.volumeSol, b.volumeSol),
    liquiditySol: pick(a.liquiditySol, b.liquiditySol),
    txCount: sum(a.txCount, b.txCount),
    priceChangePct: pick(a.priceChangePct, b.priceChangePct),
    protocol: a.protocol || b.protocol,
    lastUpdateTs: Date.now(),
  };
}

function pick<T>(x?: T, y?: T): T | undefined { return y ?? x; }
function sum(a?: number, b?: number): number | undefined {
  if (a == null && b == null) return undefined;
  return (a || 0) + (b || 0);
}
