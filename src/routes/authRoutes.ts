import { Router } from 'express';
import { signIn, signUp, newToken } from '../controllers/authController';

const router = Router();

router.post('/signin', signIn);
router.post('/signup', signUp);
router.post('/signin/newToken', newToken);

export default router;
