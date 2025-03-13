import { Router } from "express";
import { JobPositionController } from "../controllers/jobPosition.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { RoleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/",AuthMiddleware.checkAuth,JobPositionController.index);
router.get("/:id",AuthMiddleware.checkAuth,JobPositionController.show);
router.post("/",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),JobPositionController.store);
router.put("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),JobPositionController.update);
router.delete("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),JobPositionController.destroy);

export default router;