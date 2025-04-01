import { EmployeeWorkSchedule } from '@prisma/client';
import prisma from '../config/prisma.js';
import { Validation } from '../validations/validation.js';
import {
    EmployeeScheduleRequest,
    employeeScheduleSchema,
} from '../validations/employeeSchedule.validation.js';
import { ResponseError } from '../error/response.errors.js';

export class EmployeeScheduleService {
    static async getAll(): Promise<EmployeeWorkSchedule[]> {
        const result = await prisma.employeeWorkSchedule.findMany();
        return result;
    }

    static async getById(id: number): Promise<EmployeeWorkSchedule> {
        const result = await prisma.employeeWorkSchedule.findUnique({
            where: {
                id,
            },
        });

        if (!result) {
            throw new ResponseError(404, 'Employee Schedule not found');
        }

        return result;
    }

    static async approve(id: number): Promise<EmployeeWorkSchedule> {
        const scheduleExists = await prisma.employeeWorkSchedule.findFirst({
            where: {
                id,
            },
        });

        if (!scheduleExists) {
            throw new ResponseError(404, 'Schedule not found');
        }

        const result = await prisma.employeeWorkSchedule.update({
            where: {
                id,
            },
            data: {
                status: 'APPROVED',
            },
        });
        return result;
    }

    static async reject(id: number): Promise<EmployeeWorkSchedule> {
        const scheduleExists = await prisma.employeeWorkSchedule.findFirst({
            where: {
                id,
            },
        });

        if (!scheduleExists) {
            throw new ResponseError(404, 'Schedule not found');
        }

        const result = await prisma.employeeWorkSchedule.update({
            where: {
                id,
            },
            data: {
                status: 'REJECTED',
            },
        });
        return result;
    }

    static async create(data: EmployeeScheduleRequest): Promise<EmployeeWorkSchedule> {
        const validated = Validation.validate<EmployeeScheduleRequest>(
            employeeScheduleSchema,
            data,
        );
        const scheduleExists = await prisma.employeeWorkSchedule.findFirst({
            where: {
                employeeId: validated.employeeId,
                scheduleDate: new Date(validated.scheduleDate),
            },
        });
        if (scheduleExists) {
            throw new ResponseError(409, 'Schedule for the day already exists');
        }

        const result = await prisma.employeeWorkSchedule.create({
            data: {
                employeeId: validated.employeeId,
                scheduleDate: new Date(validated.scheduleDate),
                workType: validated.workType,
                status: 'PENDING',
            },
        });

        return result;
    }
    static async update(id: number, data: EmployeeScheduleRequest): Promise<EmployeeWorkSchedule> {
        const validated = Validation.validate<EmployeeScheduleRequest>(
            employeeScheduleSchema,
            data,
        );
        const scheduleExists = await prisma.employeeWorkSchedule.findFirst({
            where: {
                employeeId: validated.employeeId,
                scheduleDate: new Date(validated.scheduleDate),
            },
        });
        if (scheduleExists) {
            throw new ResponseError(409, 'Schedule for the day already exists');
        }
        const result = await prisma.employeeWorkSchedule.update({
            where: {
                id,
            },
            data: {
                employeeId: validated.employeeId,
                scheduleDate: new Date(validated.scheduleDate),
                workType: validated.workType,
                status: 'PENDING',
            },
        });
        return result;
    }

    static async delete(id: number): Promise<EmployeeWorkSchedule> {
        const countSchedule = await prisma.employeeWorkSchedule.count({
            where: {
                id,
            },
        });
        if (countSchedule === 0) {
            throw new ResponseError(404, 'Schedule not found');
        }

        const result = await prisma.employeeWorkSchedule.delete({
            where: {
                id,
            },
        });
        return result;
    }
}
