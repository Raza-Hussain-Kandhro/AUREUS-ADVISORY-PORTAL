import Portfolio from '../models/Portfolio.js';
import { isMockMode } from '../config/db.js';
import { MOCK_PORTFOLIOS, MOCK_INSIGHTS } from '../mockStore.js';

export async function getPortfolio(req, res) {
  if (isMockMode()) {
    const portfolio = MOCK_PORTFOLIOS[req.user.id];
    if (!portfolio) return res.status(404).json({ error: 'No portfolio found for this account.' });
    return res.json(portfolio);
  }

  try {
    const portfolio = await Portfolio.findOne({ userId: req.user.id }).sort({ lastUpdated: -1 }).lean();
    if (!portfolio) {
      return res
        .status(404)
        .json({ error: 'No portfolio found for this account yet. Ask your advisor to set one up.' });
    }
    return res.json(portfolio);
  } catch (err) {
    console.error('[Aureus API] getPortfolio error:', err);
    return res.status(500).json({ error: 'Failed to load portfolio.' });
  }
}

export async function getInsights(req, res) {
  // Editorial/CMS content — same for every client in this scaffold.
  return res.json(MOCK_INSIGHTS);
}
