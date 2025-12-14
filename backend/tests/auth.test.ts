
process.env.JWT_SECRET = 'test_secret';

import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server';
import User from '../src/models/User';


describe('Auth API', () => {
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kata');
        }
        await User.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'User registered successfully');
            expect(res.body).toHaveProperty('token');
        });

        it('should validation error if email is invalid', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser2',
                    email: 'invalid-email',
                    password: 'password123'
                });
            expect(res.statusCode).toEqual(400); // Bad Request
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login an existing user', async () => {
            // Register first
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'loginuser',
                    email: 'login@example.com',
                    password: 'password123'
                });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });
    });
});
