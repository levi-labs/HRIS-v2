import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

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
            // res.cookie('authToken', data.token, {
            //     httpOnly: true,
            //     // secure: req.secure || req.headers['x-forwarded-proto'] === 'https', // Kirim hanya melalui HTTPS
            //     secure: false,
            //     sameSite: 'lax',
            //     path: '/',
            //     maxAge: 60 * 60 * 1000,
            // });

            res.cookie('authToken', data.token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 1000, // 1 hour
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
}
