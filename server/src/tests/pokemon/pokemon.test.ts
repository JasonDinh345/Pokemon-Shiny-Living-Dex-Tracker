import {server} from '../../server';
import request from 'supertest';

describe('GET /pokemon/:name', () => {
    it('it should get pokemon data from api', async () => {
        const response = await request(server).get(`/pokemon/1`);
        expect(response.status).toBe(200);
        expect(response.body).not.toBeNull();
    });

    it('it shouldnt get pokemon data from api with invalid name', async () => {
        const response = await request(server).get(`/pokemon/fakepokemon`);

        expect(response.status).toBe(404);
    });
});
describe('GET /gen/:id', () => {
    it('it should get gen data from api', async () => {
        const response = await request(server).get(`/pokemon/gen/1`);

        expect(response.status).toBe(200);
        expect(response.body).not.toBeNull();
    });

    it('it shouldnt get pokemon data from api with invalid name', async () => {
        const response = await request(server).get(`/pokemon/gen/-1`);

        expect(response.status).toBe(404);
    });
});
