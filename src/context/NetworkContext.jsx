import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  enqueueTask,
  getAllTasks,
  removeTask,
  snapshotStore,
  updateTaskStatus,
} from '../utils/indexedDB.js';
import { authHeaders } from '../utils/authToken.js';

const NetworkContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1';
const LAST_SYNC_KEY = 'last_portfolio_sync';

export function NetworkProvider({ children }) {
  const [isOnline, setIsOnline] = useState(
    typeof navigator === 'undefined' ? true : navigator.onLine
  );
  const [pendingActions, setPendingActions] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [justReconnected, setJustReconnected] = useState(false);
  const reconnectTimer = useRef(null);

  // Hydrate queue + last-synced timestamp from IndexedDB on first mount.
  useEffect(() => {
    (async () => {
      const [tasks, storedSync] = await Promise.all([
        getAllTasks(),
        snapshotStore.getItem(LAST_SYNC_KEY),
      ]);
      setPendingActions(tasks);
      if (storedSync) setLastSyncedAt(storedSync);
    })();
  }, []);

  const refreshQueue = useCallback(async () => {
    const tasks = await getAllTasks();
    setPendingActions(tasks);
    return tasks;
  }, []);

  const markSynced = useCallback(async () => {
    const now = Date.now();
    setLastSyncedAt(now);
    await snapshotStore.setItem(LAST_SYNC_KEY, now);
  }, []);

  /**
   * Sends every pending task to the backend sync endpoint. Tasks that fail
   * (network drop mid-flush, 5xx, etc.) are left in the queue as 'failed' and
   * retried on the next reconnect rather than lost.
   */
  const flushQueue = useCallback(async () => {
    if (!navigator.onLine) return;
    const tasks = await getAllTasks();
    if (tasks.length === 0) return;

    setIsSyncing(true);
    for (const task of tasks) {
      try {
        await updateTaskStatus(task.id, 'syncing');
        const res = await fetch(`${API_BASE}${task.endpoint}`, {
          method: task.method,
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify(task.payload),
        });
        if (res.status === 401) {
          // Session expired while offline — leave it queued; it'll retry
          // once the person logs back in (their new token covers requests
          // made from here on, and unsynced tasks aren't lost).
          throw new Error('Session expired — will retry after re-login.');
        }
        if (!res.ok) throw new Error(`Sync failed with status ${res.status}`);
        await removeTask(task.id);
      } catch (err) {
        console.warn('[Vault] Failed to sync queued action', task.id, err);
        await updateTaskStatus(task.id, 'failed');
      }
    }
    await refreshQueue();
    await markSynced();
    setIsSyncing(false);
  }, [refreshQueue, markSynced]);

  // Queue an action taken while offline (or optimistically while online).
  const queueAction = useCallback(
    async ({ endpoint, method = 'POST', payload, label }) => {
      const task = await enqueueTask({ endpoint, method, payload, label });
      await refreshQueue();

      if (navigator.onLine) {
        // Still fire immediately when online — this only "queues" in the
        // sense of giving us a durable record + retry if it fails mid-flight.
        flushQueue();
      }
      return task;
    },
    [refreshQueue, flushQueue]
  );

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      setJustReconnected(true);
      flushQueue();
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = setTimeout(() => setJustReconnected(false), 4000);
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(reconnectTimer.current);
    };
  }, [flushQueue]);

  const value = {
    isOnline,
    vaultMode: !isOnline,
    justReconnected,
    pendingActions,
    pendingCount: pendingActions.length,
    isSyncing,
    lastSyncedAt,
    queueAction,
    flushQueue,
    markSynced,
    refreshQueue,
  };

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error('useNetwork must be used within a NetworkProvider');
  return ctx;
}
