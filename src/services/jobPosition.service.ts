import prisma from '../config/prisma.js';
import { ResponseError } from '../error/response.errors.js';
import { JobPositionRequest, JobPositionResponse } from '../types/jobPosition.type.js';
import { jobPositionSchema } from '../validations/jobPosition.validation.js';
import { Validation } from '../validations/validation.js';
export class JobPositionService {
    static async getAll(): Promise<JobPositionResponse[]> {
        const jobPositions = await prisma.jobPosition.findMany({
            select: {
                id: true,
                name: true,
                level: true,
                salary_min: true,
                salary_max: true,
                department_id: true,
            },
        });
        return jobPositions.map((jobPosition) => ({
            ...jobPosition,
            salary_min: jobPosition.salary_min.toString(),
            salary_max: jobPosition.salary_max.toString(),
            department_id: jobPosition.department_id || null,
        }));
    }

    static async getById(id: number): Promise<JobPositionResponse> {
        const jobPosition = await prisma.jobPosition.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                level: true,
                salary_min: true,
                salary_max: true,
                department_id: true,
            },
        });
        if (!jobPosition) {
            throw new ResponseError(404, 'Job Position not found');
        }
        return {
            ...jobPosition,
            salary_min: jobPosition.salary_min.toString(),
            salary_max: jobPosition.salary_max.toString(),
            department_id: jobPosition.department_id || null,
        };
    }

    static async create(req: JobPositionRequest): Promise<JobPositionResponse> {
        const validated = Validation.validate<JobPositionRequest>(jobPositionSchema, req);
        const jobPosition = await prisma.jobPosition.create({
            data: {
                name: validated.name.toLocaleLowerCase(),
                level: validated.level,
                salary_min: validated.salary_min,
                salary_max: validated.salary_max,
                department_id: validated.department_id || null,
            },
            select: {
                id: true,
                name: true,
                level: true,
                salary_min: true,
                salary_max: true,
                department_id: true,
            },
        });
        return {
            ...jobPosition,
            salary_min: jobPosition.salary_min.toString(),
            salary_max: jobPosition.salary_max.toString(),
            department_id: jobPosition.department_id || null,
        };
    }

    static async update(id: number, req: JobPositionRequest): Promise<JobPositionResponse> {
        const validated = Validation.validate<JobPositionRequest>(jobPositionSchema, req);
        const jobPosition = await prisma.jobPosition.update({
            where: {
                id,
            },
            data: {
                name: validated.name.toLocaleLowerCase(),
                level: validated.level,
                salary_min: validated.salary_min,
                salary_max: validated.salary_max,
                department_id: validated.department_id || null,
            },
            select: {
                id: true,
                name: true,
                level: true,
                salary_min: true,
                salary_max: true,
                department_id: true,
            },
        });
        return {
            ...jobPosition,
            salary_min: jobPosition.salary_min.toString(),
            salary_max: jobPosition.salary_max.toString(),
            department_id: jobPosition.department_id || null,
        };
    }

    static async delete(id: number): Promise<void> {
        const checkJobPosition = await prisma.jobPosition.findUnique({
            where: {
                id,
            },
        });
        if (!checkJobPosition) {
            throw new ResponseError(404, 'Job Position not found');
        }

        await prisma.jobPosition.delete({
            where: {
                id,
            },
        });
    }
}
