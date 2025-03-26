import { Request, Response, NextFunction } from "express";
import { DocumentService } from "../services/document.service.js";
export class DocumentController {
    static async index(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await DocumentService.getAll();
            res.status(200).json({
                success: true,
                message: "Documents fetched successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }
    static async show(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await DocumentService.getById(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Document fetched successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }
    static async store(req: Request, res: Response, next: NextFunction) {
        try {
           
            const data = await DocumentService.create({...req.body,filePath: req.file!.path});
            res.status(201).json({
                success: true,
                message: "Document created successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const body = {
                employeeId: +req.body.employeeId,
                title : req.body.title,
                filePath: req.file!.path
            }
            console.log("body-update",body);
            const data = await DocumentService.update(+req.params.id, body);

            res.status(200).json({
                success: true,
                message: "Document updated successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await DocumentService.delete(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Document deleted successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }
}