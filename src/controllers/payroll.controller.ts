import { Request, Response, NextFunction } from "express";
import { PayrollService } from "../services/payroll.service.js";
export class PayrollController {
    static async index(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await PayrollService.getAll();
            res.status(200).json({
                success: true,
                message: "Payroll fetched successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }
    static async show(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await PayrollService.getById(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Payroll fetched successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }  

    static async store(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await PayrollService.create(req.body);
            res.status(201).json({
                success: true,
                message: "Payroll created successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await PayrollService.update(+req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: "Payroll updated successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await PayrollService.delete(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Payroll deleted successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }
}