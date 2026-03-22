import request from "supertest";
import app from "../../app.js";
import mongoose from "mongoose";
import Category from "../../src/models/category.model.js";
import Product from "../../src/models/product.model";
import Cart from "../../src/models/cart.model.js";

describe("DELETE /api/cart/my-cart/item — Remove cart item endpoint", () => {
  const route = "/api/cart/my-cart/item";

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

  it("should return 404 if cart is not found with the provided id", async () => {
    const res = await request(app)
      .delete(route)
      .send({ productID: objectID, guestID });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Cart not found");
  });

  it("should remove particulr item from the cart and return 200", async () => {
    const category = await Category.create({ name: "Table" });
    const product = await Product.create({
      ...validProduct,
      categoryID: category?._id,
    });
    await Cart.create({ guestID, items: [{ productID: product._id }] });

    const res = await request(app)
      .delete(route)
      .send({ productID: product._id, guestID });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Item removed");
  });
});
