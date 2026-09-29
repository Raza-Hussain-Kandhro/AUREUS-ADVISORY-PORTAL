import { snapshotStore } from './indexedDB.js';
import { authHeaders } from './authToken.js';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1';

/**
 * Network-first fetch with an IndexedDB snapshot fallback. The service
 * worker already applies this same strategy at the HTTP layer for repeat
 * visits; this helper additionally guarantees a usable snapshot on the very
 * first offline load of a session (e.g. app killed and reopened offline).
 *
 * Snapshot keys are namespaced per-user so switching accounts (or an advisor
 * viewing a client) never shows a different person's cached data.
 */
export async function fetchWithFallback(path, snapshotKey, { userScoped = true } = {}) {
  const scopedKey = userScoped ? `${snapshotKey}:${authHeaders().Authorization ?? 'anon'}` : snapshotKey;

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: 'application/json', ...authHeaders() },
    });
    if (res.status === 401) {
      const err = new Error('Session expired.');
      err.status = 401;
      throw err;
    }
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = await res.json();
    await snapshotStore.setItem(scopedKey, { data, cachedAt: Date.now() });
    return { data, fromCache: false, cachedAt: Date.now() };
  } catch (err) {
    if (err.status === 401) throw err;
    const cached = await snapshotStore.getItem(scopedKey);
    if (cached) {
      return { data: cached.data, fromCache: true, cachedAt: cached.cachedAt };
    }
    throw err;
  }
}

export function fetchPortfolio() {
  return fetchWithFallback('/portfolio', 'snapshot_portfolio');
}

export function fetchInsights() {
  return fetchWithFallback('/insights', 'snapshot_insights');
}

export function fetchClientRoster() {
  return fetchWithFallback('/advisor-portal/clients', 'snapshot_roster');
}

export function fetchClientDetail(clientId) {
  return fetchWithFallback(`/advisor-portal/clients/${clientId}`, `snapshot_client_${clientId}`);
}

export function fetchInbox() {
  return fetchWithFallback('/advisor-portal/inbox', 'snapshot_inbox');
}

export async function resolveInboxItem(type, id) {
  const res = await fetch(`${API_BASE}/advisor-portal/inbox/${type}/${id}/resolve`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to update this item.');
  return res.json();
}
