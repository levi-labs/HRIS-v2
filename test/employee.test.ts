import request from 'supertest';
import app from '../src/app.ts';
import prisma from '../src/config/prisma.ts';
import { mockedToken } from './utils/authHelper.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mocked(prisma);
jest.mocked('bcrypt');
jest.mocked('jsonwebtoken');

describe('employee', () => {
    let token: string;
    beforeAll(async () => {
        token = await mockedToken();
        // console.log('Prisma Employee Count:', await prisma.employee.count());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if the user is not authenticated', async () => {
        const response = await request(app)
            .get('/api/employee')
            .set('Authorization', `Invalid token`)
            .send({});
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized: Token is missing or invalid');
    });
    it('should return 404 if the employee id is not found', async () => {
        prisma.employee.findUnique = jest.fn().mockResolvedValue(null);
        const response = await request(app)
            .get('/api/employee/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Employee not found');
    });
    it('should return 200 fetching employees successfully', async () => {
        prisma.employee.findMany = jest.fn().mockResolvedValue([
            {
                id: 1,
                first_name: 'John',
                last_name: 'Doe',
                job_position_id: 1,
                userId: 1,
            },
        ]);
        const response = await request(app)
            .get('/api/employee')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
    });

    it('should return 200 fetching employee by id', async () => {
        prisma.employee.count = jest.fn().mockResolvedValue(1);
        prisma.employee.findUnique = jest.fn().mockResolvedValue({
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            job_position_id: 1,
            userId: 1,
        });
        const response = await request(app)
            .get('/api/employee/1')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.status).toBe(200);
    });

    it('should return 201 create a new employee successfully', async () => {
        prisma.user.count = jest.fn().mockResolvedValue(0);
        prisma.employee.count = jest.fn().mockResolvedValue(0);
        prisma.user.findUnique = jest.fn().mockResolvedValue(null);
        prisma.employee.findUnique = jest.fn().mockResolvedValue(null);

        prisma.user.create = jest.fn().mockResolvedValue({
            id: 9,
            username: 'johndoe',
            email: 'd4iJi@example.com',
            roleId: 1,
        });

        prisma.employee.create = jest.fn().mockResolvedValue({
            id: 9,
            first_name: 'John',
            last_name: 'Doe',
            job_position_id: 1,
            userId: 9,
        });

        prisma.$transaction = jest.fn().mockImplementation(async (callback) => {
            return await callback(prisma);
        });

        // Jalankan request ke API
        const response = await request(app)
            .post('/api/employee')
            .set('Authorization', `Bearer ${token}`)
            .send({
                first_name: 'John',
                last_name: 'Doe',
                username: 'johndoe12',
                email: 'd4iJi@example.com',
                job_position_id: 1,
                roleId: 1,
            });

        expect(response.status).toBe(201);
    });

    it('should return 409 if the username already exists', async () => {
        prisma.user.count = jest.fn().mockResolvedValue(1);
        prisma.user.findUnique = jest.fn().mockResolvedValue({
            id: 1,
            username: 'johndoe12',
            email: 'd4iJi@example.com',
            roleId: 1,
        });

        const response = await request(app)
            .post('/api/employee')
            .set('Authorization', `Bearer ${token}`)
            .send({
                first_name: 'John',
                last_name: 'Doe',
                username: 'johndoe12',
                email: 'd4iJi@example.com',
                job_position_id: 1,
                roleId: 1,
            });
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('User already exists');
    });

    it('should return 200 update employee successfully', async () => {
        prisma.employee.count = jest.fn().mockResolvedValue(1);
        prisma.employee.findUnique = jest.fn().mockResolvedValue({
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            job_position_id: 1,
            userId: 1,
        });
        prisma.employee.update = jest.fn().mockResolvedValue({
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            job_position_id: 1,
            userId: 1,
        });

        prisma.$transaction = jest.fn().mockImplementation(async (callback) => {
            return await callback(prisma);
        });
        const response = await request(app)
            .put('/api/employee/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                first_name: 'John',
                last_name: 'Doe',
                username: 'johndoe12',
                email: 'd4iJi@example.com',
                job_position_id: 1,
                roleId: 1,
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Employee updated successfully');
    });

    it('should return 200 delete employee successfully', async () => {
        prisma.employee.count = jest.fn().mockResolvedValue(1);
        prisma.employee.findUnique = jest.fn().mockResolvedValue({
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            job_position_id: 1,
            userId: 1,
        });
        prisma.employee.delete = jest.fn().mockResolvedValue({
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            job_position_id: 1,
            userId: 1,
        });
        prisma.user.delete = jest.fn().mockResolvedValue({
            id: 1,
            username: 'johndoe12',
            email: 'd4iJi@example.com',
            roleId: 1,
        });

        prisma.$transaction = jest.fn().mockImplementation(async (callback) => {
            return await callback(prisma);
        });

        const response = await request(app)
            .delete('/api/employee/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Employee deleted successfully');
    });
});
