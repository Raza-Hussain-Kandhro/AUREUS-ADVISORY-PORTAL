import localforage from 'localforage';

// Dedicated IndexedDB-backed stores (localforage falls back to WebSQL/localStorage
// automatically on browsers that lack IndexedDB, so this stays reliable everywhere).

export const queueStore = localforage.createInstance({
  name: 'aureus-vault',
  storeName: 'offline_queue',
  description: 'Pending mutations captured while offline, synced on reconnect.',
});

export const snapshotStore = localforage.createInstance({
  name: 'aureus-vault',
  storeName: 'portfolio_snapshots',
  description: 'Last-known-good portfolio & insights data for instant offline reads.',
});

const QUEUE_INDEX_KEY = 'queue_index';

/**
 * Reads the ordered list of queue task IDs. We keep an explicit index array
 * (rather than relying on store iteration order) so the UI can render the
 * queue in the order actions were taken.
 */
async function getQueueIndex() {
  const index = await queueStore.getItem(QUEUE_INDEX_KEY);
  return Array.isArray(index) ? index : [];
}

async function setQueueIndex(index) {
  await queueStore.setItem(QUEUE_INDEX_KEY, index);
}

/** @typedef {{ id: string, endpoint: string, method: 'POST'|'PUT', payload: Record<string, any>, timestamp: number, status: 'pending'|'syncing'|'failed'|'synced', label: string }} OfflineSyncTask */

/** @param {Omit<OfflineSyncTask, 'id'|'timestamp'|'status'>} task */
export async function enqueueTask(task) {
  const id = `sync_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  /** @type {OfflineSyncTask} */
  const fullTask = { id, timestamp: Date.now(), status: 'pending', ...task };

  await queueStore.setItem(id, fullTask);
  const index = await getQueueIndex();
  await setQueueIndex([...index, id]);

  return fullTask;
}

export async function updateTaskStatus(id, status) {
  const task = await queueStore.getItem(id);
  if (!task) return null;
  const updated = { ...task, status };
  await queueStore.setItem(id, updated);
  return updated;
}

export async function removeTask(id) {
  await queueStore.removeItem(id);
  const index = await getQueueIndex();
  await setQueueIndex(index.filter((taskId) => taskId !== id));
}

export async function getAllTasks() {
  const index = await getQueueIndex();
  const tasks = await Promise.all(index.map((id) => queueStore.getItem(id)));
  return tasks.filter(Boolean);
}

export async function clearSyncedTasks() {
  const tasks = await getAllTasks();
  const synced = tasks.filter((t) => t.status === 'synced');
  await Promise.all(synced.map((t) => removeTask(t.id)));
}
