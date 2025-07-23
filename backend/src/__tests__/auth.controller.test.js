const request = require("supertest");
const app = require("../app");

describe("Auth Controller", () => {
  it("debe rechazar login con credenciales inválidas", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "fake@test.com",
      password: "wrongpass",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Credenciales inválidas");
  });

  it("debe aceptar login con credenciales válidas", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });
});
