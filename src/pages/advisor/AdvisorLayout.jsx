import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import OfflineBanner from '../../components/OfflineBanner.jsx';
import { useNetwork } from '../../context/NetworkContext.jsx';

export default function AdvisorLayout() {
  const { vaultMode, lastSyncedAt } = useNetwork();

  return (
    <div className={vaultMode ? 'vault-mode min-h-dvh' : 'vault-mode-off min-h-dvh'}>
      <OfflineBanner visible={vaultMode} lastSyncedAt={lastSyncedAt} />
      <Navbar />
      <Outlet />
    </div>
  );
}
