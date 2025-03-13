import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { RoleMiddleware } from "../middlewares/role.middleware.js";
import { DepartmentController } from "../controllers/department.controller.js";

const router = Router();

router.get('/',AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),DepartmentController.index);
router.get('/:id',AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),DepartmentController.show);
router.post('/',AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),DepartmentController.store);
router.put('/:id',AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),DepartmentController.update);
router.delete('/:id',AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),DepartmentController.destroy);

export default router;