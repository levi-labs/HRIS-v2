import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';

export class UserController {
    static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await UserService.getAll();
            res.status(200).json({
                success: true,
                message: 'Users fetched successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    static async show(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await UserService.getById(+req.params.id);
            res.status(200).json({
                success: true,
                message: 'User fetched successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await UserService.update(+req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }
    static async updatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await UserService.changePassword(+req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Password updated successfully',
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }
}
