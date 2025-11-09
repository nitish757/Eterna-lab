import type { Server } from 'socket.io';
import type { Token } from '../types.js';
import { CFG } from '../config.js';

export type WsBroker = ReturnType<typeof createWsBroker>;

export function createWsBroker(io: Server) {
  io.of('/ws').on('connection', (sock) => {
    sock.join('global');
  });

  let lastPrice: Record<string, number> = {};
  let lastVolume: Record<string, number> = {};

  function pushPriceDeltas(tokens: Token[]) {
    const ns = io.of('/ws');
    const now = Date.now();
    for (const t of tokens) {
      const prev = lastPrice[t.tokenAddress];
      if (t.priceSol != null && prev != null) {
        const change = (t.priceSol - prev) / (prev || 1);
        if (Math.abs(change) >= CFG.priceChangeThreshold) {
          ns.to('global').emit('price:update', { tokenAddress: t.tokenAddress, price: t.priceSol, changePct: change, ts: now });
        }
      }
      if (t.priceSol != null) lastPrice[t.tokenAddress] = t.priceSol;
    }
  }

  function detectVolumeSpikes(tokens: Token[]) {
    const ns = io.of('/ws');
    const now = Date.now();
    for (const t of tokens) {
      const prev = lastVolume[t.tokenAddress] || 0;
      const cur = t.volumeSol || 0;
      if (prev > 0 && cur >= prev * CFG.volumeSpikeMultiplier) {
        ns.to('global').emit('volume:spike', { tokenAddress: t.tokenAddress, volume: cur, multiplier: cur / prev, ts: now });
      }
      lastVolume[t.tokenAddress] = cur;
    }
  }

  return { pushPriceDeltas, detectVolumeSpikes } as const;
}
