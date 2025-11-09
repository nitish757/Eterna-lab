import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const Cache = {
  async get<T>(key: string): Promise<T | null> {
    const v = await redis.get(key);
    return v ? JSON.parse(v) as T : null;
  },
  async set<T>(key: string, value: T, ttlSec: number) {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSec);
  },
  async publish(channel: string, payload: any) {
    await redis.publish(channel, JSON.stringify(payload));
  },
  raw: redis,
};
