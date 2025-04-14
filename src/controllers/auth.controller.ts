import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await AuthService.register(req.body);
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await AuthService.login(req.body);

            res.cookie('authToken', data.token, {
                httpOnly: false,
                secure: false,
                sameSite: 'lax',
                path: '/',
                maxAge: 5 * 60 * 1000, // 5 menit
            })
                .status(200)
                .json({
                    success: true,
                    message: 'User logged in successfully',
                    data,
                    meta: res.locals.meta,
                });
        } catch (error) {
            next(error);
        }
    }

    static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await AuthService.me(req.cookies.authToken);
            res.status(200).json({
                success: true,
                message: 'User fetched successfully',
                data,
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }
    static async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            res.clearCookie('authToken');
            res.status(200).json({
                success: true,
                message: 'User logged out successfully',
                meta: res.locals.meta,
            });
        } catch (error) {
            next(error);
        }
    }
}
