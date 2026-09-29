import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, MessageCircle, ArrowRight } from 'lucide-react';
import NetWorthDisplay from '../../components/NetWorthDisplay.jsx';
import AllocationDonut from '../../components/AllocationDonut.jsx';
import PortfolioChart from '../../components/PortfolioChart.jsx';
import ActionQueueModal from '../../components/ActionQueueModal.jsx';
import MagneticButton from '../../components/MagneticButton.jsx';
import { useNetwork } from '../../context/NetworkContext.jsx';
import { usePortalData } from '../PortalLayout.jsx';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function OverviewPage() {
  const { portfolio, insights } = usePortalData();
  const { isOnline, queueAction, pendingCount } = useNetwork();
  const [modal, setModal] = useState({ open: false, label: '', queued: false, pending: null });

  function requestOfflineAction(label, pendingTask) {
    if (isOnline) {
      queueAction(pendingTask);
      return;
    }
    setModal({ open: true, label, queued: false, pending: pendingTask });
  }

  async function confirmQueue() {
    if (modal.pending) await queueAction(modal.pending);
    setModal((m) => ({ ...m, queued: true }));
  }

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-5xl px-5 pb-28 pt-10 sm:pt-14"
    >
      <motion.section variants={cardVariants} className="mb-10">
        <NetWorthDisplay
          value={portfolio.totalValue}
          ytdReturnPct={portfolio.ytdReturn}
          asOf={new Date(portfolio.lastUpdated).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <MagneticButton
            onClick={() =>
              requestOfflineAction('Contact advisor', {
                endpoint: '/advisor/contact',
                method: 'POST',
                payload: { message: 'Client requested a call back.', requestedAt: Date.now() },
                label: 'Contact advisor',
              })
            }
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-platinum transition-colors duration-300 ease-vault hover:border-gold/30 hover:bg-white/[0.05]"
          >
            <MessageCircle className="h-4 w-4 text-gold" strokeWidth={1.75} />
            Contact advisor
          </MagneticButton>

          <button
            onClick={() =>
              requestOfflineAction('Authorize trade', {
                endpoint: '/sync',
                method: 'POST',
                payload: { action: 'authorize_trade', requestedAt: Date.now() },
                label: 'Authorize trade',
              })
            }
            className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-300 ease-vault"
            style={
              isOnline
                ? { background: '#D4AF37', color: '#0B0F19' }
                : { background: 'rgba(255,255,255,0.03)', color: '#6B7280', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {!isOnline && <Lock className="h-3.5 w-3.5" />}
            Authorize trade
          </button>

          {pendingCount > 0 && (
            <span className="flex items-center rounded-xl border border-gold/20 bg-gold/[0.06] px-4 py-3 text-xs text-gold-soft">
              {pendingCount} queued action{pendingCount === 1 ? '' : 's'} awaiting sync
            </span>
          )}
        </div>
      </motion.section>

      <div className="grid gap-5 sm:grid-cols-2">
        <motion.section variants={cardVariants} className="glass-panel p-6">
          <AllocationDonut allocation={portfolio.assetAllocation} />
        </motion.section>

        <motion.section variants={cardVariants} className="glass-panel p-6">
          <PortfolioChart history={portfolio.historicalPerformance} />
        </motion.section>
      </div>

      <motion.section variants={cardVariants} className="mt-5">
        <div className="glass-panel flex items-center justify-between p-6">
          <div>
            <h3 className="font-display text-lg text-platinum">Advisory insights</h3>
            <p className="mt-1 text-sm text-platinum-muted">
              {insights.length} briefs available{insights.some((i) => i.cachedOffline) ? ', most cached offline' : ''}.
            </p>
          </div>
          <Link
            to="/portal/insights"
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2.5 text-xs font-medium text-platinum-muted transition-colors hover:bg-white/5 hover:text-platinum"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </motion.section>

      <ActionQueueModal
        open={modal.open}
        actionLabel={modal.label}
        queued={modal.queued}
        onClose={() => setModal({ open: false, label: '', queued: false, pending: null })}
        onConfirmQueue={confirmQueue}
      />
    </motion.main>
  );
}
