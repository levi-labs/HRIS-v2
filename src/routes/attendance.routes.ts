import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();


router.post("/",AuthMiddleware.checkAuth,AttendanceController.store);

export default router;