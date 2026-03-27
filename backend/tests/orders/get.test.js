import request from "supertest";
import app from "../../app.js";
import Category from "../../src/models/category.model.js";
import Product from "../../src/models/product.model.js";
import User from "../../src/models/user.model.js";

describe("GET /api/orders — Fetch order endpoint", () => {
  const route = "/api/orders";

  it("should return 401 when admin is not logged in", async () => {
    const res = await request(app).get(route);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Token not found");
  });

  it("should return all orders with 200 status", async () => {
    const agent = request.agent(app);

    await agent.post("/api/auth/register").send({
      name: "Mark Cuban",
      email: "dev@markcuban.com",
      password: "mark123",
      confirmPass: "mark123",
    });

    const user = await User.findOneAndUpdate(
      { email: "dev@markcuban.com" },
      { role: "admin", isVerified: true },
    );

    await agent.post("/api/auth/logout");

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

    await agent.post(route).send({
      items: cartRes.body.cart?.items,
      shippingAddress: {
        street: "1001 Highway",
        city: "California",
        zip: "6000",
      },
    });

    const res = await agent.get(route);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      orders: expect.any(Array),
    });
    expect(res.body.orders[0]).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        totalPrice: 11999,
        status: "Pending",
        items: expect.any(Array),
      }),
    );
    expect(res.body.orders[0].shippingAddress).toMatchObject({
      street: "1001 Highway",
      city: "California",
      zip: "6000",
    });
  });
});
