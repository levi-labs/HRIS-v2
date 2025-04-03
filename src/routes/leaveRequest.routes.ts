import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';
import { LeaveRequestController } from '../controllers/leaveRequest.controller.js';

const router = Router();

router.get('/', AuthMiddleware.checkAuth, LeaveRequestController.index);
router.get('/:id', AuthMiddleware.checkAuth, LeaveRequestController.show);
router.post(
    '/create-from-employee',
    AuthMiddleware.checkAuth,
    LeaveRequestController.storeAsEmployee,
);
router.post('/create-from-hrd', AuthMiddleware.checkAuth, LeaveRequestController.storeAsHRD);
router.put(
    '/update-from-employee/:id',
    AuthMiddleware.checkAuth,
    LeaveRequestController.updateAsEmployee,
);
router.put('/update-from-hrd/:id', AuthMiddleware.checkAuth, LeaveRequestController.updateAsHRD);
router.delete('/:id', AuthMiddleware.checkAuth, LeaveRequestController.destroy);

export default router;
