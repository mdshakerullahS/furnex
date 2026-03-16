import request from "supertest";
import app from "../../app.js";

describe("GET /api/auth/me — Logged in user Endpoint", () => {
  it("returns 401 if not logged in", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("User not found");
  });

  it("returns logged in user data", async () => {
    const agent = request.agent(app);

    await agent.post("/api/auth/register").send({
      name: "Mark Cuban",
      email: "dev@markcuban.com",
      password: "mark123",
      confirmPass: "mark123",
    });

    const res = await agent.get("/api/auth/me");

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({
      name: "Mark Cuban",
      email: "dev@markcuban.com",
      isVerified: false,
      role: "customer",
    });
  });
});
