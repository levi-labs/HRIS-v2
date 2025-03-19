import { Request, Response, NextFunction } from "express";
import { AttendanceService } from "../services/attendance.service.js";
export class AttendanceController {
    static async store(req:Request, res:Response, next:NextFunction){
      try {
        const attendance = await AttendanceService.create(req.body);
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
}