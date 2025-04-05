import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mockedToken, loginAndGetToken } from './utils/authHelper.ts';
import { before } from 'node:test';
import { start } from 'repl';

jest.mocked(prisma);
jest.mocked('bcrypt');
jest.mocked('jsonwebtoken');

describe('Department Office Service', () => {
    let token: string;
    beforeAll(async () => {
        token = await mockedToken(); // Pastikan token yang dihasilkan oleh mockedToken() dapat mengembalikan token
    });
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if the user is not authenticated', async () => {
        const response = await request(app)
            .get('/api/department-office')
            .set('Authorization', `Invalid token`)
            .send({});
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized: Token is missing or invalid');
    });
    it('should return 200 fetching all department offices', async () => {
        const mockdata = [
            {
                id: 1,
                departmentId: 1,
                officeId: 1,
            },
        ];
        prisma.departmentOffice.findMany = jest.fn().mockResolvedValue(mockdata);
        const response = await request(app)
            .get('/api/department-office')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(mockdata);
    });
    it('should return 200 fetching department office by id', async () => {
        prisma.departmentOffice.count = jest.fn().mockResolvedValue(1);
        prisma.departmentOffice.findUnique = jest.fn().mockResolvedValue({
            id: 1,
            departmentId: 1,
            officeId: 1,
        });
        const response = await request(app)
            .get('/api/department-office/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(1);
    });
    it('should return 404 if the department office id is not found', async () => {
        prisma.departmentOffice.findUnique = jest.fn().mockResolvedValue(null);
        const response = await request(app)
            .get('/api/department-office/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Department Office not found');
    });
    it('should create a new department office successfully', async () => {
        prisma.departmentOffice.count = jest.fn().mockResolvedValue(0);
        prisma.departmentOffice.create = jest.fn().mockResolvedValue({
            id: 1,
            departmentId: 1,
            officeId: 1,
            startDate: new Date(),
        });
        const response = await request(app)
            .post('/api/department-office')
            .set('Authorization', `Bearer ${token}`)
            .send({
                departmentId: 1,
                officeId: 1,
                startDate: new Date(),
            });
        expect(response.status).toBe(201);
        expect(response.body.data.departmentId).toBe(1);
    });
    it('should return 409 if the department office already exists', async () => {
        prisma.departmentOffice.findFirst = jest.fn().mockResolvedValue({
            id: 1,
            departmentId: 1,
            officeId: 1,
            startDate: new Date(),
        });
        const response = await request(app)
            .post('/api/department-office')
            .set('Authorization', `Bearer ${token}`)
            .send({
                departmentId: 1,
                officeId: 1,
                startDate: new Date(),
            });
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Data for department office already exists');
    });

    it('should update a department office successfully', async () => {
        const mockdata = {
            id: 1,
            departmentId: 1,
            officeId: 1,
        };
        prisma.departmentOffice.findUnique = jest.fn().mockResolvedValue(mockdata);
        prisma.departmentOffice.count = jest.fn().mockResolvedValue(1);
        prisma.departmentOffice.update = jest.fn().mockResolvedValue(mockdata);

        const response = await request(app)
            .put('/api/department-office/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                departmentId: 1,
                officeId: 1,
                startDate: new Date(),
            });
        expect(response.status).toBe(200);
        expect(response.body.data.departmentId).toBe(1);
    });

    it('should delete a department office successfully', async () => {
        const mockdata = {
            id: 1,
            departmentId: 1,
            officeId: 1,
        };
        prisma.departmentOffice.findUnique = jest.fn().mockResolvedValue(mockdata);
        prisma.departmentOffice.delete = jest.fn().mockResolvedValue(mockdata);

        const response = await request(app)
            .delete('/api/department-office/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Department office deleted successfully');
    });
});
