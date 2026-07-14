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
describe('POST /auth/login/google ', () => {
    it('it should login the user with google', async () => {
        const response = await request(server).post(`/auth/login/google`).send({
            token: 'googleToken',
        });
        const count = await prisma.users.count();
        expect(count).toBe(1);
        expect(response.status).toBe(200);
    });
    it('it shouldnt login the user with google with no token', async () => {
        const response = await request(server).post(`/auth/login/google`).send({});
        const count = await prisma.users.count();
        expect(count).toBe(0);
        expect(response.status).toBe(400);
    });
    it('it shouldnt login the user with google with registiered email', async () => {
        (client.verifyIdToken as jest.Mock).mockResolvedValue({
            getPayload: () => ({
                email: 'test@gmail.com',
                name: 'Google User',
                sub: 'google123',
            }),
        });
        await createTestUser();
        const response = await request(server).post(`/auth/login/google`).send({
            token: 'googleToken',
        });
        const count = await prisma.users.count();
        expect(count).toBe(1);
        expect(response.status).toBe(409);
    });
    it('it shouldnt login the user with google with failed verification', async () => {
        (client.verifyIdToken as jest.Mock).mockResolvedValue(undefined);
        await createTestUser();
        const response = await request(server).post(`/auth/login/google`).send({
            token: 'googleToken',
        });
        expect(response.status).toBe(401);
    });
    it('it shouldnt login the user with google with no payload', async () => {
        (client.verifyIdToken as jest.Mock).mockResolvedValue({
            getPayload: () => undefined,
        });
        await createTestUser();
        const response = await request(server).post(`/auth/login/google`).send({
            token: 'googleToken',
        });
        expect(response.status).toBe(401);
    });
});
