import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye } from 'lucide-react';
import NetWorthDisplay from '../../components/NetWorthDisplay.jsx';
import AllocationDonut from '../../components/AllocationDonut.jsx';
import PortfolioChart from '../../components/PortfolioChart.jsx';
import { fetchClientDetail } from '../../utils/api.js';

export default function ClientDetail() {
  const { clientId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(null);
    (async () => {
      try {
        const { data: body } = await fetchClientDetail(clientId);
        setData(body);
      } catch (err) {
        setError(err);
      }
    })();
  }, [clientId]);

  if (error && !data) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="text-sm text-red-400">Couldn't load this client's portfolio.</p>
        <Link to="/advisor-portal" className="mt-3 inline-block text-xs text-gold-soft hover:text-gold">
          Back to roster
        </Link>
      </main>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
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

  const { client, portfolio } = data;

  return (
    <main className="mx-auto max-w-5xl px-5 pb-28 pt-10 sm:pt-14">
      <Link
        to="/advisor-portal"
        className="flex items-center gap-1.5 text-xs text-platinum-muted hover:text-platinum"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Client roster
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-display text-sm text-gold-soft">
            {client.initials}
          </div>
          <div>
            <h1 className="font-display text-2xl text-platinum">{client.name}</h1>
            <p className="text-xs text-platinum-faint">Advisor view — read only</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-platinum-muted">
          <Eye className="h-3 w-3" />
          Viewing as advisor
        </span>
      </div>

      <section className="mt-8">
        <NetWorthDisplay
          value={portfolio.totalValue}
          ytdReturnPct={portfolio.ytdReturn}
          asOf={new Date(portfolio.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
      </section>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <section className="glass-panel p-6">
          <AllocationDonut allocation={portfolio.assetAllocation} />
        </section>
        <section className="glass-panel p-6">
          <PortfolioChart history={portfolio.historicalPerformance} />
        </section>
      </div>
    </main>
  );
}
