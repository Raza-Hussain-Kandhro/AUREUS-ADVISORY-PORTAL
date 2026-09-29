import './loadEnv.js';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 4000;
const app = createApp();

connectDB().finally(() => {
  app.listen(PORT, () => {
    console.info(`[Aureus API] Listening on http://localhost:${PORT}`);
  });
});

export default app;
