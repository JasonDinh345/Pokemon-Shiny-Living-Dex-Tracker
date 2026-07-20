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

describe('PATCH /caught-shinies/:id', () => {
    it('it should update a shiny from the user', async () => {
        const response = await agent.patch(`/caught-shinies/${pokemon.id}`).send({
            nickname: 'TEST'
        });
        expect(response.status).toBe(200);
        expect(response.body.nickname).not.toEqual(pokemon.nickname);
    });
    it('it should update a shiny from the user without changing id or email', async () => {
        const response = await agent.patch(`/caught-shinies/${pokemon.id}`).send({
            id: 3,
            user_email: 'updatedemail@gmail.com'
        });
        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(pokemon.id);
        expect(response.body.user_email).toEqual(pokemon.user_email);
    });
    it('it shouldnt update a shiny from the user with invalid id', async () => {
        const response = await agent.patch(`/caught-shinies/-1`).send({
            nickname: 'TEST'
        });
        expect(response.status).toBe(404);
    });
});
