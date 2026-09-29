import mongoose from 'mongoose';

let usingMockData = false;

export function isMockMode() {
  return usingMockData;
}

/**
 * Connects to MongoDB when MONGODB_URI is configured. If it isn't (e.g. a
 * fresh clone with no database provisioned yet), the API falls back to the
 * in-memory mock data defined in each controller so `npm run server` works
 * immediately without any setup.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    usingMockData = true;
    console.warn(
      '[Aureus API] No MONGODB_URI set — serving mock portfolio data. ' +
        'Set MONGODB_URI in server/.env to connect a real database.'
    );
    return null;
  }

  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    usingMockData = false;
    console.info(`[Aureus API] MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    usingMockData = true;
    console.error('[Aureus API] MongoDB connection failed, falling back to mock data:', err.message);
    return null;
  }
}
