# Testing Log

This log covers what was actually tested during development, and what was found and fixed. It's
organized by layer since the backend and frontend were tested differently.

## Backend — tested live against a running server

Every item below was run against the actual Express server (not just read for correctness),
using curl, across several rounds of the build.

| Test | Expected | Result |
|---|---|---|
| `POST /auth/login` with correct demo credentials | 200 + token | ✅ Pass |
| `POST /auth/login` with wrong password | 401, no token issued | ✅ Pass |
| `POST /auth/register` with an email already in use | 409 | ✅ Pass |
| `POST /auth/register` with a new email | 201 + token, immediately usable | ✅ Pass |
| `GET /portfolio` with no Authorization header | 401 | ✅ Pass |
| `GET /portfolio` as client A vs. client B | Each sees only their own portfolio | ✅ Pass — confirmed Amara and Marcus return different `totalValue`/`assetAllocation` |
| `GET /portfolio` as an advisor (no personal portfolio) | 404 with a clear message, not a crash | ✅ Pass |
| `GET /advisor-portal/clients` as a client role | 403 (role-gated) | ✅ Pass |
| `GET /advisor-portal/clients` as an advisor | 200, full roster with both demo clients | ✅ Pass |
| `GET /advisor-portal/clients/:id` for a specific client | Correct client + portfolio returned | ✅ Pass |
| `POST /advisor/contact` | Task recorded, attributed to the authenticated user | ✅ Pass |
| `POST /sync` with a missing `action` field | 400 with a validation message | ✅ Pass |
| `POST /leads` (public contact form) missing `email` | 400 | ✅ Pass |
| `POST /leads` with valid data | 201 | ✅ Pass |
| `GET /advisor-portal/inbox` as a client role | 403 | ✅ Pass |
| `GET /advisor-portal/inbox` as an advisor | 200, shows both the message and the lead just submitted, newest first | ✅ Pass |
| `POST /advisor-portal/inbox/:type/:id/resolve` | Status flips from `new` to `handled`, confirmed on next fetch | ✅ Pass |
| Full production build (`npm run build`) | Completes with no errors | ✅ Pass, re-verified after every major change |

## Issues found and fixed during development

**1. `.env` file silently ignored (backend).**
`server/server.js` loaded environment variables with `dotenv/config`, which resolves `.env`
relative to the process's current working directory — not the script's own folder. Since
`npm run server` runs from the project root, it was looking for `.env` at the root, while the
setup instructions (correctly) said to put it in `server/.env`. Symptom: the app always reported
"No MONGODB_URI set," even with a correctly filled-in `server/.env` file. This was caught during
manual testing (running the server and checking the startup log) and fixed by resolving the
`.env` path explicitly relative to the script's own location, so it works regardless of the
directory the command is launched from.

**2. Broken imports after restructuring into a multi-page app.**
When the single-dashboard app was split into `pages/portal/*` for the multi-view PRD structure,
several relative imports (e.g. `../components/NetWorthDisplay.jsx`) were left pointing at their
old depth instead of the new one (`../../components/...`). This was caught immediately by
`npm run build` failing with "Could not resolve" errors — not by manual inspection — which is
exactly why a build was run after every structural change rather than only at the end.

**3. Router redirect called during render, not in an effect.**
The login page's "redirect if already logged in" check initially called `navigate()` directly in
the component body. React does not allow triggering a navigation/state update in a different
component while another is still rendering — this is a known anti-pattern that produces console
warnings and can cause inconsistent redirects. Caught on code review before it shipped; fixed by
moving the check into a `useEffect`.

**4. Ambiguous Workbox route pattern.**
The Service Worker's caching rule for `/advisor/contact` (client-facing, always network-only) used
a `startsWith('/api/v1/advisor')` prefix, which would also incorrectly match the newer
`/api/v1/advisor-portal/*` routes (the advisor's own roster/client views, which *should* be
cached Network-First for offline use). Caught by inspecting the rule order after adding the new
advisor-portal routes; fixed by narrowing the pattern to the exact `/advisor/contact` prefix.

**5. `JWT_SECRET` silently ignored due to ES module import ordering (found after initial delivery).**
Even after fixing issue #1 above (the `.env` path bug), `server/middleware/auth.js` still reported
`JWT_SECRET not set` on startup despite it being correctly present in `server/.env`. The cause was
subtler: ES module `import` statements always fully evaluate before any other code in the
*importing* file runs, regardless of the order they're written in. `server.js` imported
`createApp` from `app.js` — which transitively imports `middleware/auth.js` — *before* its own
`dotenv.config()` call executed. Since `auth.js` read `process.env.JWT_SECRET` as a module-level
constant (evaluated immediately at import time), it always saw an empty environment, while
`MONGODB_URI` worked fine because `config/db.js` reads it lazily, inside a function, called later
at runtime. Fixed two ways: (a) extracted the dotenv loading into `server/loadEnv.js` and made it
the first import in every entry point, so it always runs before anything else; (b) changed
`auth.js` to resolve the secret lazily inside a function rather than as a module-level constant,
so it's no longer dependent on import order at all. This was reported by a real user running the
app after delivery — a good example of a bug that passed code review and curl-based endpoint
testing (since mock-mode auth doesn't depend on `JWT_SECRET` being a *specific* value, only on it
being consistent) but only surfaced when someone set a real value and expected it to be honored.

**6. Missing feature identified in review: advisor had no inbox (not a bug — a scope gap).**
During a post-delivery review, it became clear that `POST /advisor/contact` and `POST /leads`
both accepted and stored data correctly, but nothing ever read it back — messages went into a
`console.log` and an array no route ever exposed. This wasn't a broken feature, it was an
incomplete one: the write side existed, the read side (an actual advisor inbox) didn't. Closed by
adding `GET /advisor-portal/inbox` (merging both sources, newest-first) and a mark-as-handled
action, then verifying live: submitted a lead and a client message, confirmed a client account
gets 403'd from the endpoint, confirmed the advisor sees both items, and confirmed resolving an
item flips its status and stays flipped on the next fetch.

## What was *not* tested, and why

Real in-browser PWA behavior — the Service Worker actually intercepting requests offline, the
custom install prompt firing on a second visit, IndexedDB behavior in a real browser sandbox —
was **not** verified with live browser automation, because this development environment doesn't
have a GUI browser available to drive. What *was* verified:
- The Workbox configuration itself (`vite.config.js`) builds successfully and generates a valid
  `sw.js` with the expected precache manifest and runtime-caching rules (confirmed by inspecting
  the `npm run build` output — 18 precached entries, correct route patterns).
- The underlying logic each of those features depends on (the IndexedDB queue functions, the
  fetch-with-fallback helper, the `online`/`offline` event handlers) is plain JavaScript, tested
  indirectly through the API round-trips above.

**This is a real gap, not a formality** — it means the offline experience specifically (Vault
Mode's visual state, the install prompt, and actually going offline in DevTools and confirming
cached data appears) needs to be manually verified in an actual browser before considering this
"done." Steps to do that are in `README.md`'s "Quick start" section (DevTools → Network →
Offline).
