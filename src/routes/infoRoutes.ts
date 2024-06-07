import { Router } from 'express';
import { getUser } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/info', authenticateToken, getUser);

export default router;
