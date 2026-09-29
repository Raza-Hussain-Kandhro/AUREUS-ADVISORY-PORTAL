import './loadEnv.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/User.js';
import Portfolio from './models/Portfolio.js';
import { DEMO_PASSWORD, MOCK_PORTFOLIOS } from './mockStore.js';

const DEMO_USERS = [
  { name: 'Ibrahim Reyes', email: 'ibrahim@aureuscapital.demo', role: 'client', initials: 'IR', portfolioKey: 'mock-user-ibrahim' },
  { name: 'Marcus Chen', email: 'marcus@aureuscapital.demo', role: 'client', initials: 'MC', portfolioKey: 'mock-user-marcus' },
  { name: 'Raza Hussain', email: 'raza@aureuscapital.demo', role: 'advisor', initials: 'RH', portfolioKey: null },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      '[Aureus seed] MONGODB_URI is not set in server/.env — nothing to seed. ' +
        'The app runs fine without this; seeding is only for real-database deployments.'
    );
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.info('[Aureus seed] Connected to MongoDB.');

  for (const demo of DEMO_USERS) {
    const existing = await User.findOne({ email: demo.email });
    let user = existing;

    if (!existing) {
      const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
      user = await User.create({
        name: demo.name,
        email: demo.email,
        passwordHash,
        role: demo.role,
        initials: demo.initials,
      });
      console.info(`[Aureus seed] Created user ${demo.email}`);
    } else {
      console.info(`[Aureus seed] User ${demo.email} already exists, skipping creation.`);
    }

    if (demo.portfolioKey) {
      const existingPortfolio = await Portfolio.findOne({ userId: user._id });
      if (!existingPortfolio) {
        const template = MOCK_PORTFOLIOS[demo.portfolioKey];
        await Portfolio.create({ ...template, userId: user._id });
        console.info(`[Aureus seed] Created portfolio for ${demo.email}`);
      } else {
        console.info(`[Aureus seed] Portfolio for ${demo.email} already exists, skipping.`);
      }
    }
  }

  console.info(`[Aureus seed] Done. Demo password for all accounts: ${DEMO_PASSWORD}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Aureus seed] Failed:', err);
  process.exit(1);
});
