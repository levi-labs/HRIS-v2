import { Router } from "express";
import { RoleController } from "../controllers/role.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { RoleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),RoleController.index);
router.get("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),RoleController.show);
router.post("/",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),RoleController.store);
router.put("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),RoleController.update);
router.delete("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),RoleController.destroy);

export default router;