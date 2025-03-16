import { Router } from "express";

import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { RoleMiddleware } from "../middlewares/role.middleware.js";
import { EmployeeScheduleController } from "../controllers/employeeSchedule.controller.js";


const router = Router();

router.get("/",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),EmployeeScheduleController.index);
router.get("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),EmployeeScheduleController.show);
router.patch("/approve/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),EmployeeScheduleController.approve);
router.patch("/reject/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),EmployeeScheduleController.reject);
router.post("/",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),EmployeeScheduleController.store);
router.put("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),EmployeeScheduleController.update);
router.delete("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),EmployeeScheduleController.destroy);

export default router;