const request = require("supertest");
const app = require("../app");

describe("Forecast Controller", () => {
  it("debe rechazar generación de forecast sin token", async () => {
    const res = await request(app).post("/api/forecast/generate").send({
      sku: "PROD001",
      horizon: 3,
      confidenceLevel: 0.95,
    });

    expect(res.statusCode).toBe(401);
  });
});
