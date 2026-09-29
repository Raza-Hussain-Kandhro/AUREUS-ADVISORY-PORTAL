import { Router } from 'express';
import { getPortfolio, getInsights } from '../controllers/portfolioController.js';
import { receiveSyncTask, receiveAdvisorContact } from '../controllers/syncController.js';
import { receiveLead } from '../controllers/leadController.js';
import { requireAuth } from '../middleware/auth.js';
import authRoutes from './authRoutes.js';
import advisorRoutes from './advisorRoutes.js';

const router = Router();

// Public (no auth required)
router.use('/auth', authRoutes);
router.post('/leads', receiveLead);

// Authenticated client routes
router.get('/portfolio', requireAuth, getPortfolio);
router.get('/insights', requireAuth, getInsights);
router.post('/advisor/contact', requireAuth, receiveAdvisorContact);
router.post('/sync', requireAuth, receiveSyncTask);

// Advisor-only routes (client roster + per-client detail) — separate
// namespace from /advisor/contact above, which is the client-facing form.
router.use('/advisor-portal', advisorRoutes);

export default router;
