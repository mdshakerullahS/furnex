import request from "supertest";
import app from "../../app.js";
import mongoose from "mongoose";
import Category from "../../src/models/category.model.js";
import Product from "../../src/models/product.model";

describe("POST /api/cart — Create cart endpoint", () => {
  const route = "/api/cart";

  const validProduct = {
    title: "Console Table",
    description: "Slim console table perfect for hallways and entryways.",
    category: "Tables",
    features: ["Slim profile", "Modern finish", "Easy placement"],
    price: 11999,
    stock: 12,
  };

  const objectID = new mongoose.Types.ObjectId();

  it("should return 400 if productID is missing", async () => {
    const res = await request(app).post(route).send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("ProductID missing");
  });

  it("should return 400 if quantity is less than 1", async () => {
    const res = await request(app)
      .post(route)
      .send({ productID: objectID, quantity: 0 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid quantity");
  });

  it("should return 400 if guestID is missing when user is not logged in", async () => {
    const res = await request(app)
      .post(route)
      .send({ productID: objectID, quantity: 1 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("guestID missing for guest cart");
  });

  it("should return 404 if product is not in the DB", async () => {
    const res = await request(app)
      .post(route)
      .send({ productID: objectID, guestID: crypto.randomUUID() });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });

  it("should return 400 if quantity is greater than stock", async () => {
    const category = await Category.create({ name: "Table" });
    const product = await Product.create({
      ...validProduct,
      categoryID: category?._id,
    });

    const res = await request(app).post(route).send({
      productID: product?._id,
      quantity: 20,
      guestID: crypto.randomUUID(),
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(`Only ${product.stock} items available`);
  });

  it("should add product to cart and return 201", async () => {
    const product = await Product.findOne({ title: validProduct.title });

    const res = await request(app)
      .post(route)
      .send({ productID: product?._id, guestID: crypto.randomUUID() });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Added to cart");
  });
});
