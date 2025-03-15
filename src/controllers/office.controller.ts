
import { Request, Response, NextFunction } from "express";
import { OfficeService } from "../services/office.service.js";

export class OfficeController {
    static async index(req:Request, res:Response, next:NextFunction){
        try {
            const data = await OfficeService.getAll();
            res.status(200).json({
                success: true,
                message: "Offices fetched successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }
    static async show(req:Request, res:Response, next:NextFunction){
        try {
          
            const data = await OfficeService.getById(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Office fetched successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async store(req:Request, res:Response, next:NextFunction){
        try {
            const office = await OfficeService.create(req.body);
            res.status(201).json({
                success: true,
                message: "Office created successfully",
                data: office,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req:Request, res:Response, next:NextFunction){
        try {
            const office = await OfficeService.update(+req.params.id,req.body);
            res.status(200).json({
                success: true,
                message: "Office updated successfully",
                data: office,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async destroy(req:Request, res:Response, next:NextFunction){
        try {
            const id = parseInt(req.params.id);
            await OfficeService.delete(id);
            res.status(200).json({
                success: true,
                message: "Office deleted successfully",
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }
}