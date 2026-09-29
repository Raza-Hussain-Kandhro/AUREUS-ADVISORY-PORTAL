import SyncTask from '../models/SyncTask.js';
import { isMockMode } from '../config/db.js';
import { addMockMessage } from '../inboxStore.js';

// Generic queued actions (e.g. trade authorization) that aren't advisor
// messages — logged for mock-mode visibility only, no inbox UI needed for
// these since they're account actions, not correspondence.
const mockActionLog = [];

export async function receiveSyncTask(req, res) {
  const { action, requestedAt, ...rest } = req.body ?? {};

  if (!action) {
    return res.status(400).json({ error: 'A sync task requires an "action" field.' });
  }

  const record = {
    userId: req.user.id,
    action,
    requestedAt: requestedAt ?? Date.now(),
    receivedAt: Date.now(),
    ...rest,
  };

  if (isMockMode()) {
    mockActionLog.push(record);
    console.info('[Aureus API] Queued action synced (mock mode):', record);
    return res.status(201).json({ status: 'processed', mode: 'mock', task: record });
  }

  try {
    const saved = await SyncTask.create({
      clientTaskId: rest.clientTaskId ?? `srv_${Date.now()}`,
      userId: req.user.id,
      endpoint: '/sync',
      method: 'POST',
      payload: record,
      status: 'received',
    });
    return res.status(201).json({ status: 'processed', mode: 'db', task: saved });
  } catch (err) {
    console.error('[Aureus API] receiveSyncTask error:', err);
    return res.status(500).json({ error: 'Failed to persist sync task.' });
  }
}

export async function receiveAdvisorContact(req, res) {
  const { message, preferredTime, requestedAt } = req.body ?? {};

  if (!message) {
    return res.status(400).json({ error: 'A contact request requires a "message" field.' });
  }

  if (isMockMode()) {
    const record = addMockMessage({
      userId: req.user.id,
      userName: req.user.name,
      message,
      preferredTime,
    });
    console.info('[Aureus API] Advisor contact request received (mock mode):', record);
    return res.status(201).json({ status: 'processed', mode: 'mock', task: record });
  }

  try {
    const saved = await SyncTask.create({
      clientTaskId: `advisor_${Date.now()}`,
      userId: req.user.id,
      endpoint: '/advisor/contact',
      method: 'POST',
      payload: {
        userName: req.user.name,
        message,
        preferredTime: preferredTime ?? null,
        requestedAt: requestedAt ?? Date.now(),
      },
      status: 'received',
    });
    return res.status(201).json({ status: 'processed', mode: 'db', task: saved });
  } catch (err) {
    console.error('[Aureus API] receiveAdvisorContact error:', err);
    return res.status(500).json({ error: 'Failed to persist contact request.' });
  }
}
