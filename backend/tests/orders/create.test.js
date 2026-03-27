import request from "supertest";
import app from "../../app.js";
import Product from "../../src/models/product.model.js";
import Category from "../../src/models/category.model.js";
import mongoose from "mongoose";
import User from "../../src/models/user.model.js";

describe("POST /api/orders — Create order endpoint", () => {
  const route = "/api/orders";

  const user = {
    name: "Mark Cuban",
    email: "dev@markcuban.com",
    password: "mark123",
    confirmPass: "mark123",
  };

  const orderData = {
    items: [{ productID: new mongoose.Types.ObjectId(), quantity: 20 }],
    shippingAddress: {
      street: "1001 Highway",
      city: "California",
      zip: "6000",
    },
  };

  it("should return 401 when user is not logged in", async () => {
    const res = await request(app).post(route).send(orderData);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Log in to place order");
  });

  it("should return 401 when user is not verified", async () => {
    const agent = request.agent(app);

    await agent.post("/api/auth/register").send(user);

    const res = await agent.post(route).send(orderData);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Verify your email to place order");
  });

  it("should return 400 when order data is invalid", async () => {
    const agent = request.agent(app);

    await User.findOneAndUpdate({ email: user.email }, { isVerified: true });

    await agent
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });

    const res = await agent.post(route).send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid order data");
  });

  it("should return 404 when any product from cart is not found", async () => {
    const agent = request.agent(app);

    await agent
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });
    const res = await agent.post(route).send(orderData);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });

  it("should return 400 when stock is insufficient", async () => {
    const agent = request.agent(app);

    await agent
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });

    const category = await Category.create({ name: "Table" });

    const product = await Product.create({
      title: "Console Table",
      description: "Slim console table perfect for hallways and entryways.",
      categoryID: category._id,
      features: ["Slim profile", "Modern finish", "Easy placement"],
      price: 11999,
      stock: 12,
    });

    const res = await agent.post(route).send({
      ...orderData,
      items: [{ productID: product._id, quantity: 20 }],
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(`Insufficient stock for ${product.title}`);
  });

  it("should create order and return 201", async () => {
    const agent = request.agent(app);

    await agent
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });

    const product = await Product.findOne({ title: "Console Table" });

    await agent.post("/api/cart").send({ productID: product?._id });
    const cartRes = await agent
      .post("/api/cart/my-cart")
      .send({ guestID: crypto.randomUUID() });

    const res = await agent.post(route).send({
      ...orderData,
      items: cartRes.body.cart?.items,
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Order placed successfully");
  });
});
