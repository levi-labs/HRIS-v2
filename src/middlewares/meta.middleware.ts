import { randomBytes } from "crypto";
import { Request, Response, NextFunction } from "express";

const generateRequestId = ():string => randomBytes(16).toString("hex");
export const metaMiddleware = (req:Request,res:Response,next:NextFunction) => {
  
   res.locals.meta = {
       timestamp:Math.floor(Date.now() / 1000),
       requestId:req.headers["x-request-id"] || generateRequestId(),
       ip:req.ip
   };

   next();
}