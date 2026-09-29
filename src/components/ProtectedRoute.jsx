import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * @param {{ children: React.ReactNode, role?: 'client' | 'advisor' }} props
 */
export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user, checking } = useAuth();
  const location = useLocation();

  if (checking) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-obsidian-deep">
        <div className="font-display text-lg tracking-wide2 text-gold-soft animate-pulse">
          Aureus
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && user?.role !== role) {
    // Signed in, but wrong role for this area — send them to their own home.
    return <Navigate to={user?.role === 'advisor' ? '/advisor-portal' : '/portal'} replace />;
  }

  return children;
}
