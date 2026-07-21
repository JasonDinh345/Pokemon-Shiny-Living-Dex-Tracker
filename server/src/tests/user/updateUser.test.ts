jest.mock('../../utils/email', () => ({
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    sendResetPassEmail: jest.fn().mockResolvedValue(undefined)
}));
import request from 'supertest';
import {server} from '../../server';
import prisma from '../../lib/prisma';
import {loginUserWithAgent} from '../setup';

let agent: ReturnType<typeof request.agent>;

beforeEach(async () => {
    await prisma.users.deleteMany();
    await prisma.tokens.deleteMany();
    agent = request.agent(server);
    await loginUserWithAgent(agent);
});

describe('PATCH /user/', () => {
    it('it should update username of the user', async () => {
        const response = await agent.patch('/user').send({
            username: 'updatedUsername'
        });

        expect(response.status).toBe(204);
    });
    it('it shouldnt update username of the user with no data', async () => {
        const response = await agent.patch('/user').send({});

        expect(response.status).toBe(400);
    });
    it('it shouldnt update username of the user while not auth', async () => {
        await agent.delete('/auth/logout');
        const response = await agent.patch('/user').send({
            username: 'updatedUsername'
        });

        expect(response.status).toBe(403);
    });
});
