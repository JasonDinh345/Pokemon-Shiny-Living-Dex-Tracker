jest.mock('../../utils/email', () => ({
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined)
}));
import * as authService from '../../services/auth.service';
import request from 'supertest';
import {server} from '../../server';
import prisma from '../../lib/prisma';

import client from '../../lib/google';
import {loginUser, loginUserWithAgent} from '../setup';

beforeEach(async () => {
    await prisma.users.deleteMany();
    await prisma.tokens.deleteMany();
});
describe('POST /auth/token', () => {
    it('it should logout the user', async () => {
        const agent = request.agent(server);
        await loginUserWithAgent(agent);
        const response = await agent.delete('/auth/logout');
        expect(response.status).toBe(200);
    });
    it('it should fail to logout the user with no refresh token', async () => {
        await loginUser(server);
        const response = await request(server).delete('/auth/logout');
        expect(response.status).toBe(400);
    });
    it('it should logout the user with expired token ', async () => {
        await loginUser(server);
        jest.spyOn(authService, 'getRefreshToken').mockResolvedValueOnce({
            token: 'expiredRefreshToken',
            user_email: 'test@gmail.com',
            expires_on: new Date(Date.now() + 60 * 60 * 1000),
            type: 'REFRESH'
        });

        const response = await request(server)
            .delete('/auth/logout')
            .set('Cookie', `refreshToken=${'expiredRefreshToken'}`);
        expect(response.status).toBe(200);
    });
});
