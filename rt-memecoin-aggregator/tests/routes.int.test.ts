import Fastify from 'fastify';
import { registerRoutes } from '../src/web/routes.js';

const dummyWs = { pushPriceDeltas() {}, detectVolumeSpikes() {} } as any;

test('GET /tokens basic', async () => {
  const app = Fastify();
  await registerRoutes(app as any, dummyWs);
  const res = await app.inject({ method: 'GET', url: '/tokens' });
  expect(res.statusCode).toBe(200);
});
