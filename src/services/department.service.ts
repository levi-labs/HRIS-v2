import { DepartmentRequest, DepartmentResponse } from "../types/department.type.js";
import prisma from "../config/prisma.js";
import { ResponseError } from "../error/response.errors.js";
import { departmentSchema } from "../validations/department.validation.js";
import { Validation } from "../validations/validation.js";
export class DepartmentService {
    static async getAll():Promise<DepartmentResponse[]>{
        const departments = await prisma.department.findMany({
            select: {
                id: true,
                name: true,
                phone: true,
               
            }
        });
        return departments;
    }
    
    static async getById(id:number):Promise<DepartmentResponse>{
        const department = await prisma.department.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                phone: true,
            }
        });
        if(!department){
            throw new ResponseError(404,"Department not found");
        }
        return department;
    }
    static async create(req:DepartmentRequest):Promise<DepartmentResponse>{
        const validated = Validation.validate<DepartmentRequest>(departmentSchema,req);
        const countDepartment = await prisma.department.count({
            where: {
                name: validated.name
            }
        });

        if(countDepartment > 0){
            throw new ResponseError(409,"Department already exists");
        }

        const department = await prisma.department.create({
            data: {
                name: validated.name,
                phone: validated.phone,
            },
            select: {
                id: true,
                name: true,
                phone: true,
            }
        });
        return department;
    }

    static async update(id:number,req:DepartmentRequest):Promise<DepartmentResponse>{
        const validated = Validation.validate<DepartmentRequest>(departmentSchema,req);
        const department = await prisma.department.findUnique({
            where: {
                id
            }
        });
        if(!department){
            throw new ResponseError(404,"Department not found");
        }        
        const countDepartment = await prisma.department.count({
            where: {
                name: validated.name,
                NOT: {
                    id
                }
            }
        });        
        if(countDepartment > 0){
            throw new ResponseError(409,"Department already exists with this name");        
        }
        const updatedDepartment = await prisma.department.update({
            where: {
                id
            },
            data: {
                name: validated.name,
                phone: validated.phone,
            },
            select: {
                id: true,
                name: true,
                phone: true,
            }
        });
        return updatedDepartment;
    }

    static async delete(id:number):Promise<void>{
        const department = await prisma.department.findUnique({
            where: {
                id
            }
        });
        if(!department){
            throw new ResponseError(404,"Department not found");
        }
        await prisma.department.delete({
            where: {
                id
            },
        });        
       
    }
}