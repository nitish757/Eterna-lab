import axios from 'axios';

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

export async function httpGetJson<T>(url: string, opts: { headers?: any, maxRetries?: number } = {}): Promise<T> {
  const maxRetries = opts.maxRetries ?? 4;
  let attempt = 0;
  while (true) {
    try {
      const res = await axios.get<T>(url, { headers: opts.headers, timeout: 10_000 });
      return res.data;
    } catch (err: any) {
      attempt++;
      const status = err?.response?.status;
      if (attempt > maxRetries) throw err;
      const base = status === 429 ? 800 : 400;
      const delay = Math.min(4000, base * Math.pow(2, attempt - 1)) + Math.random()*150;
      await sleep(delay);
    }
  }
}
