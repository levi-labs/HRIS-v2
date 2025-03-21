import { Request, Response, NextFunction } from "express";
import { TransferRequestService } from "../services/transferRequest.service.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";

export class TransferRequestController {

    static async index (req:Request, res:Response, next:NextFunction) {
        try {
            const data = await TransferRequestService.getAll();
            res.status(200).json({
                success: true,
                message: "Transfer requests fetched successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async show (req:Request, res:Response, next:NextFunction) {
        try {
            const data = await TransferRequestService.getById(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Transfer request fetched successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async storeFromEmployee (req:AuthRequest, res:Response, next:NextFunction) {
        try {
            const data = await TransferRequestService.createFromEmployee(req.body);
            res.status(201).json({
                success: true,
                message: "Transfer request created successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }
    static async updateFromEmployee (req:AuthRequest, res:Response, next:NextFunction) {
        try {
            const data = await TransferRequestService.updateFromEmployee(+req.params.id, req.body); 
            res.status(200).json({
                success: true,
                message: "Transfer request updated successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }
      

    static async storeFromHRD (req:AuthRequest, res:Response, next:NextFunction) {
        try {
            const data = await TransferRequestService.createFromHRD(req.body);
            res.status(201).json({
                success: true,
                message: "Transfer request created successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateFromHRD (req:AuthRequest, res:Response, next:NextFunction) {
        try {
            const data = await TransferRequestService.updateFromHRD(+req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: "Transfer request updated successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async destroy (req:Request, res:Response, next:NextFunction) {
        try {
            const data = await TransferRequestService.delete(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Transfer request deleted successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async approve (req:Request, res:Response, next:NextFunction) {
        try {
            const data = await TransferRequestService.approve(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Transfer request approved successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }

    static async reject (req:Request, res:Response, next:NextFunction) {
        try {
            const data = await TransferRequestService.reject(+req.params.id);
            res.status(200).json({
                success: true,
                message: "Transfer request rejected successfully",
                data: data,
                meta: res.locals.meta
            });
        } catch (error) {
            next(error);
        }
    }
}