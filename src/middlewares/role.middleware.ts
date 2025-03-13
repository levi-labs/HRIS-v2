import { NextFunction } from "express";
import { ResponseError } from "../error/response.errors.js";
import { AuthRequest } from "./auth.middleware.js";

export class RoleMiddleware {
    async checkRole(req:AuthRequest,res:Response,next:NextFunction):Promise<void>{
        const user = req.user;
        if(user.role.name !== "admin"){
            throw new ResponseError(403,"Forbidden");
        }
        next();
    }
}