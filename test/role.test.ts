import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mockedToken, loginAndGetToken } from './utils/authHelper';

jest.mocked(prisma);
jest.mocked('bcrypt');
jest.mocked('jsonwebtoken');

describe('Role Service', () => {
    let token: string;
    beforeAll(async () => {
        token = await mockedToken();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return 401 if the user is not authenticated', async () => {
        const response = await request(app)
            .get('/api/role')
            .set('Authorization', `Invalid token`)
            .send({});
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized: Token is missing or invalid');
    });

    it('should return 200 fetching all roles', async () => {
        prisma.role.findMany = jest.fn().mockResolvedValue([
            {
                id: 1,
                name: 'admin',
            },
        ]);
        const response = await request(app)
            .get('/api/role')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([
            {
                id: 1,
                name: 'admin',
            },
        ]);
    });

    it('should return 404 if the role is not found', async () => {
        prisma.role.findFirst = jest.fn().mockResolvedValue(null);
        const response = await request(app)
            .get('/api/role/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Role not found');
    });

    it('should return 200 fetching role by id', async () => {
        prisma.role.count = jest.fn().mockResolvedValue(1);
        prisma.role.findFirst = jest.fn().mockResolvedValue({
            id: 1,
            name: 'admin',
        });
        const response = await request(app)
            .get('/api/role/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(1);
    });

    it('should return 201 creating role successfully', async () => {
        prisma.role.count = jest.fn().mockResolvedValue(0);
        prisma.role.create = jest.fn().mockResolvedValue({
            id: 1,
            name: 'admin',
        });
        const response = await request(app)
            .post('/api/role')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'admin',
            });
        expect(response.status).toBe(201);
        expect(response.body.data.id).toBe(1);
    });

    it('should return 409 if the role already exists', async () => {
        prisma.role.count = jest.fn().mockResolvedValue(1);
        const response = await request(app)
            .post('/api/role')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'admin',
            });
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Role already exists');
    });
    it('should update a role successfully', async () => {
        const mockdata = {
            id: 1,
            name: 'admin',
        };
        prisma.role.findUnique = jest.fn().mockResolvedValue(mockdata);
        prisma.role.count = jest.fn().mockResolvedValue(0);
        prisma.role.update = jest.fn().mockResolvedValue(mockdata);

        const response = await request(app)
            .put('/api/role/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'admin',
            });
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe('admin');
    });
    it('should delete a role successfully', async () => {
        const mockdata = {
            id: 1,
            name: 'admin',
        };
        prisma.role.findUnique = jest.fn().mockResolvedValue(mockdata);
        prisma.role.delete = jest.fn().mockResolvedValue(mockdata);

        const response = await request(app)
            .delete('/api/role/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Role deleted successfully');
    });
});
