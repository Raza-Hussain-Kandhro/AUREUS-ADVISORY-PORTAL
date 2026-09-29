import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

function timeAgo(timestamp) {
  if (!timestamp) return 'a while ago';
  const mins = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hours = Math.round(mins / 60);
  return `${hours} hr${hours === 1 ? '' : 's'} ago`;
}

/**
 * @param {{ visible: boolean, lastSyncedAt: number | null }} props
 */
export default function OfflineBanner({ visible, lastSyncedAt }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-3">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginTop: 'env(safe-area-inset-top, 0px)' }}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-vault-amber/30 bg-obsidian-surface/90 px-4 py-2 shadow-glass backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-breathe rounded-full bg-vault-amber" />
            </span>
            <ShieldCheck className="h-3.5 w-3.5 text-vault-amber" strokeWidth={1.75} />
            <span className="text-xs font-medium text-platinum">
              Offline · Viewing cached portfolio
            </span>
            <span className="text-xs text-platinum-faint">
              (Last synced: {timeAgo(lastSyncedAt)})
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
