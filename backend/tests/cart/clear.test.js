import request from "supertest";
import app from "../../app.js";
import Category from "../../src/models/category.model.js";
import Product from "../../src/models/product.model";
import Cart from "../../src/models/cart.model.js";

describe("DELETE /api/cart/my-cart — Clear cart endpoint", () => {
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

  it("should return 404 if cart is not found with the provided id", async () => {
    const res = await request(app).delete(route).send({ guestID });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Cart not found");
  });

  it("should clear the cart and return 200", async () => {
    const category = await Category.create({ name: "Table" });
    const product = await Product.create({
      ...validProduct,
      categoryID: category?._id,
    });
    await Cart.create({ guestID, items: [{ productID: product._id }] });

    const res = await request(app).delete(route).send({ guestID });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Cart cleared successfully");
  });
});
