import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inbox as InboxIcon, MessageCircle, UserPlus, CheckCircle2, Clock } from 'lucide-react';
import { fetchInbox, resolveInboxItem } from '../../utils/api.js';

const FILTERS = ['All', 'New', 'Messages', 'Leads'];

function timeAgo(timestamp) {
  const mins = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function Inbox() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [resolving, setResolving] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const { data } = await fetchInbox();
      setItems(data);
    } catch (err) {
      setError(err);
    }
  }

  async function handleResolve(inboxItem) {
    setResolving(inboxItem.id);
    try {
      await resolveInboxItem(inboxItem.type, inboxItem.id);
      setItems((prev) =>
        prev.map((i) => (i.id === inboxItem.id ? { ...i, status: 'handled' } : i))
      );
    } catch (err) {
      console.error('[Aureus] Failed to resolve inbox item', err);
    } finally {
      setResolving(null);
    }
  }

  const filtered = useMemo(() => {
    if (!items) return [];
    switch (filter) {
      case 'New':
        return items.filter((i) => i.status === 'new');
      case 'Messages':
        return items.filter((i) => i.type === 'message');
      case 'Leads':
        return items.filter((i) => i.type === 'lead');
      default:
        return items;
    }
  }, [items, filter]);

  const newCount = items?.filter((i) => i.status === 'new').length ?? 0;

  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-10 sm:pt-14">
      <div className="flex items-center gap-2.5">
        <InboxIcon className="h-5 w-5 text-gold" strokeWidth={1.75} />
        <h1 className="font-display text-3xl text-platinum">Inbox</h1>
      </div>
      <p className="mt-2 text-sm text-platinum-muted">
        {items
          ? `${newCount} new item${newCount === 1 ? '' : 's'} of ${items.length} total.`
          : 'Loading...'}
      </p>

      {error && !items && (
        <p className="mt-6 text-sm text-red-400">Couldn't load your inbox. Check your connection.</p>
      )}

      {items && (
        <>
          <div className="mt-6 flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${
                  filter === f
                    ? 'border-gold/50 bg-gold/10 text-gold-soft'
                    : 'border-white/10 bg-white/[0.02] text-platinum-muted hover:bg-white/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="mt-10 text-center text-sm text-platinum-faint">Nothing here.</p>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="mt-6 space-y-3">
              <AnimatePresence>
                {filtered.map((i) => (
                  <motion.article
                    key={i.id}
                    variants={item}
                    exit={{ opacity: 0, x: -12 }}
                    className="glass-panel p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            i.type === 'lead' ? 'bg-emerald/10 text-emerald-soft' : 'bg-gold/10 text-gold'
                          }`}
                        >
                          {i.type === 'lead' ? (
                            <UserPlus className="h-4 w-4" strokeWidth={1.75} />
                          ) : (
                            <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-platinum">{i.from}</p>
                          <p className="text-xs text-platinum-faint">
                            {i.type === 'lead' ? 'Consultation request' : 'Client message'}
                            {i.email ? ` · ${i.email}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {i.status === 'new' && (
                          <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold-soft">
                            New
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px] text-platinum-faint">
                          <Clock className="h-3 w-3" />
                          {timeAgo(i.createdAt)}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-platinum-muted">{i.message}</p>

                    {(i.preferredTime || i.investableAssets) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {i.preferredTime && (
                          <span className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[11px] text-platinum-muted">
                            Prefers: {i.preferredTime}
                          </span>
                        )}
                        {i.investableAssets && (
                          <span className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[11px] text-platinum-muted">
                            {i.investableAssets}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex justify-end">
                      {i.status === 'handled' ? (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-soft">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Handled
                        </span>
                      ) : (
                        <button
                          onClick={() => handleResolve(i)}
                          disabled={resolving === i.id}
                          className="rounded-lg border border-white/10 px-3.5 py-1.5 text-xs font-medium text-platinum-muted transition-colors hover:border-emerald/30 hover:bg-emerald/[0.06] hover:text-emerald-soft disabled:opacity-60"
                        >
                          {resolving === i.id ? 'Marking...' : 'Mark as handled'}
                        </button>
                      )}
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}
    </main>
  );
}
