import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mockedToken, mockedAsEmployee, loginAndGetToken } from './utils/authHelper';
import { LeaveStatus, LeaveType } from '@prisma/client';
import { mockedEmployee } from './utils/employeeHelper';
import { log } from 'console';

jest.mocked(prisma);
jest.mocked('bcrypt');
jest.mocked('jsonwebtoken');

describe('Leave Request', () => {
    let tokenAdmin: string;
    let token: string;
    let employee: {};
    beforeEach(async () => {
        tokenAdmin = await mockedToken();
        token = await mockedAsEmployee();
        employee = await mockedEmployee();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .get('/api/leave-request')
            .set('Authorization', 'Invalid token');
        expect(response.status).toBe(401);
    });

    it('should return 200 fetching all leave requests', async () => {
        prisma.leaveRequest.findMany = jest.fn().mockResolvedValue([]);

        const response = await request(app)
            .get('/api/leave-request')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('should return 200 fetching leave request by id', async () => {
        prisma.leaveRequest.findUnique = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 1,
            startDate: new Date(),
            endDate: new Date(),
            leaveType: LeaveType.SICK,
            reason: 'test',
        });
        const response = await request(app)
            .get('/api/leave-request/1')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(1);
    });

    it('should return 404 if the leave request id is not found', async () => {
        prisma.leaveRequest.findUnique = jest.fn().mockResolvedValue(null);
        const response = await request(app)
            .get('/api/leave-request/1')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Leave Request not found');
    });

    it('should return 201 creating leave request from employee', async () => {
        prisma.leaveRequest.count = jest.fn().mockResolvedValue(0);
        prisma.leaveRequest.create = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 1,
            startDate: new Date(),
            endDate: new Date(),
            leaveType: LeaveType.SICK,
            reason: 'test',
        });
        const response = await request(app)
            .post('/api/leave-request/create-from-employee')
            .set('Authorization', `Bearer ${token}`)
            .send({
                startDate: new Date(),
                endDate: new Date(),
                leaveType: LeaveType.SICK,
                reason: 'test',
            });

        expect(response.status).toBe(201);
        expect(response.body.data.id).toBe(1);
    });

    it('should return 409 if the leave request already exists', async () => {
        prisma.leaveRequest.findFirst = jest.fn().mockResolvedValue({
            employeeId: 2,
            startDate: new Date(),
            endDate: new Date(),
        });
        const response = await request(app)
            .post('/api/leave-request/create-from-employee')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: employee['id'],
                startDate: new Date(),
                endDate: new Date(),
                leaveType: LeaveType.SICK,
                reason: 'test',
            });

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Data for leave request already exists');
    });
    it('should update a leave request successfully from employee', async () => {
        const mockdata = {
            id: 1,
            employeeId: 1,
            startDate: new Date(),
            endDate: new Date(),
            leaveType: LeaveType.SICK,
            reason: 'test',
        };
        prisma.leaveRequest.findFirst = jest.fn().mockResolvedValue(mockdata);
        prisma.leaveRequest.update = jest.fn().mockResolvedValue(mockdata);
        const response = await request(app)
            .put('/api/leave-request/update-from-employee/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                startDate: new Date(),
                endDate: new Date(),
                leaveType: LeaveType.SICK,
                reason: 'test',
            });
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(1);
    });
    it('should return 201 creating leave request from HRD', async () => {
        prisma.leaveRequest.findFirst = jest.fn().mockResolvedValue(null);
        prisma.leaveRequest.create = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 1,
            startDate: new Date(),
            endDate: new Date(),
            leaveType: LeaveType.SICK,
            approvedBy: 1,
            reason: 'test',
        });
        const response = await request(app)
            .post('/api/leave-request/create-from-hrd')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                employeeId: employee['id'],
                startDate: new Date(),
                endDate: new Date(),
                leaveType: LeaveType.SICK,
                reason: 'test',
                status: LeaveStatus.APPROVED,
            });

        expect(response.status).toBe(201);
    });

    it('should update a leave request successfully from HRD', async () => {
        const mockdata = {
            id: 1,
            employeeId: 1,
            startDate: new Date(),
            endDate: new Date(),
            leaveType: LeaveType.SICK,
            approvedBy: 1,
            reason: 'test',
        };
        prisma.leaveRequest.findFirst = jest.fn().mockResolvedValue(mockdata);
        prisma.leaveRequest.update = jest.fn().mockResolvedValue(mockdata);
        const response = await request(app)
            .put('/api/leave-request/update-from-hrd/1')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                employeeId: employee['id'],
                startDate: new Date(),
                endDate: new Date(),
                leaveType: LeaveType.SICK,
                reason: 'test',
                status: LeaveStatus.APPROVED,
            });

        expect(response.status).toBe(200);
    });

    it('should return 409 if the leave request status is not pending when deleting leave request', async () => {
        prisma.leaveRequest.findFirst = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 1,
            startDate: new Date(),
            endDate: new Date(),
            leaveType: LeaveType.SICK,
            approvedBy: 1,
            reason: 'test',
            status: LeaveStatus.APPROVED,
        });

        const response = await request(app)
            .delete('/api/leave-request/1')
            .set('Authorization', `Bearer ${tokenAdmin}`);

        console.log('response', response.body);
        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            'Leave request cannot be deleted because it is not pending',
        );
    });
});
