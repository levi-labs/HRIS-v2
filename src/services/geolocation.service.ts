import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../config/prisma.js";
import { GeolocationCheckInResponse, GeolocationRequest } from "../types/geolocation.type.js";
import { geolocationSchema } from "../validations/geolocation.validation.js";
import { Validation } from "../validations/validation.js";
import {Decimal} from "decimal.js";
import { ResponseError } from "../error/response.errors.js";

export class GeolocationService {
    static async checkIn(tx:Prisma.TransactionClient,req:GeolocationRequest):Promise<void>{
        const validated = Validation.validate<GeolocationRequest>(geolocationSchema,req);
        await tx.geolocation.create({
            data: {
                attendanceId: validated.attendanceId,
                checkInLatitude: validated.latitude,
                checkInLongitude: validated.longitude
            },
        });

    }

    static async checkOut(tx:Prisma.TransactionClient,req:GeolocationRequest):Promise<GeolocationCheckInResponse>{
        const validated = Validation.validate<GeolocationRequest>(geolocationSchema,req);
        const geolocationIsExists = await tx.geolocation.findFirst({
            where: {
                attendanceId: validated.attendanceId
            }
        });

        if (!geolocationIsExists) {
            throw new ResponseError(404,"Geolocation not found");
        }
        
        const result = await tx.geolocation.update({
            where: {
                id: geolocationIsExists.id
            },
            data: {
                checkOutLatitude: validated.latitude,
                checkOutLongitude: validated.longitude
            }
        });

        return {
            ...result,
            checkInLatitude: result.checkInLatitude.toString(), 
            checkInLongitude: result.checkInLongitude.toString()
        };
    }
}