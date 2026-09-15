import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { UserRole } from '@opsai/shared';

const router = Router();
router.use(authenticateToken);
router.use(requireRole([UserRole.ADMIN, UserRole.INCIDENT_MANAGER]));

router.get('/', getAuditLogs);

export default router;
