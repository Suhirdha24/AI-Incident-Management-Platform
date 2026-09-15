import { Router } from 'express';
import {
  getPostmortems,
  getPostmortemByIncident,
  generateAIPostmortem,
  updatePostmortem
} from '../controllers/postmortemController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

router.get('/', getPostmortems);
router.get('/incident/:incidentId', getPostmortemByIncident);
router.post('/incident/:incidentId/generate', generateAIPostmortem);
router.patch('/:id', updatePostmortem);

export default router;
