import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../config/prisma.js";
import { GeolocationCheckInResponse, GeolocationRequest } from "../types/geolocation.type.js";
import { geolocationSchema } from "../validations/geolocation.validation.js";
import { Validation } from "../validations/validation.js";
import {Decimal} from "decimal.js";

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
}