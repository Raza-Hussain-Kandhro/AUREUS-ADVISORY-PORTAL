import Lead from '../models/Lead.js';
import { isMockMode } from '../config/db.js';
import { addMockLead } from '../inboxStore.js';

export async function receiveLead(req, res) {
  const { name, email, phone, investableAssets, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and a short message are required.' });
  }

  if (isMockMode()) {
    addMockLead({ name, email, phone, investableAssets, message });
    return res.status(201).json({ status: 'received' });
  }

  try {
    await Lead.create({ name, email, phone: phone ?? null, investableAssets: investableAssets ?? null, message });
    return res.status(201).json({ status: 'received' });
  } catch (err) {
    console.error('[Aureus API] receiveLead error:', err);
    return res.status(500).json({ error: 'Failed to submit your request. Please try again.' });
  }
}
