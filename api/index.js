import '../server/loadEnv.js';
import serverless from 'serverless-http';
import { createApp } from '../server/app.js';
import { connectDB } from '../server/config/db.js';

const app = createApp();

// Connect once per warm serverless instance rather than per-request.
let dbReady = connectDB();

const handler = serverless(app);

export default async function (req, res) {
  await dbReady;
  return handler(req, res);
}
