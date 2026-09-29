import React from 'react';
import { motion } from 'framer-motion';
import { useOdometer } from '../hooks/useOdometer.js';

/**
 * @param {{ value: number, currency?: string, ytdReturnPct: number, asOf?: string }} props
 */
export default function NetWorthDisplay({ value, currency = 'USD', ytdReturnPct, asOf }) {
  const rolled = useOdometer(value, { duration: 1.9, decimals: 2 });
  const isPositive = ytdReturnPct >= 0;

  return (
    <div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-sm text-platinum-muted tracking-wide2"
      >
        Total portfolio value
      </motion.p>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-3xl text-platinum-muted sm:text-4xl">
          {currency === 'USD' ? '$' : currency}
        </span>
        <h1 className="tnum font-display text-5xl leading-none text-platinum sm:text-6xl md:text-7xl">
          {rolled}
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 flex items-center gap-3"
      >
        <span
          className={`tnum inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
            isPositive
              ? 'bg-emerald/10 text-emerald-soft border border-emerald/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}
        >
          {isPositive ? '+' : ''}
          {ytdReturnPct.toFixed(1)}% YTD
        </span>
        {asOf && <span className="text-xs text-platinum-faint">as of {asOf}</span>}
      </motion.div>
    </div>
  );
}
