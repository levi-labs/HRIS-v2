import { Request, Response, NextFunction } from 'express';
import { leaveRequestService } from '../services/leaveRequest.service.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export class LeaveRequestController {
    static async index(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await leaveRequestService.getAll();
            res.status(200).json({
                success: true,
                message: 'Leave requests fetched successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    static async show(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await leaveRequestService.getById(+req.params.id);
            res.status(200).json({
                success: true,
                message: 'Leave request fetched successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    static async storeAsEmployee(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const data = await leaveRequestService.createFromEmployee(req.user!, req.body);
            res.status(201).json({
                success: true,
                message: 'Leave request created successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    static async storeAsHRD(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const data = await leaveRequestService.createFromHRD(req.user!, req.body);
            res.status(201).json({
                success: true,
                message: 'Leave request created successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateAsEmployee(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const data = await leaveRequestService.updateFromEmployee(
                +req.params.id,
                req.user!,
                req.body,
            );
            res.status(200).json({
                success: true,
                message: 'Leave request updated successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateAsHRD(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const data = await leaveRequestService.updateFromHRD(
                +req.params.id,
                req.user!,
                req.body,
            );
            res.status(200).json({
                success: true,
                message: 'Leave request updated successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    static async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await leaveRequestService.delete(+req.params.id);
            res.status(200).json({
                success: true,
                message: 'Leave request deleted successfully',
                data: data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }
}
