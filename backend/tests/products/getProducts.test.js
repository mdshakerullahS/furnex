import request from "supertest";
import app from "../../app.js";

describe("GET /api/products — Fetch products endpoint", () => {
  const route = "/api/products";

  const query = {
    search: "table",
    category: "Table",
    minPrice: 50,
    maxPrice: 200,
    sortBy: "newest-first",
    currentPage: 1,
    limit: 12,
  };

  it("should fetch products from the DB", async () => {
    const res = await request(app).get(`${route}/?${query}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.totalProducts).toBe(0);
  });
});
