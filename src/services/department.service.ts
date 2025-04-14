import { DepartmentRequest, DepartmentResponse } from '../types/department.type.js';
import prisma from '../config/prisma.js';
import { ResponseError } from '../error/response.errors.js';
import { departmentSchema } from '../validations/department.validation.js';
import { Validation } from '../validations/validation.js';
export class DepartmentService {
    static async getAll(queryParams: { page?: string; limit?: string; search?: string }): Promise<{
        data: DepartmentResponse[];
        pagination: {
            total: number;
            page: number;
            skip: number;
            limit: number;
            totalPages: number;
        };
    }> {
        const page = Number(queryParams.page) || 1;
        const limit = Number(queryParams.limit) || 10;
        const skip = (Number(page) - 1) * Number(limit);
        const search = queryParams.search?.toLowerCase() || '';
        const whereCondition = search
            ? {
                  name: {
                      contains: search,
                      mode: 'insensitive',
                  },
              }
            : {};

        const [data, total] = await Promise.all([
            prisma.department.findMany({
                where: whereCondition,
                skip,
                take: Number(limit),
                select: {
                    id: true,
                    name: true,
                    phone: true,
                },
            }),
            prisma.department.count({
                where: whereCondition,
            }),
        ]);
        return {
            data,
            pagination: { page, skip, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }

    static async getById(id: number): Promise<DepartmentResponse> {
        const department = await prisma.department.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                phone: true,
            },
        });
        if (!department) {
            throw new ResponseError(404, 'Department not found');
        }
        return department;
    }
    static async create(req: DepartmentRequest): Promise<DepartmentResponse> {
        const validated = Validation.validate<DepartmentRequest>(departmentSchema, req);
        const countDepartment = await prisma.department.count({
            where: {
                name: validated.name,
            },
        });

        if (countDepartment > 0) {
            throw new ResponseError(409, 'Department already exists');
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
            },
        });
        return department;
    }

    static async update(id: number, req: DepartmentRequest): Promise<DepartmentResponse> {
        const validated = Validation.validate<DepartmentRequest>(departmentSchema, req);
        const department = await prisma.department.findUnique({
            where: {
                id,
            },
        });
        if (!department) {
            throw new ResponseError(404, 'Department not found');
        }

        const countDepartment = await prisma.department.count({
            where: {
                name: validated.name,
                NOT: {
                    id: department.id,
                },
            },
        });
        console.log(countDepartment);

        if (countDepartment > 0) {
            throw new ResponseError(409, 'Department already exists with this name');
        }
        const updatedDepartment = await prisma.department.update({
            where: {
                id,
            },
            data: {
                name: validated.name || department.name,
                phone: validated.phone || department.phone,
            },
            select: {
                id: true,
                name: true,
                phone: true,
            },
        });
        return updatedDepartment;
    }

    static async delete(id: number): Promise<void> {
        const department = await prisma.department.findUnique({
            where: {
                id,
            },
        });
        if (!department) {
            throw new ResponseError(404, 'Department not found');
        }
        await prisma.department.delete({
            where: {
                id,
            },
        });
    }
}
