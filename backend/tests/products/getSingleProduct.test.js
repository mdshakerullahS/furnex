import request from "supertest";
import app from "../../app.js";
import Product from "../../src/models/product.model.js";
import Category from "../../src/models/category.model.js";
import mongoose from "mongoose";

describe("GET /api/products/:id — Fetch single product endpoint", () => {
  const route = "/api/products";

  it("should return 404 if product not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app).get(`${route}/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });

  it("should fetch single product from the DB", async () => {
    const category = await Category.create({ name: "Table" });
    const product = await Product.create({
      title: "Console Table",
      description: "Slim console table perfect for hallways and entryways.",
      categoryID: category._id,
      features: ["Slim profile", "Modern finish", "Easy placement"],
      price: 11999,
      stock: 12,
    });

    const res = await request(app).get(`${route}/${product._id}`);

    expect(res.status).toBe(200);
    expect(res.body.product).toEqual(
      expect.objectContaining({
        _id: product._id.toString(),
        title: "Console Table",
        price: 11999,
        stock: 12,
      }),
    );
    expect(res.body.product.categoryID).toMatchObject({
      _id: category._id.toString(),
      name: "Table",
    });
    expect(res.body.product.cloudinaryIDs).toBeUndefined();
  });
});
