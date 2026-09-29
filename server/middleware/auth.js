import jwt from 'jsonwebtoken';

let warnedOnce = false;

/**
 * Resolved lazily (inside a function, at call time) rather than as a
 * module-level constant — a module-level `process.env.JWT_SECRET` read
 * would be evaluated at import time, which can run before dotenv has had a
 * chance to load server/.env depending on import order elsewhere in the app.
 * See server/loadEnv.js for the other half of this fix.
 */
function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (!warnedOnce) {
      console.warn(
        '[Aureus API] JWT_SECRET not set — using an insecure development default. ' +
          'Set JWT_SECRET in server/.env before deploying.'
      );
      warnedOnce = true;
    }
    return 'aureus-dev-secret-change-me';
  }
  return secret;
}

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, name: user.name, initials: user.initials },
    getSecret(),
    { expiresIn: '7d' }
  );
}

/** Requires a valid Bearer token; attaches { id, role, name, initials } to req.user. */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
  }

  try {
    const payload = jwt.verify(token, getSecret());
    req.user = {
      id: payload.sub,
      role: payload.role,
      name: payload.name,
      initials: payload.initials,
    };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

/** Use after requireAuth to restrict a route to one or more roles. */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have access to this resource.' });
    }
    return next();
  };
}
