import { Request, Response, NextFunction } from "express";
import { DepartmentService } from "../services/department.service.js";


export class DepartmentController {
    static async index(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const data = await DepartmentService.getAll();
            res.status(200).json({
                success: true,
                message: "Departments fetched successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async show(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const data = await DepartmentService.getById(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Department fetched successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async store(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const data = await DepartmentService.create(req.body);
            res.status(201).json({
                success: true,
                message: "Department created successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const data = await DepartmentService.update(+req.params.id,req.body);
            res.status(200).json({
                success: true,
                message: "Department updated successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async destroy(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            await DepartmentService.delete(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Department deleted successfully",
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }
}