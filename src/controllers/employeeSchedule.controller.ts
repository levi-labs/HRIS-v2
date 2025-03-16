import { Request, Response, NextFunction } from "express";
import { EmployeeScheduleService } from "../services/employeeSchedule.service.js";

export class EmployeeScheduleController {
    static async index(req:Request, res:Response, next:NextFunction):Promise<void> {
        try {
            const data = await EmployeeScheduleService.getAll();
            res.status(200).json({
                success: true,
                message: "Employee schedules fetched successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }
    static async show(req:Request, res:Response, next:NextFunction):Promise<void> {
        try {
            const data = await EmployeeScheduleService.getById(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Employee schedule fetched successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async approve(req:Request, res:Response, next:NextFunction):Promise<void> {
        try {
            const data = await EmployeeScheduleService.approve(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Employee schedule approved successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async reject(req:Request, res:Response, next:NextFunction):Promise<void> {
        try {
            const data = await EmployeeScheduleService.reject(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Employee schedule rejected successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async store(req:Request, res:Response, next:NextFunction):Promise<void> {
        try {
            const data = await EmployeeScheduleService.create(req.body);
            res.status(200).json({
                success: true,
                message: "Employee schedule created successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req:Request, res:Response, next:NextFunction):Promise<void> {
        try {
            const data = await EmployeeScheduleService.update(+req.params.id,req.body);
            res.status(200).json({
                success: true,
                message: "Employee schedule updated successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async destroy(req:Request, res:Response, next:NextFunction):Promise<void> {
        try {
            const data = await EmployeeScheduleService.delete(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Employee schedule deleted successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }
}