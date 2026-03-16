import request from "supertest";
import app from "../../app.js";
import User from "../../src/models/user.model.js";

describe("POST /api/categories — Add category endpoint", () => {
  const route = "/api/categories";

  const validCategory = { name: "Table" };

  it("should return 401 if admin is not logged in", async () => {
    const res = await request(app).post(route).send(validCategory);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Token not found");
  });

  it("should return 400 if name is not provided", async () => {
    const agent = request.agent(app);

    await agent.post("/api/auth/register").send({
      name: "Mark Cuban",
      email: "dev@markcuban.com",
      password: "mark123",
      confirmPass: "mark123",
    });

    await User.findOneAndUpdate(
      { email: "dev@markcuban.com" },
      { role: "admin" },
    );

    await agent.post("/api/auth/logout");
    await agent
      .post("/api/auth/login")
      .send({ email: "dev@markcuban.com", password: "mark123" });

    const res = await agent.post(route).send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Category name is required");
  });

  it("should add category to DB and return 201", async () => {
    const agent = request.agent(app);

    await agent.post("/api/auth/register").send({
      name: "Mark Cuban",
      email: "dev@markcuban.com",
      password: "mark123",
      confirmPass: "mark123",
    });

    await User.findOneAndUpdate(
      { email: "dev@markcuban.com" },
      { role: "admin" },
    );

    await agent.post("/api/auth/logout");
    await agent
      .post("/api/auth/login")
      .send({ email: "dev@markcuban.com", password: "mark123" });

    const res = await agent.post(route).send(validCategory);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Category added successfully");
  });

  it("should return 400 if category already exists", async () => {
    const agent = request.agent(app);

    await agent.post("/api/auth/register").send({
      name: "Mark Cuban",
      email: "dev@markcuban.com",
      password: "mark123",
      confirmPass: "mark123",
    });

    await User.findOneAndUpdate(
      { email: "dev@markcuban.com" },
      { role: "admin" },
    );

    await agent.post("/api/auth/logout");
    await agent
      .post("/api/auth/login")
      .send({ email: "dev@markcuban.com", password: "mark123" });

    const res = await agent.post(route).send(validCategory);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Category with this name already exists");
  });
});
