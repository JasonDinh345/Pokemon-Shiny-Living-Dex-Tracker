jest.mock('../../utils/email', () => ({
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    sendResetPassEmail: jest.fn().mockResolvedValue(undefined)
}));
import request from 'supertest';
import {server} from '../../server';
import prisma from '../../lib/prisma';
import {TOKEN_TYPES} from '../../config/token_types';
import {sendResetPassEmail} from '../setup';

beforeEach(async () => {
    await prisma.users.deleteMany();
    await prisma.tokens.deleteMany();
});
describe('PATCH /auth/reset-password ', () => {
    it('should send status 200', async () => {
        await sendResetPassEmail(server);
        const tokenData = await prisma.tokens.findUnique({
            where: {
                user_email_type: {
                    user_email: 'test@gmail.com',
                    type: TOKEN_TYPES.RESET_PASS
                }
            }
        });

        const resetToken = tokenData?.token;
        const response = await request(server).patch('/auth/reset-password').send({
            token: resetToken,
            password: 'newPassword345'
        });
        expect(response.status).toBe(200);
    });
    it('it should fail with no token', async () => {
        const response = await request(server).patch('/auth/reset-password').send({
            password: 'newPassword345'
        });
        expect(response.status).toBe(400);
    });
    it('it should fail with no password', async () => {
        const response = await request(server).patch('/auth/reset-password').send({
            token: 'token'
        });
        expect(response.status).toBe(400);
    });
    it('should fail with invail/expired token', async () => {
        const response = await request(server).patch('/auth/reset-password').send({
            token: 'fakeToken',
            password: 'newPassword345'
        });
        expect(response.status).toBe(403);
    });
});
