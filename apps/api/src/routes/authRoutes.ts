import { Router } from 'express';
import { register, login, demoLogin, getCurrentUser, logout } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { LoginSchema, RegisterSchema } from '@opsai/shared';

const router = Router();

router.post('/register', validateRequest(RegisterSchema), register);
router.post('/login', validateRequest(LoginSchema), login);
router.post('/demo-login', demoLogin);
router.get('/me', authenticateToken, getCurrentUser);
router.post('/logout', authenticateToken, logout);

export default router;
