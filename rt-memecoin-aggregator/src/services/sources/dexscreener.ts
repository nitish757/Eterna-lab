import { CFG } from '../../config.js';
import { httpGetJson } from '../../utils/http.js';

interface DexScreenerPair { baseToken: { address: string; symbol: string; name: string }; info?: any; priceUsd?: string; priceNative?: string; liquidity?: { base?: number }; fdv?: number; volume?: { h24?: number; h1?: number; } }
interface DexScreenerResp { pairs?: DexScreenerPair[] }

export async function fetchDexScreenerSamples(query = 'solana'): Promise<any[]> {
  const url = `${CFG.bases.dexscreener}/latest/dex/search?q=${encodeURIComponent(query)}`;
  const data = await httpGetJson<DexScreenerResp>(url);
  return (data.pairs || []).map(p => ({
    tokenAddress: p.baseToken.address,
    tokenName: p.baseToken.name,
    tokenTicker: p.baseToken.symbol,
    priceSol: p.priceNative ? Number(p.priceNative) : undefined,
    volumeSol: p.volume?.h24,
    marketCapSol: p.fdv,
    liquiditySol: p.liquidity?.base,
    priceChangePct: Number(p?.info?.priceChange?.h24 ?? p?.info?.priceChange?.h1 ?? 0),
    protocol: p?.info?.dexId,
  }));
}
