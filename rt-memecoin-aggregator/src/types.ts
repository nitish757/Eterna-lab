export type Timeframe = '1h' | '24h' | '7d';

export interface Token {
  tokenAddress: string;
  tokenName: string;
  tokenTicker: string;
  priceSol?: number;
  marketCapSol?: number;
  volumeSol?: number;
  liquiditySol?: number;
  txCount?: number;
  priceChangePct?: number;
  protocol?: string;
  lastUpdateTs?: number;
}

export interface ListQuery {
  limit: number;
  cursor?: string;
  sortBy?: 'price' | 'volume' | 'marketCap' | 'priceChange';
  sortDir?: 'asc' | 'desc';
  timeframe?: Timeframe;
  search?: string;
}
