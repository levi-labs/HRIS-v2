import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mockedToken, loginAndGetToken } from './utils/authHelper.js';
import { mockedEmployee } from './utils/employeeHelper.js';
import { mockedOffice } from './utils/officeHelper.js';

jest.mocked(prisma);
jest.mocked('bcrypt');
jest.mocked('jsonwebtoken');

describe('Employee Office', () => {
    let token: string;
    let employee: {};
    let office: {};
    beforeAll(async () => {
        token = await mockedToken();
        employee = await mockedEmployee();
        office = await mockedOffice();
    });
    it('should return 401 if the user is not authenticated', async () => {
        const response = await request(app)
            .get('/api/employee-office')
            .set('Authorization', `Invalid token`)
            .send({});
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized: Token is missing or invalid');
    });
    it('should return 200 fetching all employee offices', async () => {
        const mockdata = [
            {
                id: 1,
                employeeId: employee['id'],
                officeId: office['id'],
            },
        ];
        prisma.employeeOffice.findMany = jest.fn().mockResolvedValue(mockdata);
        const response = await request(app)
            .get('/api/employee-office')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
    });
    it('should return 200 fetching employee office by id', async () => {
        prisma.employeeOffice.count = jest.fn().mockResolvedValue(1);
        prisma.employeeOffice.findUnique = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: employee['id'],
            officeId: office['id'],
        });
        const response = await request(app)
            .get('/api/employee-office/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(1);
    });

    it('should return 404 if the employee office id is not found', async () => {
        prisma.employeeOffice.findUnique = jest.fn().mockResolvedValue(null);
        const response = await request(app)
            .get('/api/employee-office/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Employee Office not found');
    });

    it('should return 201 creating employee office successfully', async () => {
        prisma.employeeOffice.count = jest.fn().mockResolvedValue(0);
        prisma.employeeOffice.create = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: employee['id'],
            officeId: office['id'],
        });
        const response = await request(app)
            .post('/api/employee-office')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: employee['id'],
                officeId: office['id'],
            });
        expect(response.status).toBe(201);
        expect(response.body.data.id).toBe(1);
    });

    it('should return 409 if the employee office already exists', async () => {
        prisma.employeeOffice.count = jest.fn().mockResolvedValue(1);
        const response = await request(app)
            .post('/api/employee-office')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: employee['id'],
                officeId: office['id'],
            });
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Data for employee office already exists');
    });

    it('should return 200 updating employee office successfully', async () => {
        prisma.employeeOffice.findFirst = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: employee['id'],
            officeId: office['id'],
        });
        prisma.employeeOffice.update = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: employee['id'],
            officeId: office['id'],
        });
        const response = await request(app)
            .put('/api/employee-office/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: employee['id'],
                officeId: office['id'],
            });
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(1);
    });
    it('should return 200 deleting employee office successfully', async () => {
        prisma.employeeOffice.count = jest.fn().mockResolvedValue(1);
        prisma.employeeOffice.delete = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: employee['id'],
            officeId: office['id'],
        });
        const response = await request(app)
            .delete('/api/employee-office/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(1);
    });
});
