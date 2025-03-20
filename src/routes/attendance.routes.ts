import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();


router.post("/check-in",AuthMiddleware.checkAuth,AttendanceController.checkIn);
router.post("/check-out",AuthMiddleware.checkAuth,AttendanceController.checkOut);

export default router;