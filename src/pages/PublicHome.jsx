import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, LineChart, Users, ArrowRight } from 'lucide-react';

const pillars = [
  {
    icon: LineChart,
    title: 'Discretionary portfolio management',
    body: 'Active allocation across public equities, fixed income, and private markets — built around your risk tolerance and liquidity needs, not a model portfolio.',
  },
  {
    icon: ShieldCheck,
    title: 'Estate & tax coordination',
    body: 'We work directly with your attorneys and accountants so your investment strategy and your estate plan pull in the same direction.',
  },
  {
    icon: Users,
    title: 'A dedicated advisor, not a call center',
    body: 'One senior advisor who knows your full financial picture, reachable directly — with quarterly reviews as a floor, not a ceiling.',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function PublicHome() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-20 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm font-medium text-gold-soft"
          >
            Private investment advisory
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-4xl leading-tight text-platinum sm:text-5xl md:text-6xl"
          >
            Wealth management built for one client at a time.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-platinum-muted"
          >
            Aureus Capital Management is a boutique advisory for individuals and families who
            want direct access to the person managing their money — and a portfolio view that
            works as well on a plane with no signal as it does at your desk.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/contact"
              className="flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-obsidian-deep transition-transform duration-300 ease-vault hover:scale-[1.02] active:scale-[0.98]"
            >
              Request a consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-platinum-muted transition-colors hover:bg-white/5 hover:text-platinum"
            >
              Existing client login
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="mx-auto max-w-5xl px-5 pb-20"
      >
        <div className="grid gap-5 sm:grid-cols-3">
          {pillars.map((p) => (
            <motion.div key={p.title} variants={item} className="glass-panel p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
                <p.icon className="h-4.5 w-4.5 text-gold" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-display text-lg text-platinum">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-platinum-muted">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Portal preview strip */}
      <section className="border-t border-white/[0.06] px-5 py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gold-soft">The client portal</p>
            <h2 className="mt-3 font-display text-3xl text-platinum sm:text-4xl">
              Your full portfolio, even offline.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-platinum-muted">
              Install the Aureus portal to your phone and your last-synced portfolio, market
              research, and advisor messages stay available with zero connection — on a flight,
              in transit, or anywhere your signal doesn't reach.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-soft hover:text-gold"
            >
              See the client portal
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="glass-panel p-6">
            <p className="text-xs text-platinum-faint">Total portfolio value</p>
            <p className="tnum mt-2 font-display text-4xl text-platinum">$12,450,000</p>
            <span className="tnum mt-3 inline-flex items-center rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-medium text-emerald-soft">
              +12.4% YTD
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
