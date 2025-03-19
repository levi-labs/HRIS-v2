import { OfficeSchedule } from "@prisma/client";
import prisma from "../config/prisma.js";
import { ResponseError } from "../error/response.errors.js";
import { officeScheduleSchema } from "../validations/officeSchedule.validation.js";
import { Validation } from "../validations/validation.js";
import { OfficeScheduleRequest } from "../types/officeSchedule.type.js";

export class OfficeScheduleService {
    static async getAll():Promise<OfficeSchedule[]> {
        const result = await prisma.officeSchedule.findMany();
        return result;
    }

    static async getById(id:number):Promise<OfficeSchedule> {
        const result = await prisma.officeSchedule.findUnique({
            where: {
                id
            }
        });
        if(!result){
            throw new Error("Office Schedule not found");
        }
        return result;
    }

    static async create(data:OfficeScheduleRequest):Promise<OfficeSchedule> {
        const validated = Validation.validate<OfficeScheduleRequest>(officeScheduleSchema,data);
        const office = await prisma.office.findFirst({
            where: {
                id: validated.office_id,
            }
        });
        if(!office){
            throw new ResponseError(404,"Office not found");
        }
        const officeSchedule = await prisma.officeSchedule.findFirst({
            where: {
                officeId: validated.office_id,
                day: validated.day
            }
        });

        if(officeSchedule){
            throw new ResponseError(409,"Office Schedule already exists");
        }

        const result = await prisma.officeSchedule.create({
            data :{
                officeId: validated.office_id,
                day: validated.day,
                work_start: validated.work_start,
                work_end: validated.work_end,
                break_start: validated.break_start || null,
                break_end: validated.break_end || null,
                late_tolerance: validated.late_tolerance,
                early_tolerance: validated.early_tolerance
            }
        });

        return result;
    }

    static async update(id:number,data:OfficeScheduleRequest):Promise<OfficeSchedule> {
        const validated = Validation.validate<OfficeScheduleRequest>(officeScheduleSchema,data);
        const office = await prisma.office.findFirst({
            where: {
                id: validated.office_id,
            }
        });
        if(!office){
            throw new ResponseError(404,"Office not found");
        }
        const officeSchedule = await prisma.officeSchedule.findFirst({
            where: {
                officeId: validated.office_id,
                day: validated.day
            }
        });

        if(officeSchedule){
            throw new ResponseError(409,"Office Schedule already exists");
        }

        const result = await prisma.officeSchedule.update({
            where: {
                id
            },
            data: {
                officeId: validated.office_id,
                day: validated.day,
                work_start: validated.work_start,
                work_end: validated.work_end,
                break_start: validated.break_start || null,
                break_end: validated.break_end || null,
                late_tolerance: validated.late_tolerance,
                early_tolerance: validated.early_tolerance
            }
        });

        return result;
    }
       
    static async delete(id:number):Promise<void> {
        const officeSchedule = await prisma.officeSchedule.findUnique({
            where: {
                id
            }
        });
        if(!officeSchedule){
            throw new ResponseError(404,"Office Schedule not found");
        }
       await prisma.officeSchedule.delete({
            where: {
                id
            }
        });
    }
}