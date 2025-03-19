import prisma from "../config/prisma.js";
import { ResponseError } from "../error/response.errors.js";
import { EmployeeRequest, EmployeeResponse } from "../types/employee.type.js";
import { employeeSchema } from "../validations/employee.validation.js";
import { Validation } from "../validations/validation.js";
import { UserService } from "./user.service.js";

export class EmployeeService {
    static async getAll():Promise<EmployeeResponse[]>{ 
        const employees = await prisma.employee.findMany();

        return employees;
    }
    static async getById(id:number):Promise<EmployeeResponse>{
        const employee = await prisma.employee.findUnique({
            where: {
                id
            }
        });
        if(!employee){
            throw new Error("Employee not found");
        }
        return employee;
    }

    static async createWithUser(data:EmployeeRequest):Promise<EmployeeResponse>{
        const validated = Validation.validate<EmployeeRequest>(employeeSchema,data);
        return await prisma.$transaction(async (tx) => {
            const user = await UserService.create({
                username: validated.username,
                email: validated.email,
                roleId: validated.roleId
            });
            if (!user || !user.id) {
                throw new ResponseError( 500,"User creation failed");
            }
            return tx.employee.create({
                data: {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    userId: user.id,
                    job_position_id: data.job_position_id
                }
            });
        });
    }
    static async update(id:number,data:EmployeeRequest):Promise<EmployeeResponse>{
        const validated = Validation.validate<EmployeeRequest>(employeeSchema,data);
        return prisma.employee.update({
            where: {
                id
            },
            data: {
                first_name: validated.first_name,
                last_name: validated.last_name,
                job_position_id: validated.job_position_id
            }
        });
    }
    static async delete(id:number):Promise<EmployeeResponse>{
        const employee = await prisma.employee.findUnique({
            where: {
                id
            }
        });
        if(!employee){
            throw new ResponseError(404,"Employee not found");
        }
        return prisma.employee.delete({
            where: {
                id
            }
        });
    }

}