const request = require("supertest");
const app = require("../../app");

describe("POST /v1/cars/:id/rent", () => {
  let jwtToken = "";

  beforeAll(async () => {
    const user = {
      email: "fikri@binar.co.id",
      password: "123456",
    };
    const response = await request(app).post("/v1/auth/login").send(user);
    jwtToken = response.body.accessToken;
  });

  it("should rent cars successfully and respond with status code 201", async () => {
    const payloadRent = {
      rentStartedAt: "2023-05-29 08:12:40.519+07",
    };
  
    const response = await request(app)
      .post("/v1/cars/201/rent")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send(payloadRent);
  
    console.log(response.body); // Tampilkan tanggapan respons dari server
  
    expect(response.statusCode).toBe(201);
  });
  
  

  it("should respond with status code 500 for wrong input", async () => {
    const payloadRent = {
      rentStartedAt: "21/05/2023",
    };

    const response = await request(app)
      .post("/v1/cars/5/rent")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send(payloadRent);

    expect(response.statusCode).toBe(500);
    // Add more assertions to validate the response body or other details if needed
  });

  it("should respond with status code 401 for unauthorized access", async () => {
    const payloadRent = {
      rentStartedAt: "2023-05-29 08:12:40.519+07",
    };

    const response = await request(app)
      .post("/v1/cars/7/rent")
      .send(payloadRent);

    expect(response.statusCode).toBe(401);
    // Add more assertions to validate the response body or other details if needed
  });
});
