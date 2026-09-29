import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/public/PublicNavbar.jsx';
import PublicFooter from '../components/public/PublicFooter.jsx';

export default function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
