const request = require("supertest");
const app = require("../app");

describe("User Configuration Controller", () => {
  let token = "";

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "password123",
    });

    token = res.body.accessToken;
  });

  it("debe obtener la configuración del usuario autenticado", async () => {
    const res = await request(app)
      .get("/api/config")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("confidenceLevel");
    expect(res.body).toHaveProperty("forecastHorizon");
  });

  it("debe actualizar la configuración del usuario", async () => {
    const res = await request(app)
      .put("/api/config")
      .set("Authorization", `Bearer ${token}`)
      .send({
        confidenceLevel: 0.9,
        forecastHorizon: 4,
        alertThresholds: { min: 100, max: 10000 },
        notificationSettings: { email: true },
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("confidenceLevel", 0.9);
    expect(res.body).toHaveProperty("forecastHorizon", 4);
  });
});
