import prisma from "../config/prisma.js";
import { ResponseError } from "../error/response.errors.js";
import { JobPositionRequest, JobPositionResponse } from "../types/jobPosition.type.js";
export class JobPositionService {
   static async getAll():Promise<JobPositionResponse[]>{
        const jobPositions = await prisma.jobPosition.findMany({
            select: {
                id: true,
                name: true,
                level: true,
                salary_min: true,
                salary_max: true,
                department_id: true
            }
        });
        return jobPositions.map((jobPosition) => ({
            ...jobPosition,
            salary_min: jobPosition.salary_min.toString(),
            salary_max: jobPosition.salary_max.toString(),
            department_id: jobPosition.department_id?.toString()
        }));
    }

   static async getById(id:number):Promise<JobPositionResponse>{
        const jobPosition = await prisma.jobPosition.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                level: true,
                salary_min: true,
                salary_max: true,
                department_id: true
            }
        });
        if(!jobPosition){
            throw new ResponseError(404,"Job Position not found");
        }
        return {
            ...jobPosition,
            salary_min: jobPosition.salary_min.toString(),            
            salary_max: jobPosition.salary_max.toString(),
            department_id: jobPosition.department_id?.toString()
        };
    }

    static async create(req:JobPositionRequest):Promise<JobPositionResponse>{
        const jobPosition = await prisma.jobPosition.create({
            data: {
                name: req.name,
                level: req.level,
                salary_min: req.salary_min,
                salary_max: req.salary_max,
                department_id: req.department_id || null
            },
            select: {
                id: true,
                name: true,
                level: true,
                salary_min: true,
                salary_max: true,
                department_id: true
            }
        });
        return {
            ...jobPosition,
            salary_min: jobPosition.salary_min.toString(),
            salary_max: jobPosition.salary_max.toString(),
            department_id: jobPosition.department_id?.toString()
        };
    }

    static async update(id:number,req:JobPositionRequest):Promise<JobPositionResponse>{
        const jobPosition = await prisma.jobPosition.update({
            where: {
                id
            },
            data: {
                name: req.name,
                level: req.level,
                salary_min: req.salary_min,
                salary_max: req.salary_max,
                department_id: req.department_id || null
            },
            select: {
                id: true,
                name: true,
                level: true,
                salary_min: true,
                salary_max: true,
                department_id: true
            }
        });
        return {
            ...jobPosition,
            salary_min: jobPosition.salary_min.toString(),
            salary_max: jobPosition.salary_max.toString(),
            department_id: jobPosition.department_id?.toString()
        };
    }

    static async delete(id:number):Promise<void>{
        const countJobPosition = await prisma.jobPosition.count({
            where: {
                id
            }
        });
        if(countJobPosition !== 0){
            throw new ResponseError(404,"Job Position not found");
        }

        await prisma.jobPosition.delete({
            where: {
                id
            }
        });        
    }
}