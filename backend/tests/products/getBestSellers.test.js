import request from "supertest";
import app from "../../app.js";

describe("GET /api/products/best-sellers — Fetch best sellers endpoint", () => {
  const route = "/api/products/best-sellers";

  it("should fetch best sellers from the DB", async () => {
    const res = await request(app).get(route);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.bestSellers)).toBe(true);
  });
});
