import request from "supertest";
import app from "../src/app.ts";



describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'test1',
        email: 'p9TlP@example.com',
        password: 'password',
        roleId: 1
      });

     
      expect(response.status).toBe(201);
    });

    it('should return 409 if user already exists', async () => {
        const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'test1',
          email: 'p9TlP@example.com',
          password: 'password',
          roleId: 1
        });
  
       
        expect(response.status).toBe(409);
      });
})