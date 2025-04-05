import { DepartmentOffice } from '@prisma/client';
import prisma from '../config/prisma.js';
import { ResponseError } from '../error/response.errors.js';
import { DepartmentOfficeResponse } from '../types/departmentOffice.type.js';
import { departmentOfficeSchema } from '../validations/departmentOffice.validation.js';
import { Validation } from '../validations/validation.js';

export class DepartmentOfficeService {
    static async getAll(): Promise<DepartmentOffice[]> {
        return prisma.departmentOffice.findMany();
    }
    static async getById(id: number): Promise<DepartmentOffice> {
        const result = await prisma.departmentOffice.findUnique({
            where: {
                id,
            },
        });

        if (!result) {
            throw new ResponseError(404, 'Department Office not found');
        }
        return result;
    }
    static async create(data: DepartmentOffice): Promise<DepartmentOffice> {
        const validated = Validation.validate(departmentOfficeSchema, data);

        const checkExist = await prisma.departmentOffice.findFirst({
            where: {
                departmentId: validated.departmentId,
                officeId: validated.officeId,
            },
        });
        if (checkExist) {
            throw new ResponseError(409, 'Data for department office already exists');
        }

        const result = await prisma.departmentOffice.create({
            data: {
                departmentId: validated.departmentId,
                officeId: validated.officeId,
                startDate: new Date(validated.startDate),
                endDate: validated.endDate ? new Date(validated.endDate) : null,
            },
        });
        return result;
    }
    static async update(id: number, data: DepartmentOffice): Promise<DepartmentOffice> {
        const validated = Validation.validate(departmentOfficeSchema, data);

        const countDepartmentOffice = await prisma.departmentOffice.count({
            where: {
                id,
            },
        });

        if (countDepartmentOffice === 0) {
            throw new ResponseError(404, 'Department Office not found');
        }

        const result = await prisma.departmentOffice.update({
            where: {
                id,
            },
            data: {
                departmentId: validated.departmentId,
                officeId: validated.officeId,
                startDate: new Date(validated.startDate),
                endDate: validated.endDate ? new Date(validated.endDate) : null,
            },
        });
        return result;
    }

    static async delete(id: number): Promise<DepartmentOfficeResponse> {
        const countDepartmentOffice = await prisma.departmentOffice.count({
            where: {
                id,
            },
        });

        if (countDepartmentOffice === 0) {
            throw new ResponseError(404, 'Department Office not found');
        }

        const result = await prisma.departmentOffice.delete({
            where: {
                id,
            },
        });
        return result;
    }
}
