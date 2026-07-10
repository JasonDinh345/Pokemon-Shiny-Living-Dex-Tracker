
jest.mock("../utils/email", () => ({
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
}));
import request from "supertest";
import { server } from "../server";





describe("AUTH ROUTES", ()=>{
    describe("POST /auth/register", () => {
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
    });
})
    