import {Request,Response,NextFunction} from "express";
import { AuthUser } from "../types/auth.type.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ResponseError } from "../error/response.errors.js";

dotenv.config();

export interface AuthRequest extends Request{
    cookies:{
        refreshToken:string
    },
    user:AuthUser
}
export class AuthMiddleware {
    static async checkAuth(req:AuthRequest,res:Response,next:NextFunction):Promise<void>{
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if(!token){
                throw new ResponseError(401,"Unauthorized");
            }
            const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET || '') as jwt.JwtPayload;
            req.user = {
                id: decoded.id,
                username: decoded.username,
                role: {
                    id: decoded.role.id,
                    name: decoded.role.name
                },
                token,
                expiresIn: decoded.expiresIn
            };
            next();
        } catch (error) {
            next(error);
        }
    }

    static async checkRefreshToken(req:AuthRequest,res:Response,next:NextFunction):Promise<void>{
        try {
            const refreshToken = req.cookies.refreshToken;
            if(!refreshToken){
                throw new ResponseError(401,"Unauthorized");
            }
            const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET || '') as jwt.JwtPayload;
            req.user = {
                id: decoded.id,
                username: decoded.username,
                role: {
                    id: decoded.role.id,
                    name: decoded.role.name
                },
                token: refreshToken,
                expiresIn: decoded.expiresIn
            };
            next();
        } catch (error) {
            next(error);            
        }
    }
}