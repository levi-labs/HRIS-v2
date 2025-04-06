import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mockedToken, loginAndGetToken } from './utils/authHelper';
import { mockedEmployee } from './utils/employeeHelper';
import { upload } from '../src/middlewares/multer.middleware';

jest.mocked(prisma);
jest.mocked('bcrypt');
jest.mocked('jsonwebtoken');

describe('Document Service', () => {
    let token: string;
    let employee: {};
    beforeAll(async () => {
        token = await mockedToken();
        employee = await mockedEmployee();
    });
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if the user is not authenticated', async () => {
        const response = await request(app)
            .get('/api/document')
            .set('Authorization', `Invalid token`)
            .send({});
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized: Token is missing or invalid');
    });
    it('should return 200 fetching all documents', async () => {
        const mockdata = [
            {
                id: 1,
                employeeId: employee['id'],
                title: 'Document 1',
                filePath: 'path/to/file1.pdf',
            },
        ];
        prisma.document.findMany = jest.fn().mockResolvedValue(mockdata);
        const response = await request(app)
            .get('/api/document')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(mockdata);
    });
    it('should return 200 fetching document by id', async () => {
        prisma.document.findUnique = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: employee['id'],
            title: 'Document 1',
            filePath: 'path/to/file1.pdf',
        });
        const response = await request(app)
            .get('/api/document/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual({
            id: 1,
            employeeId: employee['id'],
            title: 'Document 1',
            filePath: 'path/to/file1.pdf',
        });
    });
    it('should return 404 if the document is not found', async () => {
        prisma.document.findUnique = jest.fn().mockResolvedValue(null);
        const response = await request(app)
            .get('/api/document/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Document not found');
    });
    it('should return 201 uploading document', async () => {
        prisma.document.create = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: employee['id'],
            title: 'Document 1',
            filePath: 'path/to/file1.pdf',
        });
        const fakeFile = '%PDF-1.4\n%âãÏÓ\n1 0 obj\n<< /Type /Catalog >>\nendobj';
        const response = await request(app)
            .post('/api/document')
            .set('Authorization', `Bearer ${token}`)
            .field({ title: 'Test Document' })
            .field({ employeeId: employee['id'] })
            .attach('file', Buffer.from(fakeFile, 'utf-8'), 'test.pdf');

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Document created successfully');
    });
    it('should return 200 updating document', async () => {
        prisma.document.findUnique = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: employee['id'],
            title: 'Document 1',
            filePath: 'path/to/file1.pdf',
        });
        prisma.document.update = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: employee['id'],
            title: 'Document 1',
            filePath: 'path/to/file1.pdf',
        });
        const response = await request(app)
            .put('/api/document/1')
            .set('Authorization', `Bearer ${token}`)
            .field({ title: 'Test Document' })
            .field({ employeeId: employee['id'] })
            .attach('file', Buffer.from('test file'), 'test.pdf');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Document updated successfully');
    });
    it('should return 200 deleting document', async () => {
        prisma.document.findUnique = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: employee['id'],
            title: 'Document 1',
            filePath: 'path/to/file1.pdf',
        });
        prisma.document.delete = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: employee['id'],
            title: 'Document 1',
            filePath: 'path/to/file1.pdf',
        });
        const response = await request(app)
            .delete('/api/document/1')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Document deleted successfully');
    });
});
