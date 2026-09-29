import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-30 border-b border-white/[0.06] bg-obsidian-deep/70 backdrop-blur-xl"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2.5">
  <span className="flex items-center gap-0">
    <img src="/logo.png" alt="logo" className="h-10 w-auto" />
    <span className="font-display text-lg tracking-wide2 text-platinum">Aureus</span>
  </span>
  <span className="hidden text-xs text-platinum-faint sm:inline">Capital Management</span>
</Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-gold-soft' : 'text-platinum-muted hover:text-platinum'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/login"
            className="rounded-lg border border-gold/30 bg-gold/[0.08] px-4 py-2 text-sm font-medium text-gold-soft transition-colors hover:bg-gold/[0.14]"
          >
            Client login
          </Link>
        </nav>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="rounded-full p-2 text-platinum-muted hover:bg-white/5 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
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
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-platinum-muted hover:bg-white/5 hover:text-platinum"
                >
                  {l.label}
                </NavLink>
              ))}
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-lg bg-gold px-3 py-2.5 text-center text-sm font-medium text-obsidian-deep"
              >
                Client login
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
