import { Request, Response, NextFunction } from "express";
import { OfficeScheduleService } from "../services/officeSchedule.service.js";
export class OfficeScheduleController {
    static index = async (req:Request,res:Response,next:NextFunction):Promise<void> => {
      try {
        const data = await OfficeScheduleService.getAll();
        res.status(200).json({
            success: true,
            message: "Office schedules fetched successfully",
            data: data,
            meta: res.locals.meta
        });
      } catch (error) {
        next(error);
      }
    }
    static show = async (req:Request,res:Response,next:NextFunction):Promise<void> => {
      try {
        const data = await OfficeScheduleService.getById(+req.params.id);
        res.status(200).json({
            success: true,
            message: "Office schedule fetched successfully",
            data: data,
            meta: res.locals.meta
        });
      } catch (error) {
        next(error);
      }
    }

    static store = async (req:Request,res:Response,next:NextFunction):Promise<void> => {
      try {
        const data = await OfficeScheduleService.create(req.body);
        res.status(201).json({
            success: true,
            message: "Office schedule created successfully",
            data: data,
            meta: res.locals.meta
        });
      } catch (error) {
        next(error);
      }
    }

    static update = async (req:Request,res:Response,next:NextFunction):Promise<void> => {
      try {
        const data= await OfficeScheduleService.update(+req.params.id,req.body);
        res.status(200).json({
            success: true,
            message: "Office schedule updated successfully",
            data: data,
            meta: res.locals.meta
        });
      } catch (error) {
        next(error);
      }
    }

    static destroy = async (req:Request,res:Response,next:NextFunction):Promise<void> => {
      try {
        const id = parseInt(req.params.id);
        await OfficeScheduleService.delete(id);
        res.status(200).json({
            success: true,
            message: "Office schedule deleted successfully",
            meta: res.locals.meta
        });
      } catch (error) {
        next(error);
      }
    }
}