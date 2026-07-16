import dotenv from 'dotenv';
import request from 'supertest';
import prisma from '../lib/prisma';

dotenv.config({
    path: '.env.test'
});

export async function createTestUser(server: any) {
    await request(server).post('/auth/register').send({
        username: 'Test',
        email: 'test@gmail.com',
        password: 'password123'
    });
}

export async function createTestUserAndVerify(server: any) {
    await createTestUser(server);
    const tokenRecord = await prisma.tokens.findFirst();
    const token = tokenRecord?.token;
    await request(server).post(`/auth/verify-email?token=${token}`);
}
export async function sendResetPassEmail(server: any) {
    await createTestUserAndVerify(server);
    await request(server).post('/auth/forgot-password/').send({
        email: 'test@gmail.com'
    });
}
export async function createGoogleUser(server: any) {
    await request(server).post(`/auth/login/google`).send({
        token: 'googleToken'
    });
}
export async function loginUserWithAgent(agent: any) {
    await agent.post('/auth/register').send({
        username: 'Test',
        email: 'test@gmail.com',
        password: 'password123'
    });
    const tokenRecord = await prisma.tokens.findFirst();
    const token = tokenRecord?.token;
    await agent.post(`/auth/verify-email?token=${token}`);

    await agent.post(`/auth/login`).send({
        email: 'test@gmail.com',
        password: 'password123'
    });
}
