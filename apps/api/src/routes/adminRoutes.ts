import { Router } from 'express';
import { getUsers, updateUser, getAlertSources } from '../controllers/adminController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { UserRole } from '@opsai/shared';

const router = Router();
router.use(authenticateToken);
router.use(requireRole([UserRole.ADMIN]));

router.get('/users', getUsers);
router.patch('/users/:id', updateUser);
router.get('/alert-sources', getAlertSources);

export default router;
