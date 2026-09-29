# Scope Statement

**Project:** Progressive Web App (PWA) with Offline Support for a Boutique Investment Advisory
**Week:** 3 — Professional / Advanced Practical Build

## Plan (written before implementation)

I will convert the Aureus Capital Management site into an installable PWA using React + Vite +
Tailwind on the frontend and Node/Express (with optional MongoDB) on the backend, following the
supplied Design Spec, PRD, and TRD exactly for the visual language, caching strategy, and API
surface. The core technical challenge — and the piece that differentiates this from a normal
React build — is the offline layer: a Service Worker (via `vite-plugin-pwa`/Workbox) handling
four distinct caching strategies per data type, plus an IndexedDB-backed mutation queue for
actions taken while offline. Unlike Week 1 (Subscription Billing Portal — payments/billing
domain, no offline requirement) and Week 2 (3D Healthcare Products site — a marketing/e-commerce
build with no authenticated portal or persistent backend), this project's center of gravity is
backend + offline architecture, not frontend polish alone: authentication, per-client data
isolation, and a Service Worker are all new territory for this internship. I'll build the offline
queue and Vault Mode state first since everything else in the PRD depends on that
network-state model being correct, then layer the portal views and advisor role on top of it.

## Formal scope

**In scope:**
- Public marketing site (Home, About, Services, Contact) with a lead-capture consultation form
- Client authentication (login + registration) and an authenticated, installable PWA portal
- Multi-client data isolation — each logged-in client sees only their own portfolio
- An advisor role (Persona B from the PRD) with a client roster and read-only per-client view
- Four portal views per PRD §4.2: Portfolio Overview, Insights, Advisor Contact & Scheduler,
  Account Security & Settings
- Full offline support: Cache-First app shell, Network-First portfolio data (30-day fallback),
  Stale-While-Revalidate insights, and a client-side IndexedDB mutation queue for actions taken
  offline (trade authorization, advisor contact/scheduling)
- Custom (non-browser-default) install prompt, shown on the second visit
- Mock-data mode so the entire app — including auth and multi-client demo accounts — runs with
  zero setup, plus an optional real MongoDB path with a seed script

**Out of scope (see TESTING_LOG.md and SUMMARY.md for why):**
- Real trade execution, custodian integration, or any real financial data
- Production-grade security hardening (rate limiting, CSRF protection, refresh-token rotation,
  email verification) — the auth system is real and functional but not hardened for production
- Push notifications and Background Sync API (deliberately — see SUMMARY.md's "what I'd improve"
  section for the reasoning)
- Automated test suite (testing was done manually and is logged in TESTING_LOG.md)
