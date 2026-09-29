import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import { fetchClientRoster } from '../../utils/api.js';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function ClientRoster() {
  const [clients, setClients] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchClientRoster();
        setClients(data);
      } catch (err) {
        setError(err);
      }
    })();
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-10 sm:pt-14">
      <div className="flex items-center gap-2.5">
        <Users className="h-5 w-5 text-gold" strokeWidth={1.75} />
        <h1 className="font-display text-3xl text-platinum">Client roster</h1>
      </div>
      <p className="mt-2 text-sm text-platinum-muted">
        {clients ? `${clients.length} client${clients.length === 1 ? '' : 's'} under management.` : 'Loading your clients...'}
      </p>

      {error && !clients && (
        <p className="mt-6 text-sm text-red-400">
          Couldn't load your client list. Check your connection and try again.
        </p>
      )}

      {clients && (
        <motion.div variants={container} initial="hidden" animate="show" className="mt-8 space-y-3">
          {clients.map((c) => (
            <motion.div key={c.id} variants={item}>
              <Link
                to={`/advisor-portal/clients/${c.id}`}
                className="glass-panel glass-panel-hover flex items-center gap-4 p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-display text-sm text-gold-soft">
                  {c.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-platinum">{c.name}</p>
                  <p className="text-xs text-platinum-faint">{c.email}</p>
                </div>
                {c.totalValue != null && (
                  <div className="shrink-0 text-right">
                    <p className="tnum text-sm text-platinum">
                      ${c.totalValue.toLocaleString('en-US')}
                    </p>
                    <p
                      className={`tnum text-xs ${c.ytdReturn >= 0 ? 'text-emerald-soft' : 'text-red-400'}`}
                    >
                      {c.ytdReturn >= 0 ? '+' : ''}
                      {c.ytdReturn?.toFixed(1)}% YTD
                    </p>
                  </div>
                )}
                <ArrowRight className="h-4 w-4 shrink-0 text-platinum-faint" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
}
