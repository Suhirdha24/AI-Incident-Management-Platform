import { Router } from 'express';
import {
  getIncidents,
  getIncidentById,
  createIncident,
  assignEngineer,
  updateStatus,
  updateSeverity,
  triggerAIAnalysis,
  addComment,
  resolveIncident,
  askAIQuestion
} from '../controllers/incidentController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import {
  CreateIncidentSchema,
  UpdateIncidentStatusSchema,
  UpdateIncidentSeveritySchema,
  AssignIncidentSchema,
  CreateCommentSchema,
  ResolveIncidentSchema,
  AIQuestionSchema,
  UserRole
} from '@opsai/shared';

const router = Router();

router.use(authenticateToken);

router.get('/', getIncidents);
router.get('/:id', getIncidentById);
router.post('/', validateRequest(CreateIncidentSchema), createIncident);

router.post(
  '/:id/assign',
  requireRole([UserRole.INCIDENT_MANAGER, UserRole.ADMIN]),
  validateRequest(AssignIncidentSchema),
  assignEngineer
);

router.patch('/:id/status', validateRequest(UpdateIncidentStatusSchema), updateStatus);

router.patch(
  '/:id/severity',
  requireRole([UserRole.INCIDENT_MANAGER, UserRole.ADMIN]),
  validateRequest(UpdateIncidentSeveritySchema),
  updateSeverity
);

router.post('/:id/analyze', triggerAIAnalysis);
router.post('/:id/comments', validateRequest(CreateCommentSchema), addComment);
router.post('/:id/resolve', validateRequest(ResolveIncidentSchema), resolveIncident);
router.post('/:id/ask-ai', validateRequest(AIQuestionSchema), askAIQuestion);

export default router;
