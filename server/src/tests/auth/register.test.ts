jest.mock('../../utils/email', () => ({
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../lib/google', () => ({
    __esModule: true,
    default: {
        verifyIdToken: jest.fn(),
    },
}));
import request from 'supertest';
import {server} from '../../server';
import prisma from '../../lib/prisma';

import client from '../../lib/google';

beforeEach(async () => {
    await prisma.users.deleteMany();
    await prisma.tokens.deleteMany();
    (client.verifyIdToken as jest.Mock).mockResolvedValue({
        getPayload: () => ({
            email: 'googleTestUser@gmail.com',
            name: 'Google User',
            sub: 'google123',
        }),
    });
});

async function createGoogleUser() {
    await request(server).post(`/auth/login/google`).send({
        token: 'googleToken',
    });
}
describe('POST /auth/register ', () => {
    it('should create a new user', async () => {
        const response = await request(server).post('/auth/register').send({
            username: 'Test',
            email: 'test@gmail.com',
            password: 'password123',
        });
        expect(response.status).toBe(201);
    });
    it('should fail to create user with same email', async () => {
        await request(server).post('/auth/register').send({
            username: 'Dupe',
            email: 'test@gmail.com',
            password: 'password123',
        });
        const response = await request(server).post('/auth/register').send({
            username: 'Dupe',
            email: 'test@gmail.com',
            password: 'password123',
        });
        expect(response.status).toBe(409);
    });
    it('should fail to create user with registered google email', async () => {
        await createGoogleUser();
        const response = await request(server).post('/auth/register').send({
            username: 'Dupe',
            email: 'googleTestUser@gmail.com',
            password: 'password123',
        });
        expect(response.status).toBe(409);
    });
    it('should fail to create user with missing fields', async () => {
        const response = await request(server).post('/auth/register').send({
            email: 'test@gmail.com',
            password: 'password123',
        });

        expect(response.status).toBe(400);
    });
    it('should fail to create user with invalid email', async () => {
        const response = await request(server).post('/auth/register').send({
            username: 'test',
            email: 'invalidemail',
            password: 'password123',
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].message).toBe('Invalid email');
    });
    it('should fail to create user with invalid password', async () => {
        const response = await request(server).post('/auth/register').send({
            username: 'test',
            email: 'test@gmail.com',
            password: 'pass',
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].message).toBe('Password must be at least 8 characters');
    });
});
