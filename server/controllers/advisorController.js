import Portfolio from '../models/Portfolio.js';
import User from '../models/User.js';
import SyncTask from '../models/SyncTask.js';
import Lead from '../models/Lead.js';
import { isMockMode } from '../config/db.js';
import {
  listMockClients,
  findMockUserById,
  MOCK_PORTFOLIOS,
} from '../mockStore.js';
import { listMockInbox, markMockItemHandled } from '../inboxStore.js';

export async function listClients(req, res) {
  if (isMockMode()) {
    const clients = listMockClients().map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      initials: c.initials,
      totalValue: c.portfolio?.totalValue ?? null,
      ytdReturn: c.portfolio?.ytdReturn ?? null,
    }));
    return res.json(clients);
  }

  try {
    const clients = await User.find({ role: 'client' }).lean();
    const portfolios = await Portfolio.find({
      userId: { $in: clients.map((c) => c._id) },
    }).lean();
    const byUser = new Map(portfolios.map((p) => [p.userId.toString(), p]));

    const result = clients.map((c) => {
      const p = byUser.get(c._id.toString());
      return {
        id: c._id.toString(),
        name: c.name,
        email: c.email,
        initials: c.initials,
        totalValue: p?.totalValue ?? null,
        ytdReturn: p?.ytdReturn ?? null,
      };
    });
    return res.json(result);
  } catch (err) {
    console.error('[Aureus API] listClients error:', err);
    return res.status(500).json({ error: 'Failed to load client roster.' });
  }
}

export async function getClientPortfolio(req, res) {
  const { clientId } = req.params;

  if (isMockMode()) {
    const client = findMockUserById(clientId);
    const portfolio = MOCK_PORTFOLIOS[clientId];
    if (!client || client.role !== 'client' || !portfolio) {
      return res.status(404).json({ error: 'Client not found.' });
    }
    return res.json({ client: { id: client.id, name: client.name, initials: client.initials }, portfolio });
  }

  try {
    const client = await User.findOne({ _id: clientId, role: 'client' }).lean();
    if (!client) return res.status(404).json({ error: 'Client not found.' });

    const portfolio = await Portfolio.findOne({ userId: clientId }).sort({ lastUpdated: -1 }).lean();
    if (!portfolio) return res.status(404).json({ error: 'This client has no portfolio on file yet.' });

    return res.json({
      client: { id: client._id.toString(), name: client.name, initials: client.initials },
      portfolio,
    });
  } catch (err) {
    console.error('[Aureus API] getClientPortfolio error:', err);
    return res.status(500).json({ error: 'Failed to load client portfolio.' });
  }
}

/**
 * Combined inbox: client "contact advisor" messages + public consultation
 * leads, merged and sorted newest-first. This is what makes those two
 * previously-write-only endpoints (POST /advisor/contact, POST /leads)
 * actually visible to anyone.
 */
export async function listInbox(req, res) {
  if (isMockMode()) {
    return res.json(listMockInbox());
  }

  try {
    const [messages, leads] = await Promise.all([
      SyncTask.find({ endpoint: '/advisor/contact' }).sort({ receivedAt: -1 }).lean(),
      Lead.find().sort({ createdAt: -1 }).lean(),
    ]);

    const mappedMessages = messages.map((m) => ({
      id: m._id.toString(),
      type: 'message',
      from: m.payload?.userName ?? 'Client',
      userId: m.userId?.toString(),
      message: m.payload?.message,
      preferredTime: m.payload?.preferredTime ?? null,
      createdAt: new Date(m.receivedAt).getTime(),
      status: m.status === 'processed' ? 'handled' : 'new',
    }));

    const mappedLeads = leads.map((l) => ({
      id: l._id.toString(),
      type: 'lead',
      from: l.name,
      email: l.email,
      phone: l.phone,
      investableAssets: l.investableAssets,
      message: l.message,
      createdAt: new Date(l.createdAt).getTime(),
      status: l.status,
    }));

    const combined = [...mappedMessages, ...mappedLeads].sort((a, b) => b.createdAt - a.createdAt);
    return res.json(combined);
  } catch (err) {
    console.error('[Aureus API] listInbox error:', err);
    return res.status(500).json({ error: 'Failed to load inbox.' });
  }
}

export async function resolveInboxItem(req, res) {
  const { type, id } = req.params;
  if (!['message', 'lead'].includes(type)) {
    return res.status(400).json({ error: 'Invalid inbox item type.' });
  }

  if (isMockMode()) {
    const updated = markMockItemHandled(type, id);
    if (!updated) return res.status(404).json({ error: 'Inbox item not found.' });
    return res.json(updated);
  }

  try {
    if (type === 'message') {
      const updated = await SyncTask.findByIdAndUpdate(id, { status: 'processed' }, { new: true });
      if (!updated) return res.status(404).json({ error: 'Message not found.' });
      return res.json({ id: updated._id.toString(), status: 'handled' });
    } else {
      const updated = await Lead.findByIdAndUpdate(id, { status: 'handled' }, { new: true });
      if (!updated) return res.status(404).json({ error: 'Lead not found.' });
      return res.json({ id: updated._id.toString(), status: 'handled' });
    }
  } catch (err) {
    console.error('[Aureus API] resolveInboxItem error:', err);
    return res.status(500).json({ error: 'Failed to update inbox item.' });
  }
}
