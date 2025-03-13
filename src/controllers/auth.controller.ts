import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import { info, log } from "console";
export class AuthController {
    static async register(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const data = await AuthService.register(req.body);
            res.status(201).json({
                success: true,
                message: "User created successfully",
                data
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const data = await AuthService.login(req.body);
            res.status(200).json({
                success: true,
                message: "User logged in successfully",
                data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }
}