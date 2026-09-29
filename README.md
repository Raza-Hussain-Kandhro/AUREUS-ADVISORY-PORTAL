<div align="center">

<img src="public/logo.png" width="92" alt="Aureus Logo">

# AUREUS ADVISORY PORTAL

### _Private wealth. Protected access. Intelligent infrastructure._

<p align="center">
  <img src="https://img.shields.io/badge/React_18-111111?style=for-the-badge&logo=react&logoColor=C6A15B" alt="React 18">
  <img src="https://img.shields.io/badge/Vite-111111?style=for-the-badge&logo=vite&logoColor=C6A15B" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-111111?style=for-the-badge&logo=node.js&logoColor=C6A15B" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-111111?style=for-the-badge&logo=express&logoColor=C6A15B" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-111111?style=for-the-badge&logo=mongodb&logoColor=C6A15B" alt="MongoDB">
  <img src="https://img.shields.io/badge/PWA-111111?style=for-the-badge&logo=pwa&logoColor=C6A15B" alt="PWA">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Portfolio_Project-C6A15B?style=flat-square&labelColor=111111">
  <img src="https://img.shields.io/badge/Offline-Vault_Mode-C6A15B?style=flat-square&labelColor=111111">
  <img src="https://img.shields.io/badge/Auth-JWT-C6A15B?style=flat-square&labelColor=111111">
  <img src="https://img.shields.io/badge/Database-MongoDB-C6A15B?style=flat-square&labelColor=111111">
</p>

</div>

---

> **A boutique investment advisory PWA for Aureus Capital Management** — public marketing site,
> authenticated multi-client portal, an advisor role, and real offline support (**Vault Mode**) with
> a physics-based, restrained motion language built for a private-client audience.

---

## ◇ Documentation

See `docs/SCOPE.md`, `docs/COMPETITOR_RESEARCH.md`, `docs/TESTING_LOG.md`, and `docs/SUMMARY.md`
for the assignment's required scope statement, competitor research, testing log, and written
summary.

<table>
<tr>
<td width="25%" align="center">

### ◈

**SCOPE**

`docs/SCOPE.md`

Required scope statement

</td>

<td width="25%" align="center">

### ◇

**RESEARCH**

`docs/COMPETITOR_RESEARCH.md`

Competitor research

</td>

<td width="25%" align="center">

### ◆

**TESTING**

`docs/TESTING_LOG.md`

Testing log

</td>

<td width="25%" align="center">

### ✦

**SUMMARY**

`docs/SUMMARY.md`

Written summary

</td>
</tr>
</table>

---

# ✦ Stack

## Frontend

<p>
<img src="https://cdn.simpleicons.org/react/C6A15B" width="34" title="React">
<img src="https://cdn.simpleicons.org/vite/C6A15B" width="34" title="Vite">
<img src="https://cdn.simpleicons.org/tailwindcss/C6A15B" width="34" title="Tailwind CSS">
<img src="https://cdn.simpleicons.org/framer/C6A15B" width="34" title="Framer Motion">
<img src="<img src="./public/rechart.png" width="34" title="Recharts">" width="34" title="Recharts">
</p>

- **React 18 + Vite + React Router, Tailwind CSS, Framer Motion, Recharts,
  `localforage` (IndexedDB)**

## PWA

<p>
<img src="https://cdn.simpleicons.org/pwa/C6A15B" width="34" title="PWA">
</p>

- **`vite-plugin-pwa` (Workbox)** — installable, offline-first

## Authentication

- **JWT (`jsonwebtoken` + `bcryptjs`)**, role-based (client / advisor)

## Backend

<p>
<img src="https://cdn.simpleicons.org/nodedotjs/C6A15B" width="34" title="Node.js">
<img src="https://cdn.simpleicons.org/express/C6A15B" width="34" title="Express">
<img src="https://cdn.simpleicons.org/mongodb/C6A15B" width="34" title="MongoDB">
</p>

- **Node.js + Express** (mock-data mode out of the box, or MongoDB via Mongoose)

## Deployment

<p>
<img src="https://cdn.simpleicons.org/vercel/C6A15B" width="34" title="Vercel">
</p>

- **Single Vercel project** (static frontend + `/api` serverless function), or split
  frontend/backend hosting

---

# ◆ Quick Start

### 01 — Install

````bash
npm install

02 — API
npm run server

Defaults to mock data, no DB required.

03 — Frontend
npm run dev

Terminal 1 — API
Terminal 2 — frontend (proxies /api to http://localhost:4000, see vite.config.js)

Open http://localhost:5173. You'll land on the public marketing site; click Client login.

◇ Demo Accounts

Password for all: Aureus2026!

Role	Email	What you'll see
Client	amara@aureuscapital.demo	Amara Reyes's portfolio ($12.45M)
Client	marcus@aureuscapital.demo	Marcus Chen's portfolio ($6.875M) — a different client, proving data isolation
Advisor	raza@aureuscapital.demo	Client roster for both clients above, read-only detail view

The login page also has one-click buttons that fill these in for you.

⬡ Vault Mode
Real Offline Support

To test Vault Mode, log in as a client, then open:

DevTools → Network → Offline

or toggle airplane mode on a real device once installed.

The app desaturates, drops the "Offline · Viewing cached portfolio" pill, and queues the
"Contact advisor" / "Authorize trade" / scheduler actions in IndexedDB instead of failing.

◆ MongoDB Configuration

To connect a real database instead of mock data, copy:

server/.env.example

to:

server/.env

Set MONGODB_URI and JWT_SECRET, then run:

npm run seed

once to create the same three demo accounts in your real database.

◈ Project Structure
├── src/
│   ├── pages/
│   │   ├── PublicHome/About/Services/Contact.jsx   Public marketing site
│   │   ├── LoginPage.jsx, RegisterPage.jsx          Auth
│   │   ├── PortalLayout.jsx                         Client shell — fetches data once, nav, Vault Mode
│   │   ├── portal/Overview/Insights/Advisor/Settings.jsx   The 4 client views from PRD §4.2
│   │   └── advisor/AdvisorLayout, ClientRoster, ClientDetail.jsx   Advisor role
│   ├── components/           Navbar, NetWorthDisplay (odometer), AllocationDonut,
│   │                          PortfolioChart (self-drawing spline), OfflineBanner, InstallPWA,
│   │                          ActionQueueModal, ResearchCard, MagneticButton, ProtectedRoute
│   ├── context/               AuthContext.jsx (login/register/session), NetworkContext.jsx
│   │                           (isOnline / Vault Mode + offline queue)
│   ├── hooks/                 useOdometer.js
│   ├── utils/                 indexedDB.js (queue + snapshot stores), api.js (network-first
│   │                           fetch + auth headers), authToken.js, path.js (spline math)
├── server/
│   ├── app.js                 Express app factory (shared by local + serverless entry points)
│   ├── server.js              Local dev/production entry point (`npm run server`)
│   ├── seed.js                Creates demo accounts in a real MongoDB (`npm run seed`)
│   ├── mockStore.js            Demo users/portfolios used when no MONGODB_URI is set
│   ├── config/db.js            Connects to MongoDB if MONGODB_URI is set, else mock mode
│   ├── middleware/auth.js      JWT verification + role guard
│   ├── models/                 User.js, Portfolio.js, SyncTask.js, Lead.js
│   ├── controllers/            auth, portfolio, advisor, sync, lead
│   └── routes/                 apiRoutes.js, authRoutes.js, advisorRoutes.js
├── api/index.js                Vercel serverless entry point (wraps server/app.js)
├── docs/                       SCOPE.md, COMPETITOR_RESEARCH.md, TESTING_LOG.md, SUMMARY.md
├── public/                     Manifest icons (generated), favicon.svg
├── vite.config.js              vite-plugin-pwa Workbox caching strategy map
├── tailwind.config.js          Midnight & Gold design tokens, easing curves, keyframes
└── vercel.json                 Rewrites: /api → serverless function, everything else → SPA shell
⬡ How the Offline Design Requirements Map to Code
Requirement (PRD/TRD)	Implementation
App shell — Cache-First	vite-plugin-pwa precache (globPatterns in vite.config.js)
Portfolio data — Network-First, 30-day fallback	runtimeCaching rule for /api/v1/portfolio, plus an app-level fallback in src/utils/api.js
Insights — Stale-While-Revalidate	runtimeCaching rule for /api/v1/insights
Auth / leads — never cached	runtimeCaching rule for /api/v1/auth and /api/v1/leads (NetworkOnly)
Offline mutation queue (IndexedDB)	src/utils/indexedDB.js (queue store) + NetworkContext.jsx (queueAction, auto-flush on online event)
Network status → global Vault Mode	NetworkContext.jsx listens to window.online/offline; each layout applies .vault-mode and mounts OfflineBanner
Custom install prompt (not the browser default)	InstallPWA.jsx captures beforeinstallprompt, shows a bespoke sheet on the 2nd visit
"Authorize Trade" disabled + queued offline	OverviewPage.jsx — button shows a padlock and routes through ActionQueueModal when offline
Multi-client data isolation (Persona A)	JWT sub claim scopes every /portfolio and /insights query server-side
Advisor role + client roster (Persona B)	requireRole('advisor') middleware + /advisor-portal/* routes + ClientRoster/ClientDetail
Advisor inbox for client messages + public leads	GET /advisor-portal/inbox (merges both sources) + Inbox.jsx, with a mark-as-handled action
▲ Deploying to Vercel

This repo is set up to deploy as a single Vercel project:

01 — Repository

Push to a Git repo and import it in Vercel.

02 — Environment Variables

Set:

MONGODB_URI
JWT_SECRET

MONGODB_URI is optional — omit it to run in mock-data mode in production too; JWT_SECRET
should always be set for a real deployment.

03 — Build

Vercel builds the frontend:

vite build → dist/

and deploys:

api/index.js

as a serverless function.

vercel.json rewrites:

/api/* → serverless function

and everything else to the SPA shell.

◇ Alternative Deployment

If you'd rather run the Express server as a normal long-lived process (Render, Railway, Fly.io, a VPS), just deploy server/server.js as-is and point VITE_API_BASE at its URL.

⚠ Known Scope Notes
Offline Mutation Queue

The offline mutation queue is IndexedDB + online-event driven rather than the browser
Background Sync API, since Background Sync isn't supported in Safari/iOS — important for an
HNWI audience that skews heavily toward iPhone. See docs/SUMMARY.md for more.

Authentication

Auth is real and functional (JWT, hashed passwords, role checks) but not production-hardened —
no rate limiting, refresh-token rotation, or email verification. Fine for a portfolio piece;
would need hardening before handling real client data.

PWA Testing

Live in-browser PWA behavior (Service Worker offline interception, the install prompt) was
verified through the Workbox build output and code review, not browser automation — see
docs/TESTING_LOG.md for exactly what that means and how to verify it yourself.

<div align="center">
👨‍💻 Author
Raza Hussain

BS Computer Science @DHA Suffa University

Full-Stack Web Developer Intern @SafeXSolutions

<br> <img src="https://img.shields.io/badge/AUREUS-CAPITAL_MANAGEMENT-C6A15B?style=for-the-badge&labelColor=111111">

<br><br>

Private wealth · Protected access · Intelligent infrastructure

</div> ```
````
