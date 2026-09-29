import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Clock3, X } from 'lucide-react';

/**
 * @param {{
 *   open: boolean,
 *   actionLabel: string,
 *   onClose: () => void,
 *   onConfirmQueue: () => void,
 *   queued?: boolean
 * }} props
 */
export default function ActionQueueModal({ open, actionLabel, onClose, onConfirmQueue, queued }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="action-queue-title"
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="glass-panel mx-3 mb-3 rounded-t-3xl rounded-b-2xl border-white/10 p-6"
              style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-vault-amber/10 border border-vault-amber/30">
                  <Lock className="h-5 w-5 text-vault-amber" strokeWidth={1.75} />
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-full p-2 text-platinum-faint hover:bg-white/5 hover:text-platinum transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <h2 id="action-queue-title" className="mt-4 font-display text-xl text-platinum">
                {queued ? 'Queued for secure sync' : `${actionLabel} needs a connection`}
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-platinum-muted">
                {queued ? (
                  <>
                    Your request has been saved and will be securely executed the moment your
                    connection returns. No need to repeat it.
                  </>
                ) : (
                  <>
                    You're in Vault Mode. This action will be queued and securely executed when
                    your connection is restored — nothing is lost.
                  </>
                )}
              </p>

              {!queued && (
                <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-xs text-platinum-faint">
                  <Clock3 className="h-3.5 w-3.5 shrink-0" />
                  Delivered automatically on reconnect — usually within seconds.
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-medium text-platinum-muted transition-colors hover:bg-white/5"
                >
                  {queued ? 'Done' : 'Cancel'}
                </button>
                {!queued && (
                  <button
                    onClick={onConfirmQueue}
                    className="flex-1 rounded-xl bg-gold py-3 text-sm font-semibold text-obsidian-deep transition-transform duration-300 ease-vault hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Queue action
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
