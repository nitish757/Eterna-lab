import { CFG } from '../../config.js';
import { httpGetJson } from '../../utils/http.js';

interface JupiterResp { data: Record<string, { id: string; price: number }> }

export async function enrichWithJupiterPrice(tokens: any[]) {
  const ids = tokens.map(t => t.tokenAddress).filter(Boolean).slice(0, 50);
  if (!ids.length) return tokens;
  const url = `${CFG.bases.jupiter}/v4/price?ids=${encodeURIComponent(ids.join(','))}`;
  const data = await httpGetJson<JupiterResp>(url);
  const map = data?.data || {};
  return tokens.map(t => map[t.tokenAddress] ? { ...t, priceSol: map[t.tokenAddress].price } : t);
}
