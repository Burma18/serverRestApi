import { Router } from 'express';
import multer from 'multer';
import {
  uploadFile,
  getFile,
  updateFile,
  deleteFile,
  listFiles,
  downloadFile,
} from '../controllers/fileController';
import { authenticateToken } from '../middleware/auth';
const router = Router();
const upload = multer({ dest: 'uploads' });

router.get('/list', authenticateToken, listFiles);
router.post('/upload', authenticateToken, upload.single('file'), uploadFile);
router.get('/:id', authenticateToken, getFile);
router.get('/download/:id', downloadFile);
router.put('/:id', authenticateToken, upload.single('file'), updateFile);
router.delete('/:id', authenticateToken, deleteFile);

export default router;
