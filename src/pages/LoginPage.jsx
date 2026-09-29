import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const DEMO_ACCOUNTS = [
  
  { label: 'Client — Amara Reyes', email: 'amara@aureuscapital.demo' },
  { label: 'Client — Ibrahim Reyes', email: 'ibrahim@aureuscapital.demo' },
  { label: 'Advisor — Raza Hussain', email: 'raza@aureuscapital.demo' },
  
];
const DEMO_PASSWORD = 'Aureus2026!';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'advisor' ? '/advisor-portal' : '/portal', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const loggedInUser = await login(email, password);
      const redirectTo =
        location.state?.from ?? (loggedInUser.role === 'advisor' ? '/advisor-portal' : '/portal');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(demoEmail) {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-obsidian-radial px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel w-full max-w-md p-8"
      >
        <Link to="/" className="font-display text-lg tracking-wide2 text-platinum">
          Aureus
        </Link>
        <h1 className="mt-5 font-display text-2xl text-platinum">Welcome back</h1>
        <p className="mt-1.5 text-sm text-platinum-muted">Log in to view your portfolio.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-xs font-medium text-platinum-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-platinum placeholder:text-platinum-faint focus:border-gold/40 focus:outline-none"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-medium text-platinum-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-platinum placeholder:text-platinum-faint focus:border-gold/40 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-semibold text-obsidian-deep transition-transform duration-300 ease-vault hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-platinum-faint">
          New client?{' '}
          <Link to="/register" className="text-gold-soft hover:text-gold">
            Create an account
          </Link>
        </p>

        <div className="mt-7 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-[11px] font-medium text-platinum-muted">Demo accounts (password: {DEMO_PASSWORD})</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => fillDemo(acc.email)}
                className="rounded-lg px-2.5 py-1.5 text-left text-xs text-platinum-muted transition-colors hover:bg-white/5 hover:text-gold-soft"
              >
                {acc.label} <span className="text-platinum-faint">— {acc.email}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
