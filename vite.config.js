import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Aureus Capital Management — Boutique Advisory PWA
// Caching strategy mapping (per TRD section 2):
//   App Shell (JS/CSS/HTML/static images) -> precached + Cache-First runtime fallback
//   Portfolio balances / live positions   -> Network-First, 30-day cache fallback
//   Research / insights / advisory docs   -> Stale-While-Revalidate
//   POST / sync mutation endpoints        -> Network-Only (queued client-side via IndexedDB, see NetworkContext)
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-charts': ['recharts'],
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'favicon.svg',
        'favicon-32.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'pwa-512x512-maskable.png',
      ],
      manifest: {
        name: 'Aureus Advisory Portal',
        short_name: 'Aureus',
        description:
          'Instant, offline access to your Aureus Capital Management portfolio, research, and advisory team.',
        theme_color: '#0B0F19',
        background_color: '#050505',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // App shell: JS/CSS/HTML/static images are precached automatically
        // (glob below) and served Cache-First by the generated precache route.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          // Portfolio balances & live positions — Network-First, fall back to
          // the last good snapshot for up to 30 days.
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith('/api/v1/portfolio'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'aureus-portfolio-cache',
              networkTimeoutSeconds: 4,
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Advisor roster & per-client detail — same Network-First pattern,
          // so an advisor's client list is still usable offline.
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/v1/advisor-portal'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'aureus-advisor-cache',
              networkTimeoutSeconds: 4,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days — roster changes more often
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Research / insights / advisory letters — Stale-While-Revalidate,
          // instant paint from cache, refresh quietly in the background.
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/v1/insights'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'aureus-insights-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          // Mutating / sync endpoints are never cached — handled by the
          // client-side IndexedDB offline queue instead (see NetworkContext).
          // Matched by exact prefix (not a bare startsWith('/api/v1/advisor'))
          // so this doesn't also swallow /api/v1/advisor-portal above.
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith('/api/v1/sync') ||
              url.pathname.startsWith('/api/v1/advisor/contact'),
            handler: 'NetworkOnly',
          },
          // Auth and public lead submissions must always hit the network —
          // credentials and consultation requests are never cached.
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith('/api/v1/auth') || url.pathname.startsWith('/api/v1/leads'),
            handler: 'NetworkOnly',
          },
          // Google Fonts (display + body faces)
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'aureus-google-fonts-stylesheets' },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'aureus-google-fonts-webfonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
});
