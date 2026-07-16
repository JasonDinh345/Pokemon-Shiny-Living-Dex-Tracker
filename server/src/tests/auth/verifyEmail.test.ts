jest.mock('../../utils/email', () => ({
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined)
}));

beforeEach(async () => {
    await prisma.users.deleteMany();
    await prisma.tokens.deleteMany();
});

import request from 'supertest';
import {server} from '../../server';
import prisma from '../../lib/prisma';
import {TOKEN_TYPES} from '../../config/token_types';
import {createTestUser} from '../setup';

describe('POST /auth/verify-email ', () => {
    it('it should verify the user', async () => {
        await createTestUser(server);
        const tokenRecord = await prisma.tokens.findFirst();
        expect(tokenRecord).not.toBeNull();
        const token = tokenRecord?.token;
        const response = await request(server).post(`/auth/verify-email?token=${token}`);
        expect(response.status).toBe(200);
    });
    it('it should fail to verify the user with fake token', async () => {
        await createTestUser(server);
        const response = await request(server).post(`/auth/verify-email?token=${'faketoken'}`);
        expect(response.status).toBe(400);
    });
    it('it should fail to verify the user with expired token', async () => {
        await createTestUser(server);
        await prisma.tokens.update({
            where: {
                user_email_type: {
                    user_email: 'test@gmail.com',
                    type: TOKEN_TYPES.EMAIL_VERIFICATION
                }
            },
            data: {
                expires_on: new Date()
            }
        });
        const tokenRecord = await prisma.tokens.findFirst();
        expect(tokenRecord).not.toBeNull();
        const token = tokenRecord?.token;
        const response = await request(server).post(`/auth/verify-email?token=${token}`);
        expect(response.status).toBe(400);
    });
    it('it should fail to verify the user with no token', async () => {
        const response = await request(server).post(`/auth/verify-email`);
        expect(response.status).toBe(400);
    });
});
