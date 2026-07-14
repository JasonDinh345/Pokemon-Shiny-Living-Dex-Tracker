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
async function createTestUser() {
    await request(server).post('/auth/register').send({
        username: 'Test',
        email: 'test@gmail.com',
        password: 'password123',
    });
}
async function createTestUserAndVerify() {
    await createTestUser();
    const tokenRecord = await prisma.tokens.findFirst();
    const token = tokenRecord?.token;
    await request(server).post(`/auth/verify-email?token=${token}`);
}
async function createGoogleUser() {
    await request(server).post(`/auth/login/google`).send({
        token: 'googleToken',
    });
}

describe('POST /auth/login ', () => {
    it('it should login the user', async () => {
        await createTestUserAndVerify();
        const response = await request(server).post(`/auth/login`).send({
            email: 'test@gmail.com',
            password: 'password123',
        });
        expect(response.status).toBe(200);
    });
    it('it shouldnt login the user with invalid email', async () => {
        await createTestUserAndVerify();
        const response = await request(server).post(`/auth/login`).send({
            email: 'testgmail.com',
            password: 'password123',
        });
        expect(response.status).toBe(400);
    });
    it('it shouldnt login the user with incorrect pass', async () => {
        await createTestUserAndVerify();
        const response = await request(server).post(`/auth/login`).send({
            email: 'test@gmail.com',
            password: 'password12',
        });
        expect(response.status).toBe(401);
    });
    it('it shouldnt login the user with no password', async () => {
        await createTestUserAndVerify();
        const response = await request(server).post(`/auth/login`).send({
            email: 'test@gmail.com',
        });
        expect(response.status).toBe(400);
    });
    it('it shouldnt login the user with unverified account', async () => {
        await createTestUser();
        const response = await request(server).post(`/auth/login`).send({
            email: 'test@gmail.com',
            password: 'password123',
        });
        expect(response.status).toBe(403);
    });
    it('it shouldnt login the user with registered google email', async () => {
        await createGoogleUser();
        const response = await request(server).post(`/auth/login`).send({
            email: 'googleTestUser@gmail.com',
            password: 'password123',
        });
        expect(response.status).toBe(409);
    });
});
