jest.mock('../../utils/email', () => ({
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    sendResetPassEmail: jest.fn().mockResolvedValue(undefined)
}));
import request from 'supertest';
import {server} from '../../server';
import prisma from '../../lib/prisma';
import {loginUser, loginUserWithAgent} from '../setup';

let agent: ReturnType<typeof request.agent>;

beforeEach(async () => {
    await prisma.users.deleteMany();
    await prisma.tokens.deleteMany();
    agent = request.agent(server);
    await loginUserWithAgent(agent);
});

describe('POST /caught-shinies/', () => {
    it('it should add a shiny to the users collection', async () => {
        const response = await agent.post('/caught-shinies').send({
            pokemon_name: 'Raichu',
            game: 'BW',
            method: 'Random Encounter'
        });
        expect(response.status).toBe(201);
        expect(response.body).not.toBeNull();
    });
    it('it shouldnt add a shiny to the users collection with missing fields', async () => {
        const response = await agent.post('/caught-shinies').send({
            pokemon_name: 'Raichu',
            game: 'BW'
        });
        expect(response.status).toBe(400);
    });
    it('it shouldnt add a shiny to the users collection with no token', async () => {
        agent = request.agent(server);
        await loginUser(server);
        const response = await request(server).post('/caught-shinies').send({
            pokemon_name: 'Raichu',
            game: 'BW',
            method: 'Random Encounter'
        });
        expect(response.status).toBe(403);
    });
});
