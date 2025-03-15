import { Router } from "express";
import { OfficeController } from "../controllers/office.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { RoleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),OfficeController.index);
router.get("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),OfficeController.show);
router.post("/",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),OfficeController.store);
router.put("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),OfficeController.update);
router.delete("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),OfficeController.destroy);

export default router;