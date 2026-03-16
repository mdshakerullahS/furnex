import request from "supertest";
import app from "../../app.js";

describe("GET /api/categories — Fetch categories endpoint", () => {
  it("should fetch all categories", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.categories)).toBe(true);
  });
});
