jest.mock('../../utils/email', () => ({
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    sendResetPassEmail: jest.fn().mockResolvedValue(undefined)
}));
import request from 'supertest';
import {server} from '../../server';
import prisma from '../../lib/prisma';

import client from '../../lib/google';
import {TOKEN_TYPES} from '../../config/token_types';
async function createTestUser() {
    await request(server).post('/auth/register').send({
        username: 'Test',
        email: 'test@gmail.com',
        password: 'password123'
    });
}
async function createTestUserAndVerify() {
    await createTestUser();
    const tokenRecord = await prisma.tokens.findFirst();
    const token = tokenRecord?.token;
    await request(server).post(`/auth/verify-email?token=${token}`);
}
async function sendResetPassEmail() {
    await createTestUserAndVerify();
    await request(server).post('/auth/forgot-password/').send({
        email: 'test@gmail.com'
    });
}
beforeEach(async () => {
    await prisma.users.deleteMany();
    await prisma.tokens.deleteMany();
});
describe('GET /auth/reset-password ', () => {
    it('should send status 200', async () => {
        await sendResetPassEmail();
        const tokenData = await prisma.tokens.findUnique({
            where: {
                user_email_type: {
                    user_email: 'test@gmail.com',
                    type: TOKEN_TYPES.RESET_PASS
                }
            }
        });

        const resetToken = tokenData?.token;
        console.log(new Date());
        const response = await request(server).get(`/auth/reset-password?token=${resetToken}`);

        expect(response.status).toBe(200);
    });
});
