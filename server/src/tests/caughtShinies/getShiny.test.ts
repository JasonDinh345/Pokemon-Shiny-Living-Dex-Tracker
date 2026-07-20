jest.mock('../../utils/email', () => ({
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    sendResetPassEmail: jest.fn().mockResolvedValue(undefined)
}));
import request from 'supertest';
import {server} from '../../server';
import prisma from '../../lib/prisma';
import {loginUserWithAgent} from '../setup';
import CaughtShiny from '../../types/caught_shinies_type';

let agent: ReturnType<typeof request.agent>;
let pokemon: CaughtShiny;
beforeEach(async () => {
    await prisma.users.deleteMany();
    await prisma.tokens.deleteMany();
    await prisma.caught_shinies.deleteMany();
    agent = request.agent(server);
    await loginUserWithAgent(agent);
    const res = await agent.post('/caught-shinies').send({
        pokemon_name: 'Raichu',
        game: 'BW',
        method: 'Random Encounter'
    });
    pokemon = res.body;
});
describe('GET /caught-shinies/:id', () => {
    it('it should get a shiny from the user', async () => {
        const response = await agent.get(`/caught-shinies/${pokemon.id}`);
        expect(response.status).toBe(200);
        expect(response.body).not.toBeNull();
    });
    it('it shouldnt get a shiny from the user with invalid id', async () => {
        const response = await agent.get(`/caught-shinies/-1`);
        expect(response.status).toBe(404);
    });
    it('it shouldnt get a shiny from the user with invalid auth', async () => {
        await agent.delete('/auth/logout');
        const response = await agent.get(`/caught-shinies/${pokemon.id}`);
        expect(response.status).toBe(403);
    });
});
describe('GET /caught-shinies/all', () => {
    it('it should get all shinies from the user', async () => {
        await agent.post('/caught-shinies').send({
            pokemon_name: 'Caterpie',
            game: 'BW',
            method: 'Random Encounter'
        });
        const response = await agent.get(`/caught-shinies/all`);

        expect(response.status).toBe(200);
        expect(response.body).not.toBeNull();
        expect(response.body.length).toBe(2);
    });
    it('it shouldnt get a shiny from the user no shinies', async () => {
        await prisma.caught_shinies.deleteMany();
        const response = await agent.get(`/caught-shinies/all`);
        expect(response.status).toBe(200);
        expect(response.body).not.toBeNull();
        expect(response.body.length).toBe(0);
    });
    it('it shouldnt get a shiny from the user with invalid auth', async () => {
        await agent.delete('/auth/logout');
        const response = await agent.get(`/caught-shinies/all`);
        expect(response.status).toBe(403);
    });
});
