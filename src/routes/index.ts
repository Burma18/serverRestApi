import { Router } from 'express';
import authRoutes from './authRoutes';
import fileRoutes from './fileRoutes';
import infoRoutes from './infoRoutes';
import logOutRoutes from './logOutRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/file', fileRoutes);
router.use('/', infoRoutes);
router.use('/', logOutRoutes);

export default router;
