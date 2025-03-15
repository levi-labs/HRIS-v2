
import { User } from "@prisma/client";
import prisma from "../config/prisma.js";
import { ResponseError } from "../error/response.errors.js";
import { UserPassword, UserRequest, UserResponse } from "../types/user.type.js";
import { Validation } from "../validations/validation.js";
import { passwordSchema, userSchema } from "../validations/user.validation.js";
import bcrypt from "bcrypt";
export class UserService{
    static async getAll():Promise<UserResponse[]>{
        const users = await prisma.user.findMany();
        return users;
    }

    static async getById(id:number):Promise<UserResponse>{

        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                username: true,
                email: true,
                roleId: true,
            }
        });

        if(!user){
            throw new ResponseError(404,"User not found");
        }
        
        return user;
    }

    static async create(req:UserRequest):Promise<UserResponse>{
        const validated = Validation.validate<UserRequest>(userSchema,req);
        const countUser = await prisma.user.count({
            where: {
                username: validated.username
            }
        });
        if(countUser > 0){
            throw new ResponseError(409,"User already exists");
        }
        const hashedPassword = await bcrypt.hash(validated.username,10);

        const user = await prisma.user.create({
            data: {
                username: validated.username,
                email: validated.username,
                password: hashedPassword,
                roleId: validated.roleId
            },
            select: {
                id: true,
                username: true,
                email: true,
                roleId: true,
            }
        });
        return user;
    }

    static async update(id:number,req:UserRequest):Promise<UserResponse>{
        const validated = Validation.validate<UserRequest>(userSchema,req);
        const user = await prisma.user.update({
            where: {
                id
            },
            data: {
                username: validated.username,
                email: validated.username,
                roleId: validated.roleId
            },
            select: {
                id: true,
                username: true,
                email: true,
                roleId: true,
            }
        });
        return user;
    }

    static async delete(id:number):Promise<void>{
        const countUser = await prisma.user.count({
            where: {
                id
            }
        });
        if(countUser === 0){
            throw new ResponseError(404,"User not found");
        }
        await prisma.user.delete({
            where: {
                id
            }
        });
      
    }

    static async changePassword(id:number,req:UserPassword):Promise<void>{
        const validated = Validation.validate<UserPassword>(passwordSchema,req);
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });
        if(!user){
            throw new ResponseError(404,"User not found");
        }
        const checkPassword = await bcrypt.compare(validated.oldPassword,user.password);

        if (!checkPassword) {
            throw new ResponseError(401,"Old password is incorrect");
            
        }

        if (validated.newPassword !== validated.confirmPassword) {
            throw new ResponseError(400,"Passwords do not match");
        }

        const hashedPassword = await bcrypt.hash(validated.newPassword,10);
        
        await prisma.user.update({
            where: {
                id
            },
            data: {
                password: hashedPassword
            },
        });
    }
}