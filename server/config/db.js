import mongoose from 'mongoose';

let usingMockData = false;

export function isMockMode() {
  return usingMockData;
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    usingMockData = true;
    console.warn('[Aureus API] No MONGODB_URI set — serving mock portfolio data.');
    return null;
  }

  mongoose.set('strictQuery', true);
  mongoose.set('bufferCommands', false);

  const connectPromise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 5000,
    family: 4,
  });

  try {
    const conn = await withTimeout(connectPromise, 8000, 'MongoDB connection');
    usingMockData = false;
    console.info(`[Aureus API] MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    usingMockData = true;
    console.error('[Aureus API] MongoDB connection failed, falling back to mock data:', err.message);
    mongoose.disconnect().catch(() => {});
    return null;
  }
}
