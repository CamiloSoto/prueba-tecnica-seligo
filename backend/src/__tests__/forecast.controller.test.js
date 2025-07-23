const request = require("supertest");
const app = require("../app");

describe("Forecast Controller", () => {
  let accessToken = "";

  beforeAll(async () => {
    // Hacer login y obtener token válido
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "password123",
    });

    accessToken = res.body.accessToken;
  });

  it("debe rechazar generación de forecast sin token", async () => {
    const res = await request(app).post("/api/forecast/generate").send({
      sku: "PROD001",
      horizon: 3,
      confidenceLevel: 0.95,
    });

    expect(res.statusCode).toBe(401);
  });

  it("debe generar uno o más forecasts con token válido", async () => {
    const res = await request(app)
      .post("/api/forecast/generate")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        sku: "PROD001",
        horizon: 3,
        confidenceLevel: 0.95,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("forecasts");
    expect(Array.isArray(res.body.forecasts)).toBe(true);
    expect(res.body.forecasts.length).toBeGreaterThan(0);

    const first = res.body.forecasts[0];
    expect(first).toHaveProperty("baseValue");
    expect(first).toHaveProperty("upperBound");
    expect(first).toHaveProperty("lowerBound");
    expect(first).toHaveProperty("forecastDate");
  });
});
