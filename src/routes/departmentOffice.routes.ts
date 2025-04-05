import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';
import { DepartmentOfficeController } from '../controllers/departmentOffice.controller.js';

const router = Router();

router.get('/', AuthMiddleware.checkAuth, DepartmentOfficeController.index);
router.get('/:id', AuthMiddleware.checkAuth, DepartmentOfficeController.show);
router.post('/', AuthMiddleware.checkAuth, DepartmentOfficeController.store);
router.put('/:id', AuthMiddleware.checkAuth, DepartmentOfficeController.update);
router.delete('/:id', AuthMiddleware.checkAuth, DepartmentOfficeController.destroy);

export default router;
