import { OfficeSchedule } from "@prisma/client";
import prisma from "../config/prisma.js";
import { ResponseError } from "../error/response.errors.js";

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

    static async create(data:OfficeSchedule):Promise<OfficeSchedule> {
        const office = await prisma.office.findFirst({
            where: {
                id: data.officeId,
            }
        });
        if(!office){
            throw new ResponseError(404,"Office not found");
        }
        const officeSchedule = await prisma.officeSchedule.findFirst({
            where: {
                officeId: data.officeId,
                day: data.day
            }
        });

        if(officeSchedule){
            throw new ResponseError(409,"Office Schedule already exists");
        }

        const result = await prisma.officeSchedule.create({
            data
        });

        return result;
    }

    static async update(id:number,data:OfficeSchedule):Promise<OfficeSchedule> {
        const office = await prisma.office.findFirst({
            where: {
                id: data.officeId,
            }
        });
        if(!office){
            throw new ResponseError(404,"Office not found");
        }
        const officeSchedule = await prisma.officeSchedule.findFirst({
            where: {
                officeId: data.officeId,
                day: data.day
            }
        });

        if(officeSchedule){
            throw new ResponseError(409,"Office Schedule already exists");
        }

        const result = await prisma.officeSchedule.update({
            where: {
                id
            },
            data
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