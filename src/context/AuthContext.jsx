import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getToken, getStoredUser, setSession, clearSession, authHeaders } from '../utils/authToken.js';

const AuthContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [checking, setChecking] = useState(true);

  // On load, verify the stored token is still valid (not expired/revoked)
  // rather than trusting the cached user object indefinitely.
  useEffect(() => {
    (async () => {
      const token = getToken();
      if (!token) {
        setChecking(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
        if (!res.ok) throw new Error('Session invalid');
        const { user: freshUser } = await res.json();
        setUser(freshUser);
        setSession(token, freshUser);
      } catch {
        // Offline on first load with a cached user is fine — keep them
        // logged in optimistically rather than bouncing to /login.
        if (!navigator.onLine) {
          setChecking(false);
          return;
        }
        clearSession();
        setUser(null);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || 'Login failed.');
    setSession(body.token, body.user);
    setUser(body.user);
    return body.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || 'Registration failed.');
    setSession(body.token, body.user);
    setUser(body.user);
    return body.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdvisor: user?.role === 'advisor',
    checking,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
