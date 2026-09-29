import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/portal', { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      navigate('/portal', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        <h1 className="mt-5 font-display text-2xl text-platinum">Create your account</h1>
        <p className="mt-1.5 text-sm text-platinum-muted">
          For prospective clients — in production this step is typically completed with your
          advisor after an initial consultation.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="text-xs font-medium text-platinum-muted">
              Full name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-platinum placeholder:text-platinum-faint focus:border-gold/40 focus:outline-none"
              placeholder="Jordan Ellis"
            />
          </div>
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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-platinum placeholder:text-platinum-faint focus:border-gold/40 focus:outline-none"
              placeholder="At least 8 characters"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-semibold text-obsidian-deep transition-transform duration-300 ease-vault hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-platinum-faint">
          Already a client?{' '}
          <Link to="/login" className="text-gold-soft hover:text-gold">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
