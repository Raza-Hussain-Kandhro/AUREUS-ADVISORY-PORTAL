import React, { useEffect, useState } from 'react';
import { Trash2, HardDrive, Wifi, WifiOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNetwork } from '../../context/NetworkContext.jsx';
import { queueStore, snapshotStore } from '../../utils/indexedDB.js';

function formatBytes(bytes) {
  if (!bytes) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return mb < 1 ? `${Math.round(bytes / 1024)} KB` : `${mb.toFixed(1)} MB`;
}

function timeAgo(timestamp) {
  if (!timestamp) return 'never';
  const mins = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hours = Math.round(mins / 60);
  return `${hours} hr${hours === 1 ? '' : 's'} ago`;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { isOnline, lastSyncedAt, pendingCount, flushQueue } = useNetwork();
  const [storageEstimate, setStorageEstimate] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    (async () => {
      if (navigator.storage?.estimate) {
        const est = await navigator.storage.estimate();
        setStorageEstimate(est);
      }
    })();
  }, [cleared]);

  async function handleClearCache() {
    setClearing(true);
    try {
      // Clear our IndexedDB stores (cached snapshots + offline queue)...
      await snapshotStore.clear();
      await queueStore.clear();
      // ...and the Cache Storage entries Workbox maintains for the app
      // shell and API responses.
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    } finally {
      setClearing(false);
    }
  }

  const usedPct = storageEstimate?.quota
    ? Math.min(100, Math.round((storageEstimate.usage / storageEstimate.quota) * 100))
    : 0;

  return (
    <main className="mx-auto max-w-2xl px-5 pb-28 pt-10 sm:pt-14">
      <h1 className="font-display text-3xl text-platinum">Account & security</h1>
      <p className="mt-2 text-sm text-platinum-muted">
        Manage your session, offline storage, and connection state.
      </p>

      {/* Account */}
      <section className="glass-panel mt-8 p-6">
        <h2 className="font-display text-lg text-platinum">Account</h2>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between border-b border-white/[0.06] pb-3">
            <span className="text-platinum-muted">Name</span>
            <span className="text-platinum">{user?.name}</span>
          </div>
          <div className="flex justify-between border-b border-white/[0.06] pb-3">
            <span className="text-platinum-muted">Email</span>
            <span className="text-platinum">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-platinum-muted">Role</span>
            <span className="capitalize text-platinum">{user?.role}</span>
          </div>
        </div>
      </section>

      {/* Offline state management */}
      <section className="glass-panel mt-5 p-6">
        <h2 className="font-display text-lg text-platinum">Offline state</h2>
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          {isOnline ? (
            <Wifi className="h-5 w-5 shrink-0 text-emerald-soft" strokeWidth={1.75} />
          ) : (
            <WifiOff className="h-5 w-5 shrink-0 text-vault-amber" strokeWidth={1.75} />
          )}
          <div className="flex-1">
            <p className="text-sm text-platinum">{isOnline ? 'Connected' : 'Vault Mode — offline'}</p>
            <p className="text-xs text-platinum-faint">Last synced {timeAgo(lastSyncedAt)}</p>
          </div>
          {pendingCount > 0 && (
            <span className="rounded-full border border-gold/20 bg-gold/[0.08] px-3 py-1 text-xs text-gold-soft">
              {pendingCount} pending
            </span>
          )}
        </div>
        {pendingCount > 0 && isOnline && (
          <button
            onClick={flushQueue}
            className="mt-3 text-xs font-medium text-gold-soft hover:text-gold"
          >
            Retry syncing now
          </button>
        )}
      </section>

      {/* Storage quota */}
      <section className="glass-panel mt-5 p-6">
        <div className="flex items-center gap-2">
          <HardDrive className="h-4.5 w-4.5 text-platinum-muted" strokeWidth={1.75} />
          <h2 className="font-display text-lg text-platinum">Device storage</h2>
        </div>

        {storageEstimate ? (
          <>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gold transition-all duration-700 ease-vault"
                style={{ width: `${usedPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-platinum-faint">
              {formatBytes(storageEstimate.usage)} used of {formatBytes(storageEstimate.quota)}{' '}
              available ({usedPct}%)
            </p>
          </>
        ) : (
          <p className="mt-3 text-xs text-platinum-faint">
            Storage estimates aren't available in this browser.
          </p>
        )}

        <button
          onClick={handleClearCache}
          disabled={clearing}
          className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-platinum-muted transition-colors hover:border-red-500/30 hover:bg-red-500/[0.06] hover:text-red-400 disabled:opacity-60"
        >
          {cleared ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-soft" />
              Cache cleared
            </>
          ) : (
            <>
              <Trash2 className="h-3.5 w-3.5" />
              {clearing ? 'Clearing...' : 'Clear cached data'}
            </>
          )}
        </button>
        <p className="mt-2 text-[11px] text-platinum-faint">
          Removes cached portfolio snapshots and offline data from this device. Any actions still
          queued for sync are also cleared — make sure you're online first if you have pending
          actions.
        </p>
      </section>
    </main>
  );
}
