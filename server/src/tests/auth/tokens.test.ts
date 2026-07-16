jest.mock('../../utils/email', () => ({
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    sendResetPassEmail: jest.fn().mockResolvedValue(undefined)
}));

import request from 'supertest';
import {server} from '../../server';
import prisma from '../../lib/prisma';
import {loginUserWithAgent} from '../setup';

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
});
