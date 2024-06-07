import { Router } from 'express';
import { logOut } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/logOut', authenticateToken, logOut);

export default router;
