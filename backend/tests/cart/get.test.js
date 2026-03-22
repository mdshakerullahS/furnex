import request from "supertest";
import app from "../../app.js";
import Category from "../../src/models/category.model.js";
import Product from "../../src/models/product.model";

describe("POST /api/cart/my-cart — Fetch cart endpoint", () => {
  const route = "/api/cart";

  const validProduct = {
    title: "Console Table",
    description: "Slim console table perfect for hallways and entryways.",
    category: "Tables",
    features: ["Slim profile", "Modern finish", "Easy placement"],
    price: 11999,
    stock: 12,
  };

  const guestID = crypto.randomUUID();

  it("should return cart with 200 status", async () => {
    const category = await Category.create({ name: "Table" });
    const product = await Product.create({
      ...validProduct,
      categoryID: category?._id,
    });

    await request(app).post(route).send({ productID: product?._id, guestID });

    const res = await request(app).post(`${route}/my-cart`).send({ guestID });

    expect(res.status).toBe(200);
    expect(res.body.cart).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        guestID,
        items: expect.any(Array),
      }),
    );

    const item = res.body.cart.items[0];
    expect(item).toEqual(
      expect.objectContaining({
        quantity: 1,
        _id: expect.any(String),
      }),
    );
    expect(item.productID).toMatchObject({
      _id: product._id.toString(),
      title: product.title,
      description: product.description,
      categoryID: product.categoryID.toString(),
      features: product.features,
      price: product.price,
      stock: product.stock,
    });
  });
});
