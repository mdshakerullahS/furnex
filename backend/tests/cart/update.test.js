import request from "supertest";
import app from "../../app.js";
import mongoose from "mongoose";
import Category from "../../src/models/category.model.js";
import Product from "../../src/models/product.model";
import Cart from "../../src/models/cart.model.js";

describe("PUT /api/cart/my-cart — Update cart endpoint", () => {
  const route = "/api/cart/my-cart";

  const validProduct = {
    title: "Console Table",
    description: "Slim console table perfect for hallways and entryways.",
    category: "Tables",
    features: ["Slim profile", "Modern finish", "Easy placement"],
    price: 11999,
    stock: 12,
  };

  const guestID = crypto.randomUUID();

  const objectID = new mongoose.Types.ObjectId();

  it("should return 400 if productID is missing", async () => {
    const res = await request(app).put(route).send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("ProductID missing");
  });

  it("should return 400 if quantity is missing", async () => {
    const res = await request(app).put(route).send({ productID: objectID });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Quantity required");
  });

  it("should return 400 if guestID is missing when user is not logged in", async () => {
    const res = await request(app)
      .put(route)
      .send({ productID: objectID, quantity: 1 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("guestID missing for guest cart");
  });

  it("should return 404 if cart is not found with the provided id", async () => {
    const res = await request(app)
      .put(route)
      .send({ productID: objectID, quantity: 1, guestID });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Cart not found");
  });

  it("should return 404 if product is not found with the provided id", async () => {
    await Cart.create({
      guestID,
      items: [],
    });

    const res = await request(app)
      .put(route)
      .send({ productID: objectID, quantity: 1, guestID });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });

  it("should return 404 if the item is not in the cart", async () => {
    const category = await Category.create({ name: "Table" });
    const product = await Product.create({
      ...validProduct,
      categoryID: category?._id,
    });

    const res = await request(app)
      .put(route)
      .send({ productID: product._id, quantity: 2, guestID });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Item not found in cart");
  });

  it("should update the cart and return 200", async () => {
    const product = await Product.findOne({ title: validProduct.title });

    await Cart.findOneAndUpdate(
      { guestID },
      { items: [{ productID: product._id }] },
    );

    const res = await request(app)
      .put(route)
      .send({ productID: product._id, quantity: 2, guestID });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Cart updated");
  });
});
