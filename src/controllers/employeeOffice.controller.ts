import { Response, Request, NextFunction } from "express";
import { EmployeeOfficeService } from "../services/employeeOffice.service.js";


export class EmployeeOfficeController {
    static async index (req: Request, res: Response, next: NextFunction) {
        try {
            const data = await EmployeeOfficeService.getAll();
            res.status(200).json({
                success: true,
                message: "Employee offices fetched successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    };

    static async show (req: Request, res: Response, next: NextFunction) {
        try {
            const data = await EmployeeOfficeService.getById(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Employee office fetched successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    };

    static async store (req: Request, res: Response, next: NextFunction) {
        try {
            const data = await EmployeeOfficeService.create(req.body);
            res.status(200).json({
                success: true,
                message: "Employee office created successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    };

    static async update (req: Request, res: Response, next: NextFunction) {
        try {
            const data = await EmployeeOfficeService.update(+req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: "Employee office updated successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    };

    static async destroy (req: Request, res: Response, next: NextFunction) {
        try {
            const data = await EmployeeOfficeService.delete(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Employee office deleted successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    };
}