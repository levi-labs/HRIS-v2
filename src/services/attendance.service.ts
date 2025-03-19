import { Attendance, AttendanceStatus, WorkScheduleStatus, WorkType } from "@prisma/client";
import prisma from "../config/prisma.js";
import { AttendanceRequest } from "../types/attendance.type.js";
import { attendanceSchema } from "../validations/attendance.validation.js";
import { Validation } from "../validations/validation.js";
import { ResponseError } from "../error/response.errors.js";
import { haversineFormula } from "../utils/haversine.js";
import {Decimal} from "decimal.js";
import { GeolocationService } from "./geolocation.service.js";
import e from "express";
import { getDayName, getTimeNow } from "../utils/getDays.js";

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
                date: new Date()
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
                },
                include: {
                    office: true
                }
            });

            if (!employeeOffice) {
                throw new ResponseError(404,"Data for employee office not found");
            }

            const scheduleIsWfh = await tx.employeeWorkSchedule.findFirst({
                where: {
                    employeeId: validate.employeeId,
                    scheduleDate: new Date(),
                    workType:WorkType.WFH,
                    status: WorkScheduleStatus.APPROVED
                }
            });

            if (scheduleIsWfh) {
                const attendance = await tx.attendance.create({
                    data: {
                        employeeId: validate.employeeId,
                        date: new Date(),
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
           
            
            const officeLatitude = Number(employeeOffice.office.latitude);
            const officeLongitude = Number(employeeOffice.office.longitude);


            const checkRadius = haversineFormula(officeLatitude, officeLongitude,latitude, longitude) * 1000;

            if (checkRadius > toleranceRadius) {
                throw new ResponseError(400,"You are too far from the office");
            }
            // const today = new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(new Date());

          

            const officeSchedule = await tx.officeSchedule.findFirst({
                where: {
                    officeId: employeeOffice.office.id,
                    day: getDayName(new Date())
                }
            });

            
            if (!officeSchedule) {
                throw new ResponseError(500,"Failed to find office schedule");
            }
            const currentTimeUTC= new Date();

            const status_late = getTimeNow(officeSchedule.work_start,officeSchedule.late_tolerance)
            
            console.log("officeLatitude",officeSchedule);
            
            console.log("status late",status_late);
            
          
            const attendance = await tx.attendance.create({
                data: {
                    employeeId: validate.employeeId,
                    date:currentTimeUTC,
                    checkIn: currentTimeUTC,
                    status : status_late ? AttendanceStatus.LATE : AttendanceStatus.PRESENT
                },
               
            });
            
            console.info("radius",checkRadius,toleranceRadius);
            await GeolocationService.checkIn(tx,{
                attendanceId: attendance.id,
                latitude: latitude.toString(),
                longitude: longitude.toString()
              
            });
            console.log("workInWIB",status_late.nowWIB);
            
            return {
                ...attendance,
                checkIn: status_late.nowWIB.toISOString().split("T")[1].split(".")[0],
                date:attendance.date.toISOString().split("T")[0],
                latitude: latitude.toString(),
                longitude: longitude.toString()
            };
        });
    }
}