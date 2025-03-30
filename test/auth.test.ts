import request from 'supertest';
import app from '../src/app.ts';
import prisma from '../src/config/prisma.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mock } from 'node:test';
import e from 'express';

jest.mocked(prisma);
jest.mocked('bcrypt');
jest.mocked('jsonwebtoken');

describe('AuthService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register a new user successfully', async () => {
        const plainPassword = 'password123';
        const hashedPassword = bcrypt.hashSync(plainPassword, 10);
        const data = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: hashedPassword,
            roleId: 1,
        };
        prisma.user.count = jest.fn().mockResolvedValue(0);
        prisma.user.create = jest.fn().mockResolvedValue(data);

        bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

        const response = await request(app).post('/api/auth/register').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: hashedPassword,
            roleId: 1,
        });
        console.log(response.body);
        expect(response.status).toBe(201);
        expect(response.body.data.username).toBe('testuser');
    });
    it('should return 409 if the user already exists', async () => {
        prisma.user.count = jest.fn().mockResolvedValue(1);

        const response = await request(app).post('/api/auth/register').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            roleId: 1,
        });

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('User already exists');
    });

    it('should return 422 if the request is invalid', async () => {
        const response = await request(app).post('/api/auth/register').send({
            username: '',
            email: 'testuser@example.com',
            password: 'password123',
            roleId: 1,
        });

        expect(response.status).toBe(422);
        expect(response.body.message).toBe('Validation Error');
    });

    it('should login a user successfully', async () => {
        const user = {
            id: 1,
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            roleId: 1,
            role: {
                id: 1,
                name: 'admin',
            },
        };
        prisma.user.findUnique = jest.fn().mockResolvedValue(user);
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            'hris123',
            { expiresIn: '1h' },
        );
        const response = await request(app).post('/api/auth/login').send({
            username: 'testuser',
            password: 'password123',
        });
        expect(response.status).toBe(200);
        expect(response.body.data.token).toBe(token);
    });

    it('should return 401 if the user is not found', async () => {
        prisma.user.findUnique = jest.fn().mockResolvedValue(null);
        const response = await request(app).post('/api/auth/login').send({
            username: 'testuser',
            password: 'password123',
        });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Username or password is incorrect');
    });
    it('should return 401 if the password is incorrect', async () => {
        const user = {
            id: 1,
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            roleId: 1,
            role: {
                id: 1,
                name: 'admin',
            },
        };
        prisma.user.findUnique = jest.fn().mockResolvedValue(user);
        bcrypt.compare = jest.fn().mockResolvedValue(false);
        const response = await request(app).post('/api/auth/login').send({
            username: 'testuser',
            password: 'password123abc',
        });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Username or password is incorrect');
    });
    it('should return 401 if token is invalid', async () => {
        const response = await request(app)
            .get('/api/department')
            .set('Authorization', 'Bearer invalid_token');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid token, authentication failed');
    });
});
