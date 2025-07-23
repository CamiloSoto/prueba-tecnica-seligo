const request = require("supertest");
const path = require("path");
const app = require("../app");

describe("Sales Upload Controller", () => {
  let token = "";

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "password123",
    });
    token = res.body.accessToken;
  });

  it("debe subir un archivo CSV válido", async () => {
    const filePath = path.join(__dirname, "files", "sample.csv");

    const res = await request(app)
      .post("/api/sales/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", filePath);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/File uploaded successfully/i);
  });

  it("debe rechazar un archivo CSV con estructura inválida", async () => {
    const filePath = path.join(__dirname, "files", "invalid.csv");

    const res = await request(app)
      .post("/api/sales/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", filePath);

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toMatch(/estructura inválida|invalid row|error/i);
  });
});
