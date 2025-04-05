import { Request, Response, NextFunction } from 'express';
import { DepartmentOfficeService } from '../services/departmentOffice.service.js';

export class DepartmentOfficeController {
    static async index(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await DepartmentOfficeService.getAll();
            res.status(200).json({
                success: true,
                message: 'Department offices fetched successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }
    static async show(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await DepartmentOfficeService.getById(+req.params.id);
            res.status(200).json({
                success: true,
                message: 'Department office fetched successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }
    static async store(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await DepartmentOfficeService.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Department office created successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await DepartmentOfficeService.update(+req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Department office updated successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }
    static async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await DepartmentOfficeService.delete(+req.params.id);
            res.status(200).json({
                success: true,
                message: 'Department office deleted successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }
}
