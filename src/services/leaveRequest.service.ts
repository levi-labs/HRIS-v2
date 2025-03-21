import { LeaveRequest, LeaveStatus, LeaveType } from "@prisma/client";
import prisma from "../config/prisma.js";
import { LeaveRequestFromEmployee, LeaveRequestFromHRD } from "../types/leaveRequest.type.js";
import { Validation } from "../validations/validation.js";
import { leaveRequestEmployeeSchema, leaveRequestHrdSchema } from "../validations/leaveRequest.validation.js";
import { start } from "repl";
import { ResponseError } from "../error/response.errors.js";

export class leaveRequestService{
    static async getAll():Promise<LeaveRequest[]> {
        const result =  await prisma.leaveRequest.findMany();
        return result;
    }

    static async getById(id:number):Promise<LeaveRequest> {
        const result = await prisma.leaveRequest.findUnique({
            where: {
                id
            }
        });
        if(!result){
            throw new ResponseError(404,"Leave Request not found");
        }
        return result;
    }
    static async createFromEmployee(req:LeaveRequestFromEmployee):Promise<LeaveRequest> {
        const validate = Validation.validate<Omit<LeaveRequestFromEmployee, "user">>(leaveRequestEmployeeSchema.omit({user: true}),req);
        const checkAuth = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                employees: {
                    select: {
                        id: true
                    }
                },

            }
        });

        if (!checkAuth || !checkAuth.employees) {
            throw new ResponseError(401,"User not found or has been deleted");
        }

        const checkExistRequest = await prisma.leaveRequest.findFirst({
            where:{
                employeeId: checkAuth.employees.id,
                startDate: new Date(validate.startDate),
                endDate: new Date(validate.endDate)
            }
        });

        if (checkExistRequest) {
            throw new ResponseError(409,"Data for leave request already exists");
        }

        const result = await prisma.leaveRequest.create({
            data:{
                employeeId: checkAuth.employees.id,
                startDate: new Date(validate.startDate),
                endDate: new Date(validate.endDate),
                reason: validate.reason,
                leaveType: validate.leaveType,
            }
        });

        return result
    }

    static async createFromHRD(data:LeaveRequestFromHRD):Promise<LeaveRequest> {
        const validate = Validation.validate<LeaveRequestFromHRD>(leaveRequestHrdSchema,data);
        const checkExistRequest = await prisma.leaveRequest.findFirst({
            where: {
                employeeId: validate.employeeId,
                startDate: new Date(validate.startDate),
                endDate: new Date(validate.endDate)
            }
        });

        if (checkExistRequest) {
            throw new ResponseError(409,"Data for leave request already exists");
        }

        const result = await prisma.leaveRequest.create({
            data: {
                employeeId: validate.employeeId,
                startDate: new Date(validate.startDate),
                endDate: new Date(validate.endDate),
                reason: validate.reason,
                leaveType: validate.leaveType,
                status: validate.status
            }
        });
        return result;
    }

    static  async update(id:number,data:LeaveRequestFromEmployee):Promise<LeaveRequest> {
        const checkExistRequest = await prisma.leaveRequest.findFirst({
            where: {
                id
            }
        });

        if (!checkExistRequest) {
            throw new ResponseError(404,"Data for leave request not found");
        }
        const validate = Validation.validate<Omit<LeaveRequestFromEmployee, "user">>(leaveRequestEmployeeSchema.omit({user: true}),data);
        const result = await prisma.leaveRequest.update({
            where: {
                id    
            },
            data: {
                startDate: new Date(validate.startDate),
                endDate: new Date(validate.endDate),
                reason: validate.reason,
                leaveType: validate.leaveType,
            }    
        });
        return result;
     
    }
    static async delete(id:number):Promise<LeaveRequest> {
        const checkExistRequest = await prisma.leaveRequest.findFirst({
            where: {
                id
            }    
        });
        if (!checkExistRequest) {
            throw new ResponseError(404,"Data for leave request not found");
        }
        
        if (checkExistRequest.status !== LeaveStatus.PENDING) {
            throw new ResponseError(409,"Leave request cannot be deleted because it is not pending"); 
        }

        const result = await prisma.leaveRequest.delete({
            where: {
                id
            }
        });
        return result;
    }   
}