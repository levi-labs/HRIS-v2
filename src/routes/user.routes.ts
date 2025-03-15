import { Router } from "express";

import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { RoleMiddleware } from "../middlewares/role.middleware.js";
import { UserController } from "../controllers/user.controller.js";

const router = Router();

router.get("/",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),UserController.index);
router.get("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),UserController.show);
router.patch("/password/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),UserController.updatePassword);

export default router;