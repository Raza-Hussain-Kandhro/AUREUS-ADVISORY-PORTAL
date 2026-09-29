import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';
import ActionQueueModal from '../../components/ActionQueueModal.jsx';
import { useNetwork } from '../../context/NetworkContext.jsx';

const TIME_SLOTS = ['Tomorrow morning', 'Tomorrow afternoon', 'This week', 'Next week', "I'll specify a time"];

export default function AdvisorPage() {
  const { isOnline, queueAction } = useNetwork();
  const [message, setMessage] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [modal, setModal] = useState({ open: false, queued: false });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;

    if (!isOnline) {
      setModal({ open: true, queued: false });
      return;
    }

    setSubmitting(true);
    await queueAction({
      endpoint: '/advisor/contact',
      method: 'POST',
      payload: { message, preferredTime: preferredTime || null, requestedAt: Date.now() },
      label: 'Advisor meeting request',
    });
    setSubmitting(false);
    setSent(true);
  }

  async function confirmQueueFromModal() {
    await queueAction({
      endpoint: '/advisor/contact',
      method: 'POST',
      payload: { message, preferredTime: preferredTime || null, requestedAt: Date.now() },
      label: 'Advisor meeting request',
    });
    setModal({ open: true, queued: true });
  }

  if (sent) {
    return (
      <main className="mx-auto flex max-w-xl flex-col items-center px-5 py-32 text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald/10 border border-emerald/25"
        >
          <CheckCircle2 className="h-7 w-7 text-emerald-soft" />
        </motion.div>
        <h1 className="mt-6 font-display text-2xl text-platinum">Request sent</h1>
        <p className="mt-3 text-sm leading-relaxed text-platinum-muted">
          Your advisor will follow up shortly{preferredTime ? ` for ${preferredTime.toLowerCase()}` : ''}.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setMessage('');
            setPreferredTime('');
          }}
          className="mt-6 text-xs font-medium text-gold-soft hover:text-gold"
        >
          Send another request
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-5 pb-28 pt-10 sm:pt-14">
      <h1 className="font-display text-3xl text-platinum">Contact your advisor</h1>
      <p className="mt-2 text-sm text-platinum-muted">
        Send a message or request a meeting. If you're offline, it'll be queued and delivered the
        moment your connection returns.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <span className="text-xs font-medium text-platinum-muted">When works for you?</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                type="button"
                key={slot}
                onClick={() => setPreferredTime(slot)}
                className={`rounded-lg border px-3.5 py-2 text-xs transition-colors ${
                  preferredTime === slot
                    ? 'border-gold/50 bg-gold/10 text-gold-soft'
                    : 'border-white/10 bg-white/[0.02] text-platinum-muted hover:bg-white/5'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="text-xs font-medium text-platinum-muted">
            Message
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-platinum placeholder:text-platinum-faint focus:border-gold/40 focus:outline-none"
            placeholder="What would you like to discuss?"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-semibold text-obsidian-deep transition-transform duration-300 ease-vault hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {submitting ? 'Sending...' : 'Send to advisor'}
        </button>
      </form>

      <ActionQueueModal
        open={modal.open}
        actionLabel="Advisor meeting request"
        queued={modal.queued}
        onClose={() => {
          setModal({ open: false, queued: false });
          if (modal.queued) setSent(true);
        }}
        onConfirmQueue={confirmQueueFromModal}
      />
    </main>
  );
}
