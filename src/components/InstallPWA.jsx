import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { snapshotStore } from '../utils/indexedDB.js';

const VISIT_COUNT_KEY = 'visit_count';
const DISMISSED_KEY = 'install_prompt_dismissed';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    function onBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }
    function onAppInstalled() {
      setInstalled(true);
      setVisible(false);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  // Show the bespoke prompt on the *second* visit, once a native prompt is
  // available and the person hasn't already dismissed it this session.
  useEffect(() => {
    (async () => {
      const alreadyStandalone =
        window.matchMedia?.('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
      if (alreadyStandalone) return;

      const dismissed = await snapshotStore.getItem(DISMISSED_KEY);
      if (dismissed) return;

      const visits = ((await snapshotStore.getItem(VISIT_COUNT_KEY)) ?? 0) + 1;
      await snapshotStore.setItem(VISIT_COUNT_KEY, visits);

      if (visits >= 2 && deferredPrompt) {
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    })();
  }, [deferredPrompt]);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  }

  async function handleDismiss() {
    setVisible(false);
    await snapshotStore.setItem(DISMISSED_KEY, true);
  }

  if (installed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          exit={{ y: '110%' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg px-3"
          style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="glass-panel flex items-center gap-4 rounded-2xl p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-obsidian-surface to-obsidian-deep ring-1 ring-gold/30">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 font-display text-sm text-gold-soft">
                A
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-platinum">Install the Aureus Portal</p>
              <p className="mt-0.5 text-xs leading-snug text-platinum-muted">
                Instant, offline access to your portfolio — right from your home screen.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-1.5">
              <button
                onClick={handleInstall}
                className="shimmer-surface relative overflow-hidden rounded-lg bg-gold px-4 py-2 text-xs font-semibold text-obsidian-deep"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  Install
                </span>
              </button>
              <button
                onClick={handleDismiss}
                className="flex items-center justify-center gap-1 text-[11px] text-platinum-faint hover:text-platinum-muted"
              >
                <X className="h-3 w-3" />
                Not now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
