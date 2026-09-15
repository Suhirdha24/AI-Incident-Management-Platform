import { Router } from 'express';
import { getIncidentAnalytics } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

router.get('/incidents', getIncidentAnalytics);

export default router;
