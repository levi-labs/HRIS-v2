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
}
