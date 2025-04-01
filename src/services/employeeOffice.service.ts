import { EmployeeOffice } from '@prisma/client';
import prisma from '../config/prisma.js';
import { employeeOfficeSchema } from '../validations/employeeOffice.validation.js';
import { Validation } from '../validations/validation.js';
import { EmployeeOfficeRequest } from '../types/employeeOffice.type.js';
import { ResponseError } from '../error/response.errors.js';

export class EmployeeOfficeService {
    static async getAll(): Promise<EmployeeOffice[]> {
        const result = await prisma.employeeOffice.findMany();

        return result;
    }
    static async getById(id: number): Promise<EmployeeOffice> {
        const result = await prisma.employeeOffice.findUnique({
            where: {
                id,
            },
        });
        if (!result) {
            throw new ResponseError(404, 'Employee Office not found');
        }
        return result;
    }
    static async create(data: EmployeeOfficeRequest): Promise<EmployeeOffice> {
        const validate = Validation.validate<EmployeeOfficeRequest>(employeeOfficeSchema, data);
        const countEmployeeOffice = await prisma.employeeOffice.count({
            where: {
                employeeId: validate.employeeId,
                officeId: validate.officeId,
            },
        });

        if (countEmployeeOffice > 0) {
            throw new ResponseError(409, 'Data for employee office already exists');
        }

        const result = await prisma.employeeOffice.create({
            data: {
                employeeId: validate.employeeId,
                officeId: validate.officeId,
                endDate: validate.endDate ? new Date(validate.endDate) : null,
            },
        });
        return result;
    }

    static async update(id: number, data: EmployeeOfficeRequest): Promise<EmployeeOffice> {
        const validate = Validation.validate<EmployeeOfficeRequest>(employeeOfficeSchema, data);
        const employeeOfficeExists = await prisma.employeeOffice.findFirst({
            where: {
                employeeId: validate.employeeId,
                officeId: validate.officeId,
            },
        });

        if (!employeeOfficeExists) {
            throw new ResponseError(404, 'Data for employee office not found');
        }

        const result = await prisma.employeeOffice.update({
            where: {
                id,
            },
            data: {
                employeeId: validate.employeeId,
                officeId: validate.officeId,
                endDate: validate.endDate ? new Date(validate.endDate) : null,
            },
        });
        return result;
    }

    static async delete(id: number): Promise<EmployeeOffice> {
        const countEmployeeOffice = await prisma.employeeOffice.count({
            where: {
                id,
            },
        });

        if (countEmployeeOffice === 0) {
            throw new ResponseError(404, 'Employee Office not found');
        }

        const result = await prisma.employeeOffice.delete({
            where: {
                id,
            },
        });
        return result;
    }
}
