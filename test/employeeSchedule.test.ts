import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mockedToken, loginAndGetToken } from './utils/authHelper';
import { mockedEmployee } from './utils/employeeHelper';
import { WorkScheduleStatus, WorkType } from '@prisma/client';

jest.mocked(prisma);
jest.mocked('bcrypt');
jest.mocked('jsonwebtoken');

describe('Employee Schedule', () => {
    let token: string;
    let employee: {};
    beforeAll(async () => {
        token = await mockedToken();
        employee = await mockedEmployee();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if the user is not authenticated', async () => {
        const response = await request(app)
            .get('/api/employee-schedule')
            .set('Authorization', `Invalid token`)
            .send({});
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized: Token is missing or invalid');
    });

    it('should return 200 fetching all employee schedules', async () => {
        const mockdata = [
            {
                id: 1,
                employeeId: employee['id'],
                scheduleDate: '2025-03-19',
                WorkType: WorkType.WFH,
                status: WorkScheduleStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];
        prisma.employeeWorkSchedule.findMany = jest.fn().mockResolvedValue(mockdata);

        const response = await request(app)
            .get('/api/employee-schedule')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
    });

    it('should return 404 if the employee ID schedule is not found', async () => {
        prisma.employeeWorkSchedule.findUnique = jest.fn().mockResolvedValue(null);
        const response = await request(app)
            .get('/api/employee-schedule/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Employee Schedule not found');
    });

    it('should return 200 fetching employee schedule by id', async () => {
        prisma.employeeWorkSchedule.count = jest.fn().mockResolvedValue(1);
        prisma.employeeWorkSchedule.findUnique = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: employee['id'],
            scheduleDate: '2025-03-19',
            WorkType: WorkType.WFH,
            status: WorkScheduleStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const response = await request(app)
            .get('/api/employee-schedule/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(1);
    });

    it('should return 201 creating employee schedule', async () => {
        prisma.employeeWorkSchedule.findFirst = jest.fn().mockResolvedValue(null);
        prisma.employeeWorkSchedule.create = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: employee['id'],
            scheduleDate: '2025-03-19',
            workType: WorkType.WFH,
        });
        const response = await request(app)
            .post('/api/employee-schedule')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: employee['id'],
                scheduleDate: '2025-03-19',
                workType: WorkType.WFH,
                status: WorkScheduleStatus.PENDING,
            });
        expect(response.status).toBe(201);
        expect(response.body.data.id).toBe(1);
    });

    it('should return 200 updating employee schedule', async () => {
        prisma.employeeWorkSchedule.findUnique = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: employee['id'],
            scheduleDate: '2025-03-19',
            workType: WorkType.WFH,
        });
        prisma.employeeWorkSchedule.update = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: employee['id'],
            scheduleDate: '2025-03-19',
            workType: WorkType.WFH,
        });
        const response = await request(app)
            .put('/api/employee-schedule/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: employee['id'],
                scheduleDate: '2025-03-19',
                workType: WorkType.WFH,
                status: WorkScheduleStatus.PENDING,
            });
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(1);
    });

    it('should return 200 deleting employee schedule', async () => {
        prisma.employeeWorkSchedule.findUnique = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: employee['id'],
            scheduleDate: '2025-03-19',
            workType: WorkType.WFH,
        });
        prisma.employeeWorkSchedule.delete = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: employee['id'],
            scheduleDate: '2025-03-19',
            workType: WorkType.WFH,
        });
        const response = await request(app)
            .delete('/api/employee-schedule/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(1);
    });
});
