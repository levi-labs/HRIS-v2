import { NextFunction , Response} from "express";
import { ResponseError } from "../error/response.errors.js";
import { AuthRequest } from "./auth.middleware.js";

// export class RoleMiddleware {
//     static checkRole(role:string[]) {
//         return (req:AuthRequest,res:Response,next:NextFunction):void => {
//             try {
//                if(!req.user || !role.includes(req.user.role.name)){
//                    throw new ResponseError(403,"Forbidden access");
//                }
//                 next();
//             } catch (error) {
//                 next(error);
//             }
//         }
//     }
// }