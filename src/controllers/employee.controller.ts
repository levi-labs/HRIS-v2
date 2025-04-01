import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../services/employee.service.js';
export class EmployeeController {
    static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await EmployeeService.getAll();
            res.status(200).json({
                success: true,
                message: 'Employees fetched successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }
    static async show(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await EmployeeService.getById(+req.params.id);
            res.status(200).json({
                success: true,
                message: 'Employee fetched successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    static async store(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await EmployeeService.createWithUser(req.body);
            res.status(201).json({
                success: true,
                message: 'Employee created successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await EmployeeService.update(+req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Employee updated successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    static async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await EmployeeService.delete(+req.params.id);
            res.status(200).json({
                success: true,
                message: 'Employee deleted successfully',
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }
}
