import request from 'supertest';
import app from '../src/app.ts';
import prisma from '../src/config/prisma.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mockedToken, loginAndGetToken } from './utils/authHelper.ts';

jest.mocked(prisma);
jest.mocked('bcrypt');
jest.mocked('jsonwebtoken');

describe('Job Position Service', () => {
    let token: string;
    beforeEach(async () => {
        token = await mockedToken();
    });
    afterAll(() => {
        jest.clearAllMocks();
    });
    it('should return 401 if the user is not authenticated', async () => {
        prisma.jobPosition.findMany = jest.fn().mockResolvedValue([]);
        prisma.jobPosition.count = jest.fn().mockResolvedValue(0);

        const response = await request(app)
            .post('/api/job-position')
            .set('Authorization', `Invalid token`)
            .send({
                name: 'HR',
                level: 'HR',
                salary_min: 1000000,
                salary_max: 2000000,
                department_id: 1,
            });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized: Token is missing or invalid');
    });
    it('should return 200 fetching all job positions', async () => {
        const mockdata = [
            {
                id: 1,
                name: 'junior programmer',
                level: 'JUNIOR',
                salary_min: '1000000',
                salary_max: '2000000',
                department_id: 1,
            },
            {
                id: 2,
                name: 'recruiter',
                level: 'ENTRY_LEVEL',
                salary_min: '1000000',
                salary_max: '2000000',
                department_id: 2,
            },
        ];

        prisma.jobPosition.findMany = jest.fn().mockResolvedValue(mockdata);

        const response = await request(app)
            .get('/api/job-position')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(mockdata);
    });

    it('should return 422 error validation', async () => {
        const response = await request(app)
            .post('/api/job-position')
            .set('Authorization', `Bearer ${token}`)
            .send({
                // name: 'HR',
                // level: 'HR',
                // // salary_min: 1000000,
                // // salary_max: 2000000,
                // department_id: 1,
            });
        expect(response.status).toBe(422);
        expect(response.body.message).toBe('Validation Error');
    });

    it('should create a new job position successfully', async () => {
        prisma.jobPosition.count = jest.fn().mockResolvedValue(0);
        prisma.jobPosition.create = jest.fn().mockResolvedValue({
            id: 1,
            name: 'junior programmer',
            level: 'JUNIOR',
            salary_min: '1000000',
            salary_max: '2000000',
            department_id: 1,
        });
        const response = await request(app)
            .post('/api/job-position')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'junior programmer',
                level: 'JUNIOR',
                salary_min: 1000000,
                salary_max: 2000000,
                department_id: 1,
            });

        expect(response.status).toBe(201);
        expect(response.body.data.name).toBe('junior programmer');
    });

    it('should return 404 if the job position is not found', async () => {
        prisma.jobPosition.findUnique = jest.fn().mockResolvedValue(null);
        const response = await request(app)
            .get('/api/job-position/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Job Position not found');
    });

    it('should update a job position successfully', async () => {
        const mockdata = {
            id: 1,
            name: 'junior programmer',
            level: 'JUNIOR',
            salary_min: '1000000',
            salary_max: '2000000',
            department_id: 1,
        };
        prisma.jobPosition.findUnique = jest.fn().mockResolvedValue(mockdata);
        prisma.jobPosition.count = jest.fn().mockResolvedValue(0);
        prisma.jobPosition.update = jest.fn().mockResolvedValue(mockdata);

        const response = await request(app)
            .put('/api/job-position/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'junior programmer',
                level: 'JUNIOR',
                salary_min: 1000000,
                salary_max: 2000000,
                department_id: 1,
            });
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe('junior programmer');
    });

    it('should delete a job position successfully', async () => {
        const mockdata = {
            id: 1,
            name: 'junior programmer',
            level: 'JUNIOR',
            salary_min: '1000000',
            salary_max: '2000000',
            department_id: 1,
        };
        prisma.jobPosition.findUnique = jest.fn().mockResolvedValue(mockdata);
        prisma.jobPosition.delete = jest.fn().mockResolvedValue(mockdata);

        const response = await request(app)
            .delete('/api/job-position/1')
            .set('Authorization', `Bearer ${token}`);

        console.log('response', response.body);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Job position deleted successfully');
    });
});
