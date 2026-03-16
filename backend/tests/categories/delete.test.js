import request from "supertest";
import app from "../../app.js";
import User from "../../src/models/user.model.js";
import Category from "../../src/models/category.model.js";

describe("DELETE /api/categories — Delete Category endpoint", () => {
  const route = "/api/categories";

  const validCategory = { name: "Table" };

  it("should return 401 if admin is not logged in", async () => {
    const res = await request(app).delete(`${route}/random-id`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Token not found");
  });

  it("should return 404 if category is not in the DB", async () => {
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

    const res = await agent
      .put(`${route}/69b7d2940a82be96859c04ce`)
      .send(validCategory);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Category not found");
  });

  it("should delete category from the DB and return 200", async () => {
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

    await agent.post(route).send({ name: "Sofa" });
    const category = await Category.findOne({ name: "Sofa" });
    const res = await agent.delete(`${route}/${category._id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Category deleted successfully");
  });
});
