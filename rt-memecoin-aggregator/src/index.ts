import 'dotenv/config';
import { createServer } from './server.js';

const port = Number(process.env.PORT) || 8080;

async function start() {
  const { httpServer } = await createServer();

  httpServer.listen(port, () => {
    console.log(`✅ Server successfully running on port ${port}`);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
