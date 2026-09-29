import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, ShieldCheck, Users, Building2, Globe2, FileText } from 'lucide-react';

const services = [
  {
    icon: LineChart,
    title: 'Discretionary portfolio management',
    body: 'Active, tax-aware allocation across public equities, fixed income, and alternatives. We rebalance around drift bands rather than a calendar, so trades happen when they matter.',
  },
  {
    icon: Building2,
    title: 'Private markets access',
    body: 'Direct and fund-of-fund access to private equity, private credit, and infrastructure — asset classes most retail platforms simply can\u2019t offer.',
  },
  {
    icon: Globe2,
    title: 'Multi-currency & cross-border planning',
    body: 'For clients with assets, income, or family across more than one jurisdiction, including currency hedging and cross-border tax coordination.',
  },
  {
    icon: ShieldCheck,
    title: 'Estate & trust coordination',
    body: 'We work alongside your estate attorney to keep your investment structure aligned with your trust and gifting strategy, not built separately from it.',
  },
  {
    icon: FileText,
    title: 'Tax-aware planning',
    body: 'Coordinated with your accountant year-round — not just at filing season — including loss harvesting and charitable giving strategy.',
  },
  {
    icon: Users,
    title: 'Family governance',
    body: 'For multi-generational families, structured conversations and reporting that bring the next generation into the picture on your timeline.',
  },
];

export default function PublicServices() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-20">
      <p className="text-sm font-medium text-gold-soft">Services</p>
      <h1 className="mt-3 font-display text-4xl text-platinum sm:text-5xl">
        What we do for clients.
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-platinum-muted">
        Every engagement starts with discretionary portfolio management — the rest is built
        around what your specific situation actually needs, not a fixed package.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel p-6"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
              <s.icon className="h-4.5 w-4.5 text-gold" strokeWidth={1.75} />
            </div>
            <h3 className="mt-4 font-display text-base text-platinum">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-platinum-muted">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
