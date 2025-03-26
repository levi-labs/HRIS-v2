import { NextFunction, Request, Response } from "express";
import { ResponseError } from "../error/response.errors.js";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import multer from "multer";
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
            success: false,
            message: err.message
        });
    }else if (err instanceof jwt.TokenExpiredError) {
         res.status(401).json({
            success: false,
            message: "Token has expired, please login again"
        });
    } else if (err instanceof jwt.JsonWebTokenError) {
         res.status(401).json({
            success: false,
            message: "Invalid token, authentication failed"
        });
    } else if (err instanceof jwt.NotBeforeError) {
         res.status(401).json({
            success: false,
            message: "Token is not active yet"
        });
    }else if(err instanceof multer.MulterError){
        let message = "File upload error";

        //file format allowed just pdf

        if (err.code === "LIMIT_FILE_SIZE") {
            message = "File size is too large (Max: 5MB)";
            res.status(413).json({ success: false, message });
          }
      
          if (err.code === "LIMIT_UNEXPECTED_FILE") {
            message = "Unexpected file field";
             res.status(400).json({ success: false, message });
          }
      
            res.status(400).json({ success: false, message });
    }else{
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
   
}