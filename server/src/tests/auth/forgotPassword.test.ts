jest.mock('../../utils/email', () => ({
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    sendResetPassEmail: jest.fn().mockResolvedValue(undefined)
}));
import request from 'supertest';
import {server} from '../../server';
import prisma from '../../lib/prisma';
import {createTestUserAndVerify} from '../setup';

beforeEach(async () => {
    await prisma.users.deleteMany();
    await prisma.tokens.deleteMany();
});
describe('POST /auth/forgot-password ', () => {
    it('it should send an email to the user', async () => {
        await createTestUserAndVerify(server);
        const response = await request(server).post('/auth/forgot-password/').send({
            email: 'test@gmail.com'
        });
        expect(response.status).toBe(202);
        const count = await prisma.tokens.count();
        expect(count).toBe(1);
    });
    it('it shouldnt send an email to the user with no email', async () => {
        const response = await request(server).post('/auth/forgot-password/').send({});
        expect(response.status).toBe(400);
    });
    it('it shouldnt insert token with unregistered email', async () => {
        const response = await request(server).post('/auth/forgot-password/').send({
            email: 'fakeUser@gmail.com'
        });
        expect(response.status).toBe(202);
        const count = await prisma.tokens.count();
        expect(count).toBe(0);
    });
});
