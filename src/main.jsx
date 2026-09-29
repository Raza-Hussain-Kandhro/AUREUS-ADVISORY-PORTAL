import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { NetworkProvider } from './context/NetworkContext.jsx';
import './index.css';

// vite-plugin-pwa generates this virtual module at build time. It wraps the
// browser's raw ServiceWorkerRegistration API with update/offline callbacks.
import { registerSW } from 'virtual:pwa-register';

registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    console.info('[Aureus] Service worker registered:', swUrl);
    // Poll for a fresh app shell every hour so long-lived installs stay current.
    if (registration) {
      setInterval(() => registration.update(), 60 * 60 * 1000);
    }
  },
  onOfflineReady() {
    console.info('[Aureus] App shell cached — offline (Vault Mode) is ready.');
  },
  onRegisterError(error) {
    console.error('[Aureus] Service worker registration failed:', error);
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NetworkProvider>
          <App />
        </NetworkProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
