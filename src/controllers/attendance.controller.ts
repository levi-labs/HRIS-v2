import { Request, Response, NextFunction } from "express";
import { AttendanceService } from "../services/attendance.service.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";
export class AttendanceController {
    static async checkIn(req:AuthRequest, res:Response, next:NextFunction){
      try {
        const attendance = await AttendanceService.checkIn(+req.user!.id ,req.body);
        res.status(201).json({
            success: true,
            message: "Attendance created successfully",
            data: attendance,
            meta: res.locals.meta
        });
      } catch (error) {
        next(error);
      }
    }
    static async checkOut(req:AuthRequest, res:Response, next:NextFunction){
        try {
          const attendance = await AttendanceService.checkOut(+req.user!.id ,req.body);
        } catch (error) {
          
        }
    }
}