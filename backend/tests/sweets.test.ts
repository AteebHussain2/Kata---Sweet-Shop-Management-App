
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server';
import User from '../src/models/User';
import Sweet from '../src/models/Sweet';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

describe('Sweets API', () => {
    let userToken: string;
    let adminToken: string;
    let sweetId: string;

    beforeAll(async () => {
        // Connect to test database if not already connected (server.ts might have connected)
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kata_test');
        }

        // Cleanup
        await User.deleteMany({});
        await Sweet.deleteMany({});

        // Create Users
        const user = await User.create({ username: 'user', email: 'user@test.com', password: 'password', role: 'user' });
        const admin = await User.create({ username: 'admin', email: 'admin@test.com', password: 'password', role: 'admin' });

        // Generate Tokens
        userToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
        adminToken = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET);
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Sweet.deleteMany({});
        await mongoose.connection.close();
    });

    describe('POST /api/sweets', () => {
        it('should allow admin to add a sweet', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Choco Lava',
                    category: 'Cake',
                    price: 5.99,
                    quantity: 10
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body.name).toEqual('Choco Lava');
            sweetId = res.body._id;
        });

        it('should deny non-admin users', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name: 'Test', category: 'Test', price: 1, quantity: 1 });
            expect(res.statusCode).toEqual(403); // Or 401/403
        });
    });

    describe('GET /api/sweets', () => {
        it('should list all sweets', async () => {
            const res = await request(app).get('/api/sweets').set('Authorization', `Bearer ${userToken}`);
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/sweets/search', () => {
        it('should search by name', async () => {
            const res = await request(app)
                .get('/api/sweets/search?name=Lava')
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body[0].name).toContain('Lava');
        });
    });

    describe('PUT /api/sweets/:id', () => {
        it('should allow admin to update', async () => {
            const res = await request(app)
                .put(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ price: 6.99 });
            expect(res.statusCode).toEqual(200);
            expect(res.body.price).toEqual(6.99);
        });
    });

    describe('Inventory Operations', () => {
        it('should allow purchase (decrease qty)', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ quantity: 2 });

            expect(res.statusCode).toEqual(200);
            expect(res.body.quantity).toEqual(8); // 10 - 2
        });

        it('should allow admin to restock', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ quantity: 5 });

            expect(res.statusCode).toEqual(200);
            expect(res.body.quantity).toEqual(13); // 8 + 5
        });
    });

    describe('DELETE /api/sweets/:id', () => {
        it('should allow admin to delete', async () => {
            const res = await request(app)
                .delete(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.statusCode).toEqual(200);
        });
    });
});
