import request from "supertest";
import app from "../../app.js";
import User from "../../src/models/user.model.js";
import Category from "../../src/models/category.model.js";

describe("POST /api/products — Add products endpoint", () => {
  const route = "/api/products";

  const validProduct = {
    title: "Console Table",
    description: "Slim console table perfect for hallways and entryways.",
    category: "Tables",
    features: ["Slim profile", "Modern finish", "Easy placement"],
    price: 11999,
    stock: 12,
  };

  it("should return 401 when admin is not logged in", async () => {
    const res = await request(app).post(route).send(validProduct);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Token not found");
  });

  it("should return 400 if required fields aremissing", async () => {
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
    expect(res.body.message).toBe("Title, price, and category are required");
  });

  it("should return 404 if provided category doesn't exist", async () => {
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
      .post(route)
      .send({ ...validProduct, category: "69b7d2940a82be96859c04ce" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Category not found");
  });

  it("should add product to DB and return 201", async () => {
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

    await agent.post("/api/categories").send({ name: "Table" });

    const category = await Category.findOne({ name: "Table" });

    const res = await agent
      .post(route)
      .send({ ...validProduct, category: category._id });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Product added successfully");
  });
});
