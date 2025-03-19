import { Attendance } from "@prisma/client";
import prisma from "../config/prisma.js";
import { AttendanceRequest } from "../types/attendance.type.js";
import { attendanceSchema } from "../validations/attendance.validation.js";
import { Validation } from "../validations/validation.js";
import { ResponseError } from "../error/response.errors.js";
import { haversineFormula } from "../utils/haversine.js";
import {Decimal} from "decimal.js";
import { GeolocationService } from "./geolocation.service.js";

export class AttendanceService {
    static async getAll():Promise<Attendance[]> {
        const result = await prisma.attendance.findMany();
        return result;
    }

    static async getById(id:number):Promise<Attendance> {
        const result = await prisma.attendance.findUnique({
            where: {
                id
            }
        });
        if(!result){
            throw new Error("Attendance not found");
        }
        return result;
    }

    static async create(data:AttendanceRequest) {
        const validate = Validation.validate<AttendanceRequest>(attendanceSchema,data);
        const latitude = Number(validate.latitude);
        const longitude = Number(validate.longitude);
        const toleranceRadius = 150;
        const attendanceExists = await prisma.attendance.findFirst({
            where: {
                employeeId: validate.employeeId,
                date: new Date(validate.date)
            }
        });

        if (attendanceExists) {
            throw new ResponseError(409,"Data for attendance already exists");
        }

        return prisma.$transaction(async (tx) => {
            const employeeOffice = await tx.employeeOffice.findFirst({
                where: {
                    employeeId: validate.employeeId,
                    isActive: true
                }
            });

            if (!employeeOffice) {
                throw new ResponseError(404,"Data for employee office not found");
            }

            const scheduleIsWfh = await tx.employeeWorkSchedule.findFirst({
                where: {
                    employeeId: validate.employeeId,
                    scheduleDate: new Date(validate.date),
                    workType: "WFH",
                    status: "APPROVED"
                }
            });

            if (scheduleIsWfh) {
                const attendance = await tx.attendance.create({
                    data: {
                        employeeId: validate.employeeId,
                        date: new Date(validate.date),
                        checkIn: new Date(),
                    }
                });
                
                await tx.geolocation.create({
                    data: {
                        attendanceId: attendance.id,
                        checkInLatitude: new Decimal(latitude),
                        checkInLongitude: new Decimal(longitude)
                    }
                });

                return attendance;
            }

            // if (!scheduleIsWfh) {
            //     throw new ResponseError(400,"You are not working from home today");
            // }

           
            const office = await tx.office.findUnique({
                where: {
                    id: employeeOffice.officeId
                }
            });

            if (!office) {
                throw new ResponseError(500,"Failed to find office");
            }
            const officeLatitude = Number(office.latitude);
            const officeLongitude = Number(office.longitude);


            const checkRadius = haversineFormula(officeLatitude, officeLongitude,latitude, longitude) * 1000;

            if (checkRadius > toleranceRadius) {
                throw new ResponseError(400,"You are too far from the office");
            }

            const attendance = await tx.attendance.create({
                data: {
                    employeeId: validate.employeeId,
                    date: new Date(),
                    checkIn: new Date(),
                },
               
            });
            
            if (!attendance) {
                throw new ResponseError(500,"Failed to create attendance");
            }
            console.info("radius",checkRadius,toleranceRadius);
            await GeolocationService.checkIn(tx,{
                attendanceId: attendance.id,
                latitude: latitude.toString(),
                longitude: longitude.toString()
              
            });
            // await tx.geolocation.create({
            //     data: {
            //         attendanceId: attendance.id,
            //         checkInLatitude: new Decimal(latitude),
            //         checkInLongitude: new Decimal(longitude)
            //     }
            // });

            return {
                ...attendance,
                latitude: latitude.toString(),
                longitude: longitude.toString()
            };
        });
    }
}