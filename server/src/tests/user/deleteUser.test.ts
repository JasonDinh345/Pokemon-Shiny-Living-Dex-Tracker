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

describe('DELETE /user/', () => {
    it('it should delete the user', async () => {
        await agent.post('/caught-shinies').send({
            pokemon_name: 'Raichu',
            game: 'BW',
            method: 'Random Encounter'
        });
        const response = await agent.delete('/user');
        const count = await agent.get('/caught-shinies/all');
        expect(count.body.length).toBe(0);
        expect(response.status).toBe(204);
    });
    it('it shouldnt delete the user while not auth', async () => {
        await agent.delete('/auth/logout');
        const response = await agent.delete('/user');

        expect(response.status).toBe(403);
    });
});
