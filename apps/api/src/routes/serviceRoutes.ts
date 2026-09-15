import { Router } from 'express';
import { getServices, getServiceById, createService, updateService } from '../controllers/serviceController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { CreateServiceSchema, UserRole } from '@opsai/shared';

const router = Router();

router.use(authenticateToken);

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', requireRole([UserRole.ADMIN]), validateRequest(CreateServiceSchema), createService);
router.patch('/:id', requireRole([UserRole.ADMIN]), updateService);

export default router;
