import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

import PublicLayout from './pages/PublicLayout.jsx';
import PublicHome from './pages/PublicHome.jsx';
import PublicAbout from './pages/PublicAbout.jsx';
import PublicServices from './pages/PublicServices.jsx';
import PublicContact from './pages/PublicContact.jsx';

import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

import PortalLayout from './pages/PortalLayout.jsx';
import OverviewPage from './pages/portal/OverviewPage.jsx';
import InsightsPage from './pages/portal/InsightsPage.jsx';
import AdvisorPage from './pages/portal/AdvisorPage.jsx';
import SettingsPage from './pages/portal/SettingsPage.jsx';

import AdvisorLayout from './pages/advisor/AdvisorLayout.jsx';
import ClientRoster from './pages/advisor/ClientRoster.jsx';
import ClientDetail from './pages/advisor/ClientDetail.jsx';
import Inbox from './pages/advisor/Inbox.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';

function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-obsidian-deep px-5 text-center">
      <p className="font-display text-2xl text-platinum">Page not found</p>
      <Link to="/" className="text-sm text-gold-soft hover:text-gold">
        Return home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public marketing site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<PublicHome />} />
        <Route path="/about" element={<PublicAbout />} />
        <Route path="/services" element={<PublicServices />} />
        <Route path="/contact" element={<PublicContact />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Client portal */}
      <Route
        path="/portal"
        element={
          <ProtectedRoute role="client">
            <PortalLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OverviewPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="advisor" element={<AdvisorPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Advisor portal */}
      <Route
        path="/advisor-portal"
        element={
          <ProtectedRoute role="advisor">
            <AdvisorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ClientRoster />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="clients/:clientId" element={<ClientDetail />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
