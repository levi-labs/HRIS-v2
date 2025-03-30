import request from 'supertest';
import app from '../src/app.ts';
import prisma from '../src/config/prisma.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mockedToken, loginAndGetToken } from './utils/authHelper.ts';

jest.mocked(prisma);
jest.mocked('bcrypt');
jest.mocked('jsonwebtoken');

describe('Department', () => {
    let token: string;
    beforeAll(async () => {
        token = await mockedToken();
    });
    afterAll(() => {
        jest.clearAllMocks();
    });
    it('should return 401 if the user is not authenticated', async () => {
        const response = await request(app).post('/api/department').send({
            name: 'HR',
            phone: '1234567890',
        });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized: Token is missing or invalid');
    });

    it('should return 200 fetching all departments', async () => {
        const mockdata = [
            {
                id: 1,
                name: 'HR',
                phone: '1234567890',
            },
            {
                id: 2,
                name: 'IT',
                phone: '1234567890',
            },
        ];
        prisma.department.findMany = jest.fn().mockResolvedValue(mockdata);

        const response = await request(app)
            .get('/api/department')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('should create a new department successfully', async () => {
        prisma.department.count = jest.fn().mockResolvedValue(0);
        prisma.department.create = jest
            .fn()
            .mockResolvedValue({ id: 1, name: 'HR', phone: '1234567890' });

        const response = await request(app)
            .post('/api/department')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'HR',
                phone: '1234567890',
            });
        expect(response.status).toBe(201);
        expect(response.body.data.name).toBe('HR');
    });

    it('should return 404 if the department is not found', async () => {
        prisma.department.findUnique = jest.fn().mockResolvedValue(null);
        const response = await request(app)
            .get('/api/department/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Department not found');
    });

    it('should return 409 if the department already exists', async () => {
        prisma.department.count = jest.fn().mockResolvedValue(1);

        const response = await request(app)
            .post('/api/department')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'HR',
                phone: '1234567890',
            });
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Department already exists');
    });

    it('should update a department successfully', async () => {
        const mockdata = {
            id: 1,
            name: 'HR',
            phone: '1234567891',
        };
        prisma.department.findUnique = jest.fn().mockResolvedValue(mockdata);
        prisma.department.count = jest.fn().mockResolvedValue(0);
        prisma.department.update = jest.fn().mockResolvedValue(mockdata);

        const response = await request(app)
            .put('/api/department/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'HR',
                phone: '1234567891',
            });
        expect(response.status).toBe(200);
        expect(response.body.data.phone).toBe('1234567891');
    });

    it('should delete a department successfully', async () => {
        const mockdata = {
            id: 1,
            name: 'HR',
            phone: '1234567891',
        };
        prisma.department.findUnique = jest.fn().mockResolvedValue(mockdata);
        prisma.department.delete = jest.fn().mockResolvedValue(mockdata);

        const response = await request(app)
            .delete('/api/department/1')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Department deleted successfully');
    });
});
