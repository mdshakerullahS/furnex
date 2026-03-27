import request from "supertest";
import app from "../../app.js";
import mongoose from "mongoose";
import User from "../../src/models/user.model.js";
import Category from "../../src/models/category.model.js";
import Product from "../../src/models/product.model.js";
import Order from "../../src/models/order.model.js";

describe("PUT /api/orders/:id — Update order endpoint", () => {
  const route = "/api/orders";

  const objectID = new mongoose.Types.ObjectId();

  const shippingAddress = {
    street: "1001 Highway",
    city: "California",
    zip: "6000",
  };

  it("should return 401 when admin is not logged in", async () => {
    const res = await request(app)
      .put(`${route}/${objectID}`)
      .send({ status: "Completed" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Token not found");
  });

  it("should return 404 when order is not found by the provided id", async () => {
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
      .put(`${route}/${objectID}`)
      .send({ status: "Completed" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Order not found");
  });

  it("should update order and return 200", async () => {
    const agent = request.agent(app);

    await User.findOneAndUpdate(
      { email: "dev@markcuban.com" },
      { isVerified: true },
    );
    await agent
      .post("/api/auth/login")
      .send({ email: "dev@markcuban.com", password: "mark123" });

    const category = await Category.create({ name: "Table" });
    const product = await Product.create({
      title: "Console Table",
      description: "Slim console table perfect for hallways and entryways.",
      categoryID: category._id,
      features: ["Slim profile", "Modern finish", "Easy placement"],
      price: 11999,
      stock: 12,
    });
    await agent.post("/api/cart").send({ productID: product?._id });
    const cartRes = await agent
      .post("/api/cart/my-cart")
      .send({ guestID: crypto.randomUUID() });
    await agent.post("/api/orders").send({
      items: cartRes.body.cart?.items,
      shippingAddress,
    });

    const order = await Order.findOne({
      "shippingAddress.city": shippingAddress.city,
    });
    const res = await agent
      .put(`${route}/${order?._id}`)
      .send({ status: "Completed" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Order updated successfully");
  });
});
