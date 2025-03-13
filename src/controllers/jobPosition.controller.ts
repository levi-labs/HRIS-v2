import { Request, Response, NextFunction } from "express";
import { JobPositionService } from "../services/jobPosition.service.js";

export class JobPositionController {
    static async index(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const data = await JobPositionService.getAll();
            res.status(200).json({
                success: true,
                message: "Job positions fetched successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async show(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const data = await JobPositionService.getById(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Job position fetched successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }   

    static async store(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const data = await JobPositionService.create(req.body);
            res.status(201).json({
                success: true,
                message: "Job position created successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const data = await JobPositionService.update(+req.params.id,req.body);
            res.status(200).json({
                success: true,
                message: "Job position updated successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async destroy(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            await JobPositionService.delete(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Job position deleted successfully",
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }
}