import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const addCart = async (req, res, next) => {
  try {
    const { productID, quantity = 1, guestID } = req.body;

    if (!productID) {
      return res.status(400).json({ message: "ProductID missing" });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const customerID = req.user?._id;

    let cart = null;

    if (customerID) {
      cart = await Cart.findOne({ customerID });
      if (!cart) cart = new Cart({ customerID, items: [] });
    } else {
      if (!guestID) {
        return res
          .status(400)
          .json({ message: "guestID missing for guest cart" });
      }

      cart = await Cart.findOne({ guestID });
      if (!cart) cart = new Cart({ guestID, items: [] });
    }

    const product = await Product.findById(productID);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingItem = cart.items.find(
      (item) => item.productID.toString() === productID,
    );

    const totalQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    if (totalQuantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} items available`,
      });
    }

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productID, quantity });
    }

    await cart.save();

    return res.status(201).json({ message: "Added to cart" });
  } catch (err) {
    next(err);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const { guestID } = req.body;

    const customerID = req.user?._id;

    let cart = null;
    if (customerID) {
      cart = await Cart.findOne({ customerID }).populate("items.productID");
    } else if (guestID) {
      cart = await Cart.findOne({ guestID }).populate("items.productID");
    }

    return res.status(200).json({ cart });
  } catch (err) {
    next(err);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const { guestID, productID, quantity } = req.body;

    if (!productID)
      return res.status(400).json({ message: "ProductID missing" });
    if (!quantity)
      return res.status(400).json({ message: "Quantity required" });

    const customerID = req.user?._id;

    let cart;
    if (!customerID) {
      if (!guestID) {
        return res
          .status(400)
          .json({ message: "guestID missing for guest cart" });
      }

      cart = await Cart.findOne({ guestID });
    } else {
      cart = await Cart.findOne({ customerID });
    }
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const product = await Product.findById(productID);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cartItem = cart.items.find(
      (item) => item.productID.toString() === productID,
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cartItem.quantity += quantity;

    if (cartItem.quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.productID.toString() !== productID,
      );
    }

    await cart.save();

    return res.status(200).json({ message: "Cart updated" });
  } catch (err) {
    next(err);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const customerID = req.user?._id;
    const { guestID, productID } = req.body;

    let cart;
    if (customerID) {
      cart = await Cart.findOne({ customerID });
    } else if (guestID) {
      cart = await Cart.findOne({ guestID });
    }

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productID.toString() !== productID,
    );

    await cart.save();

    return res.status(200).json({
      message: "Item removed",
    });
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const { guestID } = req.body;

    const customerID = req.user?._id;

    let cart = null;

    if (customerID) {
      cart = await Cart.findOne({ customerID });
    } else if (guestID) {
      cart = await Cart.findOne({ guestID });
    }
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    next(err);
  }
};
