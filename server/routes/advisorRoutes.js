import { Router } from 'express';
import { listClients, getClientPortfolio, listInbox, resolveInboxItem } from '../controllers/advisorController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireRole('advisor'));

router.get('/clients', listClients);
router.get('/clients/:clientId', getClientPortfolio);
router.get('/inbox', listInbox);
router.post('/inbox/:type/:id/resolve', resolveInboxItem);

export default router;
