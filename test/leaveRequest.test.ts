import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mockedToken, loginAndGetToken } from './utils/authHelper';

describe('Leave Request', () => {
    let token: string;
    beforeAll(async () => {
        token = await mockedToken();
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
        const response = await request(app)
            .get('/api/leave-request')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
});
