import { createServer as createHttpServer } from 'http'; // ✅ add this line
import { Server as SocketIOServer } from 'socket.io';
import { registerRoutes } from './web/routes.js';
import { createWsBroker } from './ws/broker.js';

import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';

export async function createServer() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true });
  await app.register(helmet);

  app.get('/ping', async () => {
    return { message: 'Server Ping' };
  });

  const httpServer = createHttpServer(app.server);
  const io = new SocketIOServer(httpServer, { path: '/socket.io' });

  const ws = createWsBroker(io);
  await registerRoutes(app, ws);

  return { app, httpServer, io, ws } as const;
}
