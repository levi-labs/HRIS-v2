import { NextFunction, Request, Response } from "express";
import { ResponseError } from "../error/response.errors.js";
import { ZodError } from "zod";
export const errorMiddleware = async (err:Error,req:Request,res:Response,next:NextFunction) => {
    if(err instanceof ZodError){
        const errorsMessage = err.errors.map((error) => {
            return {
                message:error.message,
                errors :error.path.join("."),
            }
        })
        res.status(422).json({
            success: false,
            message: "Validation Error",
            errors: errorsMessage
        });
    }else if(err instanceof ResponseError){
        res.status(err.status).json({
            message: err.message
        });
    }else{
        res.status(500).json({
            message: err.message
        });
    }
    next();
}