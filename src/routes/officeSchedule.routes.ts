import { Router } from "express";

import { OfficeScheduleController } from "../controllers/officeSchedule.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { RoleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),OfficeScheduleController.index);
router.get("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),OfficeScheduleController.show);
router.post("/",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),OfficeScheduleController.store);
router.put("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),OfficeScheduleController.update);
router.delete("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),OfficeScheduleController.destroy);

export default router;