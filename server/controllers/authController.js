import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { isMockMode } from '../config/db.js';
import { signToken } from '../middleware/auth.js';
import { findMockUserByEmail, findMockUserById, MOCK_USERS } from '../mockStore.js';

function initialsFromName(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
}

function publicUser(u) {
  return { id: u.id ?? u._id?.toString(), name: u.name, email: u.email, role: u.role, initials: u.initials };
}

export async function register(req, res) {
  const { name, email, password, role } = req.body ?? {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  const safeRole = role === 'advisor' ? 'advisor' : 'client';

  if (isMockMode()) {
    if (findMockUserByEmail(email)) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }
    // Mock mode is read-only demo data — we don't persist new signups across
    // restarts, but we do allow the request to succeed and issue a real
    // token so the signup -> login flow can be demoed end to end.
    const newUser = {
      id: `mock-user-${Date.now()}`,
      name,
      email,
      role: safeRole,
      initials: initialsFromName(name),
    };
    MOCK_USERS.push({ ...newUser, passwordHash: bcrypt.hashSync(password, 10) });
    const token = signToken(newUser);
    return res.status(201).json({ token, user: publicUser(newUser) });
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: safeRole,
      initials: initialsFromName(name),
    });
    const token = signToken({ id: user._id.toString(), role: user.role, name: user.name, initials: user.initials });
    return res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    console.error('[Aureus API] register error:', err);
    return res.status(500).json({ error: 'Failed to create account.' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (isMockMode()) {
    const user = findMockUserByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = signToken(user);
    return res.json({ token, user: publicUser(user) });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = signToken({ id: user._id.toString(), role: user.role, name: user.name, initials: user.initials });
    return res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error('[Aureus API] login error:', err);
    return res.status(500).json({ error: 'Failed to log in.' });
  }
}

export async function me(req, res) {
  if (isMockMode()) {
    const user = findMockUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json({ user: publicUser(user) });
  }

  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json({ user: publicUser({ ...user, id: user._id.toString() }) });
  } catch (err) {
    console.error('[Aureus API] me error:', err);
    return res.status(500).json({ error: 'Failed to load account.' });
  }
}
