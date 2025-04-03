import request from 'supertest';
import app from '../../src/app.ts';
import jwt from 'jsonwebtoken';
import { log } from 'console';
export const loginAndGetToken = async () => {
    const loginData = {
        username: 'alvingates',
        password: 'password',
    };

    const response = await request(app).post('/api/auth/login').send(loginData);

    if (response.status !== 200) {
        throw new Error(`Login failed: ${response.status} ${response.body.message}`);
    }

    return response.body.data.token; // Pastikan respons dari login berisi token
};

export const mockedToken = () => {
    return jwt.sign(
        { id: 1, username: 'testuser', role: { id: 1, name: 'admin' } },
        'hris123', // Sesuaikan dengan secret yang digunakan di aplikasi kamu
        { expiresIn: '1h' },
    );
};

export const mockedAsEmployee = () => {
    return jwt.sign(
        {
            id: 2,
            username: 'johndoe',
            email: 'd4iJi@example.com',
            role: { id: 2, name: 'employee' },
        },
        'hris123',
        { expiresIn: '1h' },
    );
};
