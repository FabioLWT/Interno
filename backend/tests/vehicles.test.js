const request = require("supertest");
const app = require("../index");

describe("Vehicles API", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });
    token = res.body.token;
  });

  it("should create a new vehicle", async () => {
    const res = await request(app)
      .post("/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        plate: "ABC1234",
        description: "Test vehicle",
        year: 2020,
        model_id: 1,
        color: "Blue",
        purpose: "Personal",
        rest_location: "(10.123, -20.456)",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.plate).toBe("ABC1234");
  });

  it("should list all vehicles", async () => {
    const res = await request(app)
      .get("/vehicles")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
