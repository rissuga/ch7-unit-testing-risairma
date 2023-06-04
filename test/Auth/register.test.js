const request = require("supertest");
const app = require ("../../app");

jest.useFakeTimers('legacy')

describe("REGISTER /v1/auth/register",() => {

    it("Register user success response with 201 as status code", async () => {
        const user = {
            name:"Anggun Shelly",
            email: "anggun@binar.co.id",
            password: "anggun123"
        }

        return await request(app).post('/v1/auth/register').send(user).then((res) => {
            expect(res.statusCode).toBe(201);
        });
    });

    it("Register user FAILED: EMAIL HAS BEEN TAKEN response with 422 as status code", async () => {
        const user = {
            email: "brian@binar.co.id",
            password: "123456"
        }

        return await request(app).post('/v1/auth/register').send(user).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    });
});