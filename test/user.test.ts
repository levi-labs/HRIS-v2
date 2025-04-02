import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mockedToken, loginAndGetToken } from './utils/authHelper';

jest.mocked(prisma);
jest.mocked('bcrypt');
jest.mocked('jsonwebtoken');

describe('User Service', () => {
    let token: string;
    beforeAll(async () => {
        token = await mockedToken();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return 401 if no token is provided', async () => {
        const response = await request(app).get('/api/user');
        expect(response.status).toBe(401);
    });

    it('should return 200 fetching all users', async () => {
        prisma.user.findMany = jest.fn().mockResolvedValue([]);
        const response = await request(app)
            .get('/api/user')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([]);
    });

    it('should return 200 fetching user by id', async () => {
        prisma.user.findUnique = jest.fn().mockResolvedValue({});
        const response = await request(app)
            .get('/api/user/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual({});
    });

    it.skip('should return 201 creating user successfully', async () => {
        prisma.user.count = jest.fn().mockResolvedValue(0);
        prisma.user.create = jest.fn().mockResolvedValue({
            id: 1,
            username: 'johndoe',
            name: 'John Doe',
            email: 'q6oG7@example.com',
            password: 'password',
            roleId: 1,
        });
        const response = await request(app)
            .post('/api/user')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'johndoe',
                name: 'John Doe',
                email: 'q6oG7@example.com',
                password: 'password',
                roleId: 1,
            });
        console.log(response.body);
        expect(response.status).toBe(201);
    });

    it.skip('should return 401 if the user is not authenticated', async () => {
        const response = await request(app)
            .get('/api/user')
            .set('Authorization', `Invalid token`)
            .send({});
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized: Token is missing or invalid');
    });

    it('should return 200 updating user successfully', async () => {
        prisma.user.findUnique = jest.fn().mockResolvedValue({});
        prisma.user.update = jest.fn().mockResolvedValue({});
        const response = await request(app)
            .put('/api/user/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'johndoe',
                email: 'q6oG7@example.com',
                roleId: 1,
            });

        expect(response.status).toBe(200);
    });

    it.skip('should return 200 deleting user successfully', async () => {
        prisma.user.findUnique = jest.fn().mockResolvedValue({});
        prisma.user.delete = jest.fn().mockResolvedValue({});
        const response = await request(app)
            .delete('/api/user/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
    });
});
