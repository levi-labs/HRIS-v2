import { Router } from "express";
import { EmployeeOfficeController } from "../controllers/employeeOffice.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { RoleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();


router.get("/",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),EmployeeOfficeController.index);
router.get("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),EmployeeOfficeController.show);
router.post("/",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),EmployeeOfficeController.store);
router.put("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),EmployeeOfficeController.update);
router.delete("/:id",AuthMiddleware.checkAuth,RoleMiddleware.checkRole(["admin"]),EmployeeOfficeController.destroy);

export default router;