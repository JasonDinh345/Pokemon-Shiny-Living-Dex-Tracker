jest.mock('../../utils/email', () => ({
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    sendResetPassEmail: jest.fn().mockResolvedValue(undefined)
}));
import * as authService from '../../services/auth.service';
import request from 'supertest';
import {server} from '../../server';
import prisma from '../../lib/prisma';
import {loginUser, loginUserWithAgent} from '../setup';

beforeEach(async () => {
    await prisma.users.deleteMany();
    await prisma.tokens.deleteMany();
});

describe('POST /auth/token', () => {
    it('it should generate a new token for the user', async () => {
        const agent = request.agent(server);
        await loginUserWithAgent(agent);
        const response = await agent.post('/auth/token');
        expect(response.status).toBe(200);
    });
    it('it should generate new token with no refresh token', async () => {
        await loginUser(server);
        const response = await request(server).post('/auth/token');
        expect(response.status).toBe(400);
    });
    it('it should generate new token with expired refresh token', async () => {
        await loginUser(server);
        const response = await request(server)
            .post('/auth/token')
            .set('Cookie', `refreshToken=${'fakeRefreshToken'}`);
        expect(response.status).toBe(403);
    });
    it('it should generate new token with unvalid refresh token', async () => {
        await loginUser(server);
        jest.spyOn(authService, 'getRefreshToken').mockResolvedValueOnce({
            token: 'expiredRefreshToken',
            user_email: 'test@gmail.com',
            expires_on: new Date(Date.now() - 24 * 60 * 60 * 1000),
            type: 'REFRESH'
        });

        const response = await request(server)
            .post('/auth/token')
            .set('Cookie', `refreshToken=${'expiredRefreshToken'}`);
        expect(response.status).toBe(401);
    });
});
