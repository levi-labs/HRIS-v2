import prisma from "../config/prisma.js";
import { ResponseError } from "../error/response.errors.js";
import { OfficeRequest, OfficeResponse } from "../types/office.type.js";
import { officeSchema } from "../validations/office.validation.js";
import { Validation } from "../validations/validation.js";
export class OfficeService {
    static async getAll():Promise<OfficeResponse[]>{
        const offices = await prisma.office.findMany({
            select: {
                id: true,
                name: true,
                latitude: true,
                longitude: true
            }
        });
       
        return offices.map((office) => ({
            ...office,  
            latitude: office.latitude.toString(),
            longitude: office.longitude.toString()
        }));
    }

    static async getById(id:number):Promise<OfficeResponse>{
        const office = await prisma.office.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                latitude: true,
                longitude: true
            }
        });
        if(!office){
            throw new ResponseError(404,"Office not found");
        }
        return {
            ...office,  
            latitude: office.latitude.toString(),
            longitude: office.longitude.toString()
        };
    }

    static async create(req:OfficeRequest):Promise<OfficeResponse>{
        const validated = Validation.validate<OfficeRequest>(officeSchema,req);
        const office = await prisma.office.create({
            data: {
                name: validated.name,
                latitude: validated.latitude,
                longitude: validated.longitude
            },
            select: {
                id: true,
                name: true,
                latitude: true,
                longitude: true
            }
        });
        return {
            ...office,  
            latitude: office.latitude.toString(),
            longitude: office.longitude.toString()
        };
    }

    static async update(id:number,req:OfficeRequest):Promise<OfficeResponse>{
        const validated = Validation.validate<OfficeRequest>(officeSchema,req);
       
        const office = await prisma.office.findUnique({
            where: {
                id
            }
        });

        if(!office){
            throw new ResponseError(404,"Office not found");
        }   

        const countOffice = await prisma.office.count({
            where: {
                name: validated.name,
                NOT: {
                    id
                }
            }
        });

        if(countOffice > 0){
            throw new ResponseError(409,"Office already exists");
        }     
        const updatedOffice = await prisma.office.update({
            where: {
                id
            },
            data: {
                name: validated.name,
                latitude: validated.latitude,
                longitude: validated.longitude
            },
            select: {                
                id: true,
                name: true,
                latitude: true,
                longitude: true
            }
        });
        return {
            ...updatedOffice,  
            latitude: updatedOffice.latitude.toString(),
            longitude: updatedOffice.longitude.toString()
        };
    }

    static async delete(id:number):Promise<void>{
        const office = await prisma.office.findUnique({
            where: {
                id
            }
        });
        if(!office){
            throw new ResponseError(404,"Office not found");
        }
        await prisma.office.delete({
            where: {
                id
            }
        });
    }
}