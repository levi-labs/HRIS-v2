import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mockedToken, loginAndGetToken } from './utils/authHelper';
import { TransferRequestStatus } from '@prisma/client';

jest.mocked(prisma);
jest.mocked('bcrypt');
jest.mocked('jsonwebtoken');

describe('Transfer Request Service', () => {
    let token: string;
    beforeAll(async () => {
        token = await mockedToken();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return 401 if the user is not authenticated', async () => {
        const response = await request(app)
            .get('/api/transfer-request')
            .set('Authorization', `Invalid token`)
            .send({});
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized: Token is missing or invalid');
    });

    it('should return 200 fetching all transfer requests', async () => {
        const mockdata = [
            {
                id: 1,
                employeeId: 1,
                officeId: 1,
            },
        ];
        prisma.transferRequest.findMany = jest.fn().mockResolvedValue(mockdata);
        const response = await request(app)
            .get('/api/transfer-request')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(mockdata);
    });

    it('should return 200 fetching transfer request by id', async () => {
        prisma.transferRequest.findUnique = jest.fn().mockResolvedValue({
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            status: TransferRequestStatus.PENDING,
        });
        const response = await request(app)
            .get('/api/transfer-request/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual({
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            status: TransferRequestStatus.PENDING,
        });
    });

    it('should return 404 if the transfer request is not found', async () => {
        prisma.transferRequest.findUnique = jest.fn().mockResolvedValue(null);
        const response = await request(app)
            .get('/api/transfer-request/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Transfer Request not found');
    });

    it('should return 201 creating transfer request successfully from employee', async () => {
        prisma.transferRequest.count = jest.fn().mockResolvedValue(0);
        prisma.transferRequest.create = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            status: TransferRequestStatus.PENDING,
        });
        const response = await request(app)
            .post('/api/transfer-request/create-from-employee')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: 1,
                fromOffice: 1,
                toOffice: 1,
                status: TransferRequestStatus.PENDING,
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Transfer request created successfully');
        expect(response.body.data).toEqual({
            id: 1,
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            status: TransferRequestStatus.PENDING,
        });
    });
    it('should return 409 if the transfer request already exists from employee', async () => {
        prisma.transferRequest.count = jest.fn().mockResolvedValue(1);
        const response = await request(app)
            .post('/api/transfer-request/create-from-employee')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: 1,
                fromOffice: 1,
                toOffice: 1,
                status: TransferRequestStatus.PENDING,
            });
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Data for transfer request already exists');
    });

    it('should return 201 creating transfer request successfully from hrd', async () => {
        prisma.transferRequest.count = jest.fn().mockResolvedValue(0);
        prisma.transferRequest.create = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            approvedBy: 1,
            status: TransferRequestStatus.PENDING,
        });
        const response = await request(app)
            .post('/api/transfer-request/create-from-hrd')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: 1,
                fromOffice: 1,
                toOffice: 1,
                approvedBy: 1,
                status: TransferRequestStatus.PENDING,
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Transfer request created successfully');
        expect(response.body.data).toEqual({
            id: 1,
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            approvedBy: 1,
            status: TransferRequestStatus.PENDING,
        });
    });
    it('should return 409 if the transfer request already exists from hrd', async () => {
        prisma.transferRequest.count = jest.fn().mockResolvedValue(1);
        const response = await request(app)
            .post('/api/transfer-request/create-from-hrd')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: 1,
                fromOffice: 1,
                toOffice: 1,
                approvedBy: 1,
                status: TransferRequestStatus.PENDING,
            });
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Data for transfer request already exists');
    });
    it('should return 200 updating transfer request successfully from employee', async () => {
        prisma.transferRequest.findFirst = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            status: TransferRequestStatus.PENDING,
        });
        prisma.transferRequest.update = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            status: TransferRequestStatus.APPROVED,
        });
        const response = await request(app)
            .put('/api/transfer-request/update-from-employee/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: 1,
                fromOffice: 1,
                toOffice: 1,
                status: TransferRequestStatus.APPROVED,
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Transfer request updated successfully');
        expect(response.body.data).toEqual({
            id: 1,
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            status: TransferRequestStatus.APPROVED,
        });
    });
    it('should return 409 if the transfer request status is not pending from employee', async () => {
        prisma.transferRequest.findFirst = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            status: TransferRequestStatus.APPROVED,
        });
        const response = await request(app)
            .put('/api/transfer-request/update-from-employee/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: 1,
                fromOffice: 1,
                toOffice: 1,
                status: TransferRequestStatus.APPROVED,
            });
        expect(response.status).toBe(409);
        expect(response.body.message).toBe(
            'Transfer request cannot be updated because it is not pending',
        );
    });

    it('should return 200 updating transfer request successfully from hrd', async () => {
        prisma.transferRequest.findFirst = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            approvedBy: 1,
            status: TransferRequestStatus.PENDING,
        });
        prisma.transferRequest.update = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            approvedBy: 1,
            status: TransferRequestStatus.APPROVED,
        });
        const response = await request(app)
            .put('/api/transfer-request/update-from-hrd/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: 1,
                fromOffice: 1,
                toOffice: 1,
                approvedBy: 1,
                status: TransferRequestStatus.APPROVED,
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Transfer request updated successfully');
        expect(response.body.data).toEqual({
            id: 1,
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            approvedBy: 1,
            status: TransferRequestStatus.APPROVED,
        });
    });
    it('should return 200 approve transfer request successfully', async () => {
        prisma.transferRequest.findUnique = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            approvedBy: 1,
            status: TransferRequestStatus.PENDING,
        });
        prisma.transferRequest.update = jest.fn().mockResolvedValue({
            status: TransferRequestStatus.APPROVED,
        });
        const response = await request(app)
            .patch('/api/transfer-request/approve/1')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Transfer request approved successfully');
        expect(response.body.data).toEqual({
            status: 'APPROVED',
        });
    });
    it('should return 200 reject transfer request successfully', async () => {
        prisma.transferRequest.findUnique = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            approvedBy: 1,
            status: TransferRequestStatus.PENDING,
        });
        prisma.transferRequest.update = jest.fn().mockResolvedValue({
            status: TransferRequestStatus.REJECTED,
        });
        const response = await request(app)
            .patch('/api/transfer-request/reject/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Transfer request rejected successfully');
        expect(response.body.data).toEqual({
            status: 'REJECTED',
        });
    });
    it('should return 200 delete transfer request successfully', async () => {
        prisma.transferRequest.findFirst = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            approvedBy: 1,
            status: TransferRequestStatus.PENDING,
        });
        prisma.transferRequest.delete = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            approvedBy: 1,
            status: TransferRequestStatus.PENDING,
        });

        const response = await request(app)
            .delete('/api/transfer-request/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Transfer request deleted successfully');
    });
    it('should return 409 when transfer request delete failed because it is not pending', async () => {
        prisma.transferRequest.findFirst = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 1,
            fromOfficeId: 1,
            toOfficeId: 1,
            approvedBy: 1,
            status: TransferRequestStatus.APPROVED,
        });
        const response = await request(app)
            .delete('/api/transfer-request/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(409);
        expect(response.body.message).toBe(
            'Transfer request cannot be deleted because it is not pending',
        );
    });
});
