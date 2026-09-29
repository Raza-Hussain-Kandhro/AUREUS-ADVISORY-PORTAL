import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1';

const ASSET_RANGES = ['$1M–$5M', '$5M–$25M', '$25M–$100M', '$100M+'];

export default function PublicContact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', investableAssets: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Something went wrong.');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  }

  if (status === 'success') {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-32 text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald/10 border border-emerald/25"
        >
          <CheckCircle2 className="h-7 w-7 text-emerald-soft" />
        </motion.div>
        <h1 className="mt-6 font-display text-2xl text-platinum">Request received</h1>
        <p className="mt-3 text-sm leading-relaxed text-platinum-muted">
          Thank you, {form.name.split(' ')[0]}. A member of our team will reach out within one
          business day to schedule your consultation.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-20">
      <p className="text-sm font-medium text-gold-soft">Get started</p>
      <h1 className="mt-3 font-display text-4xl text-platinum">Request a consultation.</h1>
      <p className="mt-4 text-sm leading-relaxed text-platinum-muted">
        Tell us a little about your situation and a senior advisor will follow up directly —
        no call center, no automated triage.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="name" className="text-xs font-medium text-platinum-muted">
            Full name
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-platinum placeholder:text-platinum-faint focus:border-gold/40 focus:outline-none"
            placeholder="Jordan Ellis"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="text-xs font-medium text-platinum-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-platinum placeholder:text-platinum-faint focus:border-gold/40 focus:outline-none"
              placeholder="jordan@email.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-xs font-medium text-platinum-muted">
              Phone <span className="text-platinum-faint">(optional)</span>
            </label>
            <input
              id="phone"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-platinum placeholder:text-platinum-faint focus:border-gold/40 focus:outline-none"
              placeholder="(555) 000-0000"
            />
          </div>
        </div>

        <div>
          <span className="text-xs font-medium text-platinum-muted">Investable assets</span>
          <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ASSET_RANGES.map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => update('investableAssets', r)}
                className={`rounded-lg border px-3 py-2 text-xs transition-colors ${
                  form.investableAssets === r
                    ? 'border-gold/50 bg-gold/10 text-gold-soft'
                    : 'border-white/10 bg-white/[0.02] text-platinum-muted hover:bg-white/5'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="text-xs font-medium text-platinum-muted">
            What would you like to discuss?
          </label>
          <textarea
            id="message"
            required
            rows={4}
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-platinum placeholder:text-platinum-faint focus:border-gold/40 focus:outline-none"
            placeholder="A little about your goals and current situation..."
          />
        </div>

        {status === 'error' && (
          <p className="text-xs text-red-400">{error || 'Something went wrong. Please try again.'}</p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-semibold text-obsidian-deep transition-transform duration-300 ease-vault hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
        >
          {status === 'submitting' && <Loader2 className="h-4 w-4 animate-spin" />}
          {status === 'submitting' ? 'Sending...' : 'Request consultation'}
        </button>
      </form>
    </div>
  );
}
