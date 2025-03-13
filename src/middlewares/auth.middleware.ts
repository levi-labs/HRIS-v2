import {Request,Response,NextFunction} from "express";
import { AuthUser } from "../types/auth.type.js";
import jwt from "jsonwebtoken";
import { ResponseError } from "../error/response.errors.js";
export interface AuthRequest extends Request{
    cookies:{
        refreshToken:string
    },
    user?:AuthUser
}
export class AuthMiddleware {
    static checkAuth(req:AuthRequest,res:Response,next:NextFunction):void{
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new ResponseError(401, "Unauthorized: Token is missing or invalid");
            }
            
            const token = authHeader.split(" ")[1];
            if(!token){
                throw new ResponseError(401,"Unauthorized: Token is missing or invalid");
            }
            const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET || '') as jwt.JwtPayload;
            
            if(!decoded){
                throw new ResponseError(401,"Unauthorized: Token is missing or invalid");
            }

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