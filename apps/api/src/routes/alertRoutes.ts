import { Router } from 'express';
import { createAlert, getAlerts, getAlertById, updateAlertStatus } from '../controllers/alertController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { CreateAlertSchema } from '@opsai/shared';

const router = Router();

// Endpoint allowed for external alert webhook ingestion or internal calls
router.post('/', validateRequest(CreateAlertSchema), createAlert);

router.use(authenticateToken);
router.get('/', getAlerts);
router.get('/:id', getAlertById);
router.patch('/:id', updateAlertStatus);

export default router;
