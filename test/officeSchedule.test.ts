import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mockedToken, loginAndGetToken } from './utils/authHelper';
import { late } from 'zod';

jest.mocked(prisma);
jest.mocked('bcrypt');
jest.mocked('jsonwebtoken');

describe('Office Schedule', () => {
    let token: string;
    beforeAll(async () => {
        token = await mockedToken();
    });
    afterAll(() => {
        jest.clearAllMocks();
    });
    it('should return 401 if the user is not authenticated', async () => {
        const response = await request(app)
            .get('/api/office-schedule')
            .set('Authorization', `Invalid token`)
            .send({});
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized: Token is missing or invalid');
    });

    it('should return 200 fetching all office schedules', async () => {
        const mockdata = [
            {
                id: 1,
                office_id: 1,
                day: 'SENIN',
                work_start: '2025-03-19T09:00:00.000Z',
                work_end: '2025-03-19T17:00:00.000Z',
                break_start: null,
                break_end: null,
                late_tolerance: 15,
                early_tolerance: 10,
            },
        ];
        prisma.officeSchedule.findMany = jest.fn().mockResolvedValue(mockdata);
        const response = await request(app)
            .get('/api/office-schedule')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
    });

    it('should return 404 if the office schedule is not found', async () => {
        prisma.officeSchedule.findUnique = jest.fn().mockResolvedValue(null);
        const response = await request(app)
            .get('/api/office-schedule/1')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Office Schedule not found');
    });

    it('should return 200 fetching office schedule by id', async () => {
        prisma.officeSchedule.count = jest.fn().mockResolvedValue(1);
        prisma.officeSchedule.findUnique = jest.fn().mockResolvedValue({
            id: 1,
            office_id: 1,
            day: 'SENIN',
            work_start: '2025-03-19T09:00:00.000Z',
            work_end: '2025-03-19T17:00:00.000Z',
            break_start: null,
            break_end: null,
            late_tolerance: 15,
            early_tolerance: 10,
        });
        const response = await request(app)
            .get('/api/office-schedule/1')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(1);
        expect(response.body.data.day).toBe('SENIN');
    });

    it('should create a new office schedule successfully', async () => {
        prisma.officeSchedule.count = jest.fn().mockResolvedValue(0);
        prisma.officeSchedule.create = jest.fn().mockResolvedValue({
            id: 1,
            office_id: 1,
            day: 'SENIN',
            work_start: '2025-03-19T09:00:00.000Z',
            work_end: '2025-03-19T17:00:00.000Z',
            break_start: null,
            break_end: null,
            late_tolerance: 15,
            early_tolerance: 10,
        });
        const response = await request(app)
            .post('/api/office-schedule')
            .set('Authorization', `Bearer ${token}`)
            .send({
                office_id: 1,
                day: 'SENIN',
                work_start: '2025-03-19T09:00:00.000Z',
                work_end: '2025-03-19T17:00:00.000Z',
                late_tolerance: 15,
                early_tolerance: 10,
            });

        expect(response.status).toBe(201);
        expect(response.body.data.day).toBe('SENIN');
    });

    it('should update a office schedule successfully', async () => {
        prisma.officeSchedule.count = jest.fn().mockResolvedValue(1);
        prisma.officeSchedule.update = jest.fn().mockResolvedValue({
            id: 1,
            office_id: 1,
            day: 'SENIN',
            work_start: '2025-03-19T09:00:00.000Z',
            work_end: '2025-03-19T17:00:00.000Z',
            break_start: null,
            break_end: null,
            late_tolerance: 15,
            early_tolerance: 10,
        });
        const response = await request(app)
            .put('/api/office-schedule/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                office_id: 1,
                day: 'SENIN',
                work_start: '2025-03-19T09:00:00.000Z',
                work_end: '2025-03-19T17:00:00.000Z',
                late_tolerance: 15,
                early_tolerance: 10,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.day).toBe('SENIN');
    });

    it('should delete a office schedule successfully', async () => {
        const mockdata = {
            id: 1,
            office_id: 1,
            day: 'SENIN',
            work_start: '2025-03-19T09:00:00.000Z',
            work_end: '2025-03-19T17:00:00.000Z',
            break_start: null,
            break_end: null,
            late_tolerance: 15,
            early_tolerance: 10,
        };
        prisma.officeSchedule.count = jest.fn().mockResolvedValue(1);
        prisma.officeSchedule.delete = jest.fn().mockResolvedValue(mockdata);

        const response = await request(app)
            .delete('/api/office-schedule/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Office schedule deleted successfully');
    });
});
