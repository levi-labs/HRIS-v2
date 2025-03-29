import { Payroll } from "@prisma/client";
import prisma from "../config/prisma.js";
import { ResponseError } from "../error/response.errors.js";

export class PayrollService {
   static async getAll():Promise<Payroll[]> {
       const result = await prisma.payroll.findMany();
       return result;
   }

   static async getById(id:number):Promise<Payroll> {
    const result = await prisma.payroll.findUnique({
        where: {
            id
        }
    });
    if(!result){
        throw new Error("Payroll not found");
    }
    return result;
   }

   static async create(data:Payroll):Promise<Payroll> {
    const result = await prisma.payroll.create({
        data
    });
    return result;
   }

   static async update(id:number,data:Payroll):Promise<Payroll> {
    const payrollExists = await prisma.payroll.findFirst({
        where: {
            id
        }
    });

    if (!payrollExists) {
        throw new ResponseError(404,"Data for payroll not found");
    }

    const result = await prisma.payroll.update({
        where: {
            id
        },
        data
    });
    return result;
   }

   static async delete(id:number):Promise<Payroll> {
    const checkExistPayroll = await prisma.payroll.findFirst({
        where: {
            id
        }
    });

    if (!checkExistPayroll) {
        throw new ResponseError(404,"Data for payroll not found");
    }
    const result = await prisma.payroll.delete({
        where: {
            id
        }
    });
    return result;
   }
}