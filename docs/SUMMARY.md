# Project Summary — Aureus Advisory Portal

## What I built and why

Aureus Capital Management is a fictional boutique investment advisory, and this project converts
its client-facing site into an installable Progressive Web App with genuine offline support. The
brief centered on one hard requirement: a high-net-worth client traveling with spotty connectivity
should be able to open the app on a plane and still see their portfolio, not a blank screen or a
network error. That requirement shaped the whole architecture — a Service Worker with four
different caching strategies depending on data sensitivity and volatility, and a durable
IndexedDB queue for any action (like requesting a trade or messaging an advisor) taken while
offline, synced automatically the moment connectivity returns.

Beyond the offline layer, I extended the original scope to include real authentication and
multi-client support, plus a separate advisor role with its own client roster — the delivered
design spec described only a single hardcoded client dashboard, which doesn't reflect how an
actual advisory firm's portal works (multiple clients, each seeing only their own data, plus
internal staff who need to see multiple clients). I also added a public marketing site in front
of the authenticated portal, since the assignment brief specifically frames this as "converting a
small site," and every real comparable firm I researched (see `COMPETITOR_RESEARCH.md`) uses a
public site to qualify and build trust with prospects before they ever reach a login screen.

## Tools and techniques

**Frontend:** React 18 + Vite, React Router for the multi-page structure, Tailwind CSS for the
"Midnight & Gold" design system, Framer Motion for the physics-based animation the brief called
for (an odometer-style count-up for net worth, a self-drawing performance chart, a spring-driven
magnetic button), and `localforage` as a clean wrapper around IndexedDB for the offline queue.

**Offline/PWA:** `vite-plugin-pwa` generating a Workbox service worker, with explicit
runtime-caching rules matched to each API route's sensitivity (portfolio data is Network-First
with a 30-day fallback; auth and payment-adjacent mutation endpoints are Network-Only and never
cached; research content is Stale-While-Revalidate for instant paint).

**Backend:** Node.js + Express, with JWT-based authentication (`jsonwebtoken` + `bcryptjs`) and a
Mongoose/MongoDB data layer that's fully optional — the app runs immediately in a mock-data mode
with seeded demo accounts, so a reviewer doesn't need to provision a database to evaluate it.

## What I tested, and what I found

I tested this by actually running the server and hitting every endpoint with curl through several
rounds of development, not just reading the code for correctness — login success/failure, token
validation, role-based access control (confirming a client account is blocked from the advisor
roster and vice versa), multi-client data isolation, and input validation on every POST route. I
also ran a full production build after every structural change rather than only at the end, which
is what caught two real bugs: a set of broken import paths after restructuring into multiple
pages, and a `.env`-loading bug in the backend where the config file was being silently ignored
because it was resolved relative to the wrong directory. Full detail, including exactly what
wasn't tested and why, is in `TESTING_LOG.md`.

## What I'd improve with more time

The offline mutation queue currently relies on the browser's `online`/`offline` events rather than
the Background Sync API. That's a deliberate trade-off, not an oversight — Safari/iOS doesn't
support Background Sync, and this product's audience skews heavily toward iPhone, so the
more-compatible approach was the right call for this build. But it does mean a queued action only
retries when the app is actually open and regains connectivity, rather than syncing silently in
the background the way a native app could. Given more time, I'd add a periodic sync fallback and
a push-notification confirmation once a queued action successfully lands, so a client doesn't have
to reopen the app to know their trade request went through.
