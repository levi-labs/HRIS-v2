import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mockedToken, loginAndGetToken } from './utils/authHelper.ts';
import { before } from 'node:test';

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
});
