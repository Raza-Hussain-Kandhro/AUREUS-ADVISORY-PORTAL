import React from 'react';
import { motion } from 'framer-motion';

const team = [
  { name: 'Raza Hussain', role: 'Senior Wealth Advisor', initials: 'RH' },
  { name: 'Ateeq', role: 'Head of Private Markets', initials: 'AO' },
  { name: 'Qadeer', role: 'Director of Planning', initials: 'LM' },
];

export default function PublicAbout() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-sm font-medium text-gold-soft"
      >
        About Aureus
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="mt-3 font-display text-4xl text-platinum sm:text-5xl"
      >
        A small firm, on purpose.
      </motion.h1>

      <div className="mt-8 space-y-5 text-sm leading-relaxed text-platinum-muted">
        <p>
          Aureus Capital Management was founded on a simple observation: as advisory firms grow,
          clients see their advisor less, not more. We built Aureus to stay deliberately small —
          each advisor holds a limited number of client relationships, by design, so quarterly
          reviews are a floor rather than a ceiling.
        </p>
        <p>
          We manage discretionary portfolios across public equities, fixed income, private
          markets, and real assets, and we coordinate directly with each client's estate attorney
          and accountant rather than working in isolation. Every client gets a dedicated advisor
          and full portfolio transparency through the Aureus portal — built to work as reliably
          offline as it does at a desk.
        </p>
      </div>

      <div className="mt-14">
        <h2 className="font-display text-xl text-platinum">Leadership</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {team.map((t) => (
            <div key={t.name} className="glass-panel p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-display text-sm text-gold-soft">
                {t.initials}
              </div>
              <p className="mt-3 text-sm font-medium text-platinum">{t.name}</p>
              <p className="text-xs text-platinum-faint">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
