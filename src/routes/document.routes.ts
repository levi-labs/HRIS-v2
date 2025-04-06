import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', AuthMiddleware.checkAuth, DocumentController.index);
router.get('/:id', AuthMiddleware.checkAuth, DocumentController.show);
router.post('/', AuthMiddleware.checkAuth, upload.single('file'), DocumentController.store);
router.put('/:id', AuthMiddleware.checkAuth, upload.single('file'), DocumentController.update);
router.delete('/:id', AuthMiddleware.checkAuth, DocumentController.destroy);

export default router;
