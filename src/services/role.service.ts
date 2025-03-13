import { RoleRequest, RoleResponse } from "../types/role.type.js";
import prisma from "../config/prisma.js";
import { ResponseError } from "../error/response.errors.js";
import { Validation } from "../validations/validation.js";
import { roleSchema } from "../validations/role.validation.js";

export class RoleService{
    static async getAll():Promise<RoleResponse[]>{
        const roles = await prisma.role.findMany({
            select: {
                id: true,
                name: true
            }
        });
        return roles;
    }

    static async getById(id:number):Promise<RoleResponse>{
        const role = await prisma.role.findFirst({
            where: {
                id
            },
            select: {
                id: true,
                name: true
            }
        });
        if(!role){
            throw new ResponseError(404,"Role not found");
        }
        return role;
    }

    static async create(req:RoleRequest):Promise<RoleResponse>{
        const validated = Validation.validate<RoleRequest>(roleSchema,req);

        const countRole = await prisma.role.count({
            where: {
                name: validated.name
            }
        });

        if(countRole > 0){
            throw new ResponseError(409,"Role already exists");
        }
        
        const role = await prisma.role.create({
            data: {
                name: validated.name
            },
            select: {
                id: true,
                name: true
            }
        });
        return role;
    }

    static async update(id:number,req:RoleRequest):Promise<RoleResponse>{
        const validated = Validation.validate<RoleRequest>(roleSchema,req);

        const existingRole = await prisma.role.findUnique({
            where: {
                id
            }
        })

        if(!existingRole){
            throw new ResponseError(404,"Role not found");
        }

        if(existingRole.name === validated.name){
           return existingRole;
        }

        const countRole = await prisma.role.count({
            where: {
                name: validated.name,
                NOT: {
                    id
                }
            }
        });

        if(countRole > 0){
            throw new ResponseError(409,"Role already exists");
        }
        
        const role = await prisma.role.update({
            where: {
                id
            },
            data: {
                name: validated.name
            },
            select: {
                id: true,
                name: true
            }
        });
        return role;
    }

    static async delete(id:number):Promise<void>{
        const existingRole = await prisma.role.findUnique({
            where: {
                id
            }
        })

        if(!existingRole){
            throw new ResponseError(404,"Role not found");
        }
        await prisma.role.delete({
            where: {
                id
            }
        });
    }
}