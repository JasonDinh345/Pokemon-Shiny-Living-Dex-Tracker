
jest.mock("../utils/email", () => ({
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
}));
import request from "supertest";
import { server } from "../server";
import prisma from "../lib/prisma";
import { TOKEN_TYPES } from "../config/token_types";
 beforeEach(async () => {
    await prisma.users.deleteMany();
    await prisma.tokens.deleteMany();
});
async function createTestUser() {
    await request(server)
        .post("/auth/register")
        .send({
            username: "Test",
            email: "test@gmail.com",
            password: "password123"
        });
}
async function createTestUserAndVerify() {
    await createTestUser();
    const tokenRecord = await prisma.tokens.findFirst();
    const token = tokenRecord?.token
    const response = await request(server)
        .post(`/auth/verify-email?token=${token}`)
}


describe("AUTH ROUTES", ()=>{
   
    describe("POST /auth/register ", () => {
        it("should create a new user", async () => {
            const response = await request(server)
                .post("/auth/register")
                .send({
                    username: "Test",
                    email: "test@gmail.com",
                    password: "password123"
                });
            expect(response.status).toBe(201);
        });
        it("should fail to create user with same email", async () => {
            await request(server)
                .post("/auth/register")
                .send({
                    username: "Dupe",
                    email: "test@gmail.com",
                    password: "password123"
                });
            const response = await request(server)
                .post("/auth/register")
                .send({
                    username: "Dupe",
                    email: "test@gmail.com",
                    password: "password123"
                });
            expect(response.status).toBe(409);
        });
         it("should fail to create user with missing fields", async () => {
    
            const response = await request(server)
                .post("/auth/register")
                .send({
                    email: "test@gmail.com",
                    password: "password123"
                });
               
            expect(response.status).toBe(400);
            
        });
        it("should fail to create user with invalid email", async () => {
    
            const response = await request(server)
                .post("/auth/register")
                .send({
                    username:"test",
                    email: "invalidemail",
                    password: "password123"
                });
            expect(response.status).toBe(400);
            expect(response.body.errors[0].message).toBe("Invalid email");
            
        });
        it("should fail to create user with invalid password", async () => {
    
            const response = await request(server)
                .post("/auth/register")
                .send({
                    username:"test",
                    email: "test@gmail.com",
                    password: "pass"
                });
            expect(response.status).toBe(400);
            expect(response.body.errors[0].message).toBe("Password must be at least 8 characters");
            
        });
    });
    describe("POST /auth/verify-email ", () => {
        
        it("it should verify the user", async () => {
            await createTestUser();
            const tokenRecord = await prisma.tokens.findFirst();
            expect(tokenRecord).not.toBeNull();
            const token = tokenRecord?.token
            const response = await request(server)
                .post(`/auth/verify-email?token=${token}`)
            expect(response.status).toBe(200);
        });
        it("it should fail to verify the user with fake token", async () => {
            await createTestUser();
            const response = await request(server)
                .post(`/auth/verify-email?token=${"faketoken"}`)
            expect(response.status).toBe(400);
        });
        it("it should fail to verify the user with expired token", async () => {
            await createTestUser();
            await prisma.tokens.update({
            where: {
                user_email_type: {
                    user_email: "test@gmail.com",
                    type: TOKEN_TYPES.EMAIL_VERIFICATION,
                },
            },
            data: {
                expires_on : new Date()
            },
            });
            const tokenRecord = await prisma.tokens.findFirst();
            expect(tokenRecord).not.toBeNull();
            const token = tokenRecord?.token
            const response = await request(server)
                .post(`/auth/verify-email?token=${token}`)
            expect(response.status).toBe(400);
        });
        it("it should fail to verify the user with no token", async () => {
            const response = await request(server)
                .post(`/auth/verify-email`)
            expect(response.status).toBe(400);
        });
    })
    describe("POST /auth/login ", () => {
        it("it should login the user", async () => {
            await createTestUserAndVerify()
            const response = await request(server)
                .post(`/auth/login`)
                .send({
                    email: "test@gmail.com",
                    password: "password123"
                });
            expect(response.status).toBe(200);
        });
        it("it shouldnt login the user with invalid email", async () => {
            await createTestUserAndVerify()
            const response = await request(server)
                .post(`/auth/login`)
                .send({
                    email: "testgmail.com",
                    password: "password123"
                });
            expect(response.status).toBe(400);
        });
        it("it shouldnt login the user with incorrect pass", async () => {
            await createTestUserAndVerify()
            const response = await request(server)
                .post(`/auth/login`)
                .send({
                    email: "test@gmail.com",
                    password: "password12"
                });
            expect(response.status).toBe(401);
        });
        it("it shouldnt login the user with no password", async () => {
            await createTestUserAndVerify()
            const response = await request(server)
                .post(`/auth/login`)
                .send({
                    email: "test@gmail.com"
                });
            expect(response.status).toBe(400);
        });
        it("it shouldnt login the user with unverified account", async () => {
            await createTestUser();
            const response = await request(server)
                .post(`/auth/login`)
                .send({
                    email: "test@gmail.com",
                    password: "password123"
                });
            expect(response.status).toBe(403);
        });
    })
})
    