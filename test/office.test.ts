import request from 'supertest';
import app from '../src/app.ts';
import prisma from '../src/config/prisma.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mockedToken, loginAndGetToken } from './utils/authHelper.ts';

jest.mocked(prisma);
jest.mocked('bcrypt');
jest.mocked('jsonwebtoken');

describe('office', () => {
    let token: string;
    beforeAll(async () => {
        token = await mockedToken();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return 401 if the user is not authenticated', async () => {
        prisma.office.findMany = jest.fn().mockResolvedValue([]);
        const response = await request(app)
            .post('/api/office')
            .set('Authorization', `Invalid token`)
            .send({
                name: 'HR',
                phone: '1234567890',
            });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized: Token is missing or invalid');
    });

    it('should return 200 fetching all offices', async () => {
        const mockdata = [
            {
                id: 1,
                name: 'Jakarta Selatan (cabang)',
                latitude: '-6.26358199',
                longitude: '106.76192444',
            },
        ];
        prisma.office.findMany = jest.fn().mockResolvedValue(mockdata);
        const response = await request(app)
            .get('/api/office')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(mockdata);
    });

    it('should return 200 fetching office by id', async () => {
        prisma.office.count = jest.fn().mockResolvedValue(1);
        prisma.office.findUnique = jest.fn().mockResolvedValue({
            id: 1,
            name: 'Jakarta Selatan (cabang)',
            latitude: '-6.26358199',
            longitude: '106.76192444',
        });

        const response = await request(app)
            .get('/api/office/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(1);
        expect(response.body.data.name).toBe('Jakarta Selatan (cabang)');
    });

    it('should create a new office successfully', async () => {
        prisma.office.count = jest.fn().mockResolvedValue(0);
        prisma.office.create = jest.fn().mockResolvedValue({
            id: 1,
            name: 'Jakarta Selatan (cabang)',
            latitude: '-6.26358199',
            longitude: '106.76192444',
        });
        const response = await request(app)
            .post('/api/office')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Jakarta Selatan (cabang)',
                latitude: '-6.26358199',
                longitude: '106.76192444',
            });
        expect(response.status).toBe(201);
        expect(response.body.data.name).toBe('Jakarta Selatan (cabang)');
    });

    it('should update a office successfully', async () => {
        const mockdata = {
            id: 1,
            name: 'Jakarta Selatan (cabang)',
            latitude: '-6.26358199',
            longitude: '106.76192444',
        };
        prisma.office.count = jest.fn().mockResolvedValue(0);
        prisma.office.findUnique = jest.fn().mockResolvedValue(mockdata);
        prisma.office.update = jest.fn().mockResolvedValue(mockdata);

        const response = await request(app)
            .put('/api/office/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Jakarta Selatan (cabang)',
                latitude: '-6.26358199',
                longitude: '106.76192444',
            });
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe('Jakarta Selatan (cabang)');
    });

    it('should delete a office successfully', async () => {
        const mockdata = {
            id: 1,
            name: 'Jakarta Selatan (cabang)',
            latitude: '-6.26358199',
            longitude: '106.76192444',
        };
        prisma.office.count = jest.fn().mockResolvedValue(1);
        prisma.office.delete = jest.fn().mockResolvedValue(mockdata);

        const response = await request(app)
            .delete('/api/office/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Office deleted successfully');
    });
});
