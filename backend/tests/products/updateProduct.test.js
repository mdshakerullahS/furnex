import request from "supertest";
import app from "../../app.js";
import User from "../../src/models/user.model.js";
import Product from "../../src/models/product.model.js";
import Category from "../../src/models/category.model.js";
import mongoose from "mongoose";

describe("PUT /api/products/:id — Update Product endpoint", () => {
  const route = "/api/products";

  const objectID = new mongoose.Types.ObjectId();

  const validProduct = {
    title: "Console Table",
    description: "Slim console table perfect for hallways and entryways.",
    category: "Tables",
    features: ["Slim profile", "Modern finish", "Easy placement"],
    price: 11999,
    stock: 12,
  };

  it("should return 401 if admin is not logged in", async () => {
    const res = await request(app)
      .put(`${route}/${objectID}`)
      .send(validProduct);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Token not found");
  });

  it("should return 404 if product is not in the DB", async () => {
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

    const res = await agent.put(`${route}/${objectID}`).send(validProduct);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });

  it("should update product in the DB and return 200", async () => {
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

    const category = await Category.create({ name: "Table" });
    await agent.post(route).send({ ...validProduct, category: category._id });
    const product = await Product.findOne({ title: validProduct.title });
    const res = await agent
      .put(`${route}/${product._id}`)
      .send({ ...validProduct, discountPrice: 9999 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Product updated successfully");
  });
});
