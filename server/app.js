import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js';
import { isMockMode } from './config/db.js';
// ...

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:5173'],
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'aureus-advisory-api', time: new Date().toISOString() });
  });
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'aureus-advisory-api',
    database: isMockMode() ? 'mock' : 'mongodb',
    time: new Date().toISOString(),
  });
});
  app.use('/api/v1', apiRoutes);

  app.use('/api', (req, res) => {
    res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error('[Aureus API] Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  });

  return app;
}
