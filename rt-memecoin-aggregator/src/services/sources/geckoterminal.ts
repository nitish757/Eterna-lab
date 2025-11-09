import { CFG } from '../../config.js';
import { httpGetJson } from '../../utils/http.js';

interface GeckoResp { data: { id: string, attributes: { address: string, name: string, symbol: string, price_in_native_currency?: string, total_reserve_in_usd?: string, volume_usd?: { h24?: string } } }[] }

export async function fetchGeckoTerminalSamples(network = 'solana'): Promise<any[]> {
  const url = `${CFG.bases.gecko}/api/v2/networks/${network}/tokens`;
  const data = await httpGetJson<GeckoResp>(url);
  return (data.data || []).map(x => ({
    tokenAddress: x.attributes.address,
    tokenName: x.attributes.name,
    tokenTicker: x.attributes.symbol,
    priceSol: x.attributes.price_in_native_currency ? Number(x.attributes.price_in_native_currency) : undefined,
    volumeSol: x.attributes.volume_usd?.h24 ? Number(x.attributes.volume_usd.h24) : undefined,
    marketCapSol: undefined,
    liquiditySol: x.attributes.total_reserve_in_usd ? Number(x.attributes.total_reserve_in_usd) : undefined,
    protocol: 'geckoterminal',
  }));
}
