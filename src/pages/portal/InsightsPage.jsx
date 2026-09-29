import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, FileText } from 'lucide-react';
import { usePortalData } from '../PortalLayout.jsx';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function InsightsPage() {
  const { insights } = usePortalData();

  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-10 sm:pt-14">
      <h1 className="font-display text-3xl text-platinum">Advisory insights</h1>
      <p className="mt-2 text-sm text-platinum-muted">
        Research and market commentary curated for your portfolio. Items marked available
        offline are cached to this device.
      </p>

      <motion.div variants={container} initial="hidden" animate="show" className="mt-8 space-y-4">
        {insights.map((insight) => (
          <motion.article key={insight.title} variants={item} className="glass-panel glass-panel-hover p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-platinum-muted">
                <FileText className="h-4.5 w-4.5" strokeWidth={1.75} />
              </div>
              {insight.cachedOffline && (
                <span
                  title="Available offline"
                  className="flex shrink-0 items-center gap-1 text-[11px] text-emerald-soft"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Offline
                </span>
              )}
            </div>

            <p className="mt-4 text-[11px] font-medium text-gold-dim">{insight.category}</p>
            <h2 className="mt-1 font-display text-lg text-platinum">{insight.title}</h2>
            <p className="mt-1.5 text-xs text-platinum-faint">{insight.date}</p>
            {insight.body && (
              <p className="mt-3 text-sm leading-relaxed text-platinum-muted">{insight.body}</p>
            )}
          </motion.article>
        ))}
      </motion.div>
    </main>
  );
}
