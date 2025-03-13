import { Request, Response, NextFunction } from "express";
import { RoleService } from "../services/role.service.js";

export class RoleController{
    static async index (req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const roles = await RoleService.getAll();
            res.status(200).json({
                success: true,
                message: "Roles fetched successfully",
                data: roles,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }
    static async show(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const role = await RoleService.getById(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Role fetched successfully",
                data: role,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async store(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const role = await RoleService.create(req.body);
            res.status(201).json({
                success: true,
                message: "Role created successfully",
                data: role,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }   

    static async update(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const role = await RoleService.update(+req.params.id,req.body);
            res.status(200).json({
                success: true,
                message: "Role updated successfully",
                data: role,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async destroy(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            await RoleService.delete(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Role deleted successfully",
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

}