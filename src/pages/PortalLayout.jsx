import React, { useEffect, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import OfflineBanner from '../components/OfflineBanner.jsx';
import InstallPWA from '../components/InstallPWA.jsx';
import { useNetwork } from '../context/NetworkContext.jsx';
import { fetchPortfolio, fetchInsights } from '../utils/api.js';

export default function PortalLayout() {
  const { vaultMode, lastSyncedAt, markSynced } = useNetwork();
  const [portfolio, setPortfolio] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [p, i] = await Promise.all([fetchPortfolio(), fetchInsights()]);
        if (cancelled) return;
        setPortfolio(p.data);
        setInsights(i.data);
        if (!p.fromCache) await markSynced();
      } catch (err) {
        if (!cancelled) setLoadError(err);
        console.error('[Aureus] Failed to load portal data', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-obsidian-deep">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="font-display text-lg tracking-wide2 text-gold-soft"
        >
          Aureus
        </motion.div>
      </div>
    );
  }

  if (loadError && !portfolio) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-obsidian-deep px-5 text-center">
        <p className="font-display text-xl text-platinum">Couldn't load your portfolio</p>
        <p className="max-w-sm text-sm text-platinum-muted">
          You appear to be offline with no cached data yet on this device. Reconnect once to sync
          your portfolio, and it'll be available offline from then on.
        </p>
      </div>
    );
  }

  return (
    <div className={vaultMode ? 'vault-mode min-h-dvh' : 'vault-mode-off min-h-dvh'}>
      <OfflineBanner visible={vaultMode} lastSyncedAt={lastSyncedAt} />
      <Navbar />
      <Outlet context={{ portfolio, insights }} />
      <InstallPWA />
    </div>
  );
}

/** Convenience hook so nested portal pages don't repeat the outlet-context type. */
export function usePortalData() {
  return useOutletContext();
}
