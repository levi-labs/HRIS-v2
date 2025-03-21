import { TransferRequest, TransferRequestStatus } from "@prisma/client";
import prisma from "../config/prisma.js";
import { ResponseError } from "../error/response.errors.js";
import { TransferRequestForEmployee, TransferRequestForHrd } from "../types/transferRequest.type.js";
import { Validation } from "../validations/validation.js";
import { transferRequestForEmployeeSchema, transferRequestForHRDSchema } from "../validations/transferRequest.validation.js";


export class TransferRequestService {
    static async getAll():Promise<TransferRequest[]> {
        const result = await prisma.transferRequest.findMany();
        return result;
    }

    static async getById(id:number):Promise<TransferRequest> {
        const result = await prisma.transferRequest.findUnique({
            where: {
                id
            }
        });

        if(!result){
            throw new ResponseError( 404,"Transfer Request not found");
        }
        return result;
    }

    static async createFromEmployee(data:TransferRequestForEmployee):Promise<TransferRequest> {
        const validate = Validation.validate<TransferRequestForEmployee>(transferRequestForEmployeeSchema,data);
        const count = await prisma.transferRequest.count({
            where: {
                employeeId: validate.employeeId,
                fromOffice: validate.fromOffice,
                toOffice: validate.toOffice
            }
        });

        if (count > 0) {
            throw new ResponseError(409,"Data for transfer request already exists");
        }

       return await prisma.transferRequest.create({
            data
        });
      
    }
    static async updateFromEmployee(id:number,data:TransferRequestForEmployee):Promise<TransferRequest> {
        const validate = Validation.validate<TransferRequestForEmployee>(transferRequestForEmployeeSchema,data);
        const checkExistRequest = await prisma.transferRequest.findFirst({
            where: {
                id
            }
        }); 

        if (!checkExistRequest) {
            throw new ResponseError(404,"Data for transfer request not found");
        }
        if (checkExistRequest.status !== TransferRequestStatus.PENDING) {
            throw new ResponseError(409,"Transfer request cannot be updated because it is not pending");
        }
        const result = await prisma.transferRequest.update({
            where: {
                id
            },
            data: {
                employeeId: validate.employeeId,
                fromOffice: validate.fromOffice,
                toOffice: validate.toOffice
            }    
        });

        return result;
    }
   

    static async createFromHRD(data:TransferRequestForHrd):Promise<TransferRequest> {
        const validate = Validation.validate<TransferRequestForHrd>(transferRequestForHRDSchema,data);
        const count = await prisma.transferRequest.count({
            where: {
                employeeId: validate.employeeId,
                fromOffice: validate.fromOffice,
                toOffice: validate.toOffice,
                approvedBy: validate.approvedBy
            }
        }); 

        if (count > 0) {
            throw new ResponseError(409,"Data for transfer request already exists");
        }   

        return await prisma.transferRequest.create({
            data
        });
    }
    static async updateFromHRD(id:number,data:TransferRequestForHrd):Promise<TransferRequest> {
        const validate = Validation.validate<TransferRequestForHrd>(transferRequestForHRDSchema,data);
        const checkExistRequest = await prisma.transferRequest.findFirst({
            where: {
                id
            }
        });

        if (!checkExistRequest) {
            throw new ResponseError(404,"Data for transfer request not found");
        }
        const result = await prisma.transferRequest.update({
            where: {
                id    
            },
            data: {
                employeeId: validate.employeeId,
                fromOffice: validate.fromOffice,
                toOffice: validate.toOffice,
                approvedBy: validate.approvedBy
            }
        });

        return result;
    }

    static async delete(id:number):Promise<TransferRequest> {
        const checkExistRequest = await prisma.transferRequest.findFirst({
            where: {
                id
            }
        });
        if (!checkExistRequest) {
            throw new ResponseError(404,"Data for transfer request not found");
        }
        if (checkExistRequest.status !== TransferRequestStatus.PENDING) {
            throw new ResponseError(409,"Transfer request cannot be deleted because it is not pending");
        }

        const result = await prisma.transferRequest.delete({
            where: {
                id
            }
        });
        return result;
    }
    
    static async approve(id:number):Promise<TransferRequest> {
        const checkExistRequest = await prisma.transferRequest.findFirst({
            where: {
                id
            }
        });

        if (!checkExistRequest) {
            throw new ResponseError(404,"Data for transfer request not found");
        }

        if (checkExistRequest.status !== TransferRequestStatus.PENDING) {
            throw new ResponseError(409,"Transfer request cannot be approved because it is not pending");
        }

        const result = await prisma.transferRequest.update({
            where: {
                id
            },
            data: {
                status: TransferRequestStatus.APPROVED
            }
        });
        
        return result;
      
    }

    static async reject(id:number):Promise<TransferRequest> {
        const checkExistRequest = await prisma.transferRequest.findFirst({
            where: {
                id
            }
        });

        if (!checkExistRequest) {
            throw new ResponseError(404,"Data for transfer request not found");
        }

        if (checkExistRequest.status !== TransferRequestStatus.PENDING) {
            throw new ResponseError(409,"Transfer request cannot be rejected because it is not pending");
        }

        const result = await prisma.transferRequest.update({
            where: {
                id
            },
            data: {
                status: TransferRequestStatus.REJECTED
            }
        });
        return result;
    }


}