import request from "supertest";
import app from "../../app.js";

describe("GET /api/auth/logout — Logged in user Endpoint", () => {
  it("makes user logged out", async () => {
    const res = await request(app).post("/api/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged out successfully");
  });
});
