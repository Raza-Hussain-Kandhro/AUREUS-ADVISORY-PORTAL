import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const CLIENT_LINKS = [
  { to: '/portal', label: 'Overview', end: true },
  { to: '/portal/insights', label: 'Insights' },
  { to: '/portal/advisor', label: 'Advisor' },
  { to: '/portal/settings', label: 'Settings' },
];

const ADVISOR_LINKS = [
  { to: '/advisor-portal', label: 'Client roster', end: true },
  { to: '/advisor-portal/inbox', label: 'Inbox' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const links = user?.role === 'advisor' ? ADVISOR_LINKS : CLIENT_LINKS;

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-30 border-b border-white/[0.06] bg-obsidian-deep/70 backdrop-blur-xl"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <NavLink to="/" className="flex items-center gap-2.5">
          <span className="flex items-center gap-0">
            <img src="/logo.png" alt="logo" className="h-10 w-auto" />
            <span className="font-display text-lg tracking-wide2 text-platinum">Aureus</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-gold-soft' : 'text-platinum-muted hover:text-platinum'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm text-platinum">{user?.name}</p>
            <p className="text-xs text-platinum-faint capitalize">{user?.role}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-display text-sm text-gold-soft">
            {user?.initials}
          </div>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
            className="hidden rounded-full p-2 text-platinum-muted transition-colors hover:bg-white/5 hover:text-platinum md:flex"
          >
            <LogOut className="h-4.5 w-4.5" strokeWidth={1.75} />
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="rounded-full p-2 text-platinum-muted transition-colors hover:bg-white/5 hover:text-platinum md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/[0.06] md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-3">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-platinum-muted hover:bg-white/5 hover:text-platinum"
                >
                  {l.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="mt-1 rounded-lg px-3 py-2.5 text-left text-sm text-platinum-muted hover:bg-white/5 hover:text-platinum"
              >
                Log out
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
