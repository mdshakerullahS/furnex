import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;
    const customerID = req.user?._id;

    if (!req.user)
      return res.status(401).json({ message: "Log in to place order" });

    if (!req.user.isVerified)
      return res
        .status(401)
        .json({ message: "Verify your email to place order" });

    if (
      !items ||
      !Array.isArray(items) ||
      items.length <= 0 ||
      !shippingAddress
    ) {
      return res.status(400).json({
        message: "Invalid order data",
      });
    }

    let totalPrice = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productID);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.title}`,
        });
      }

      totalPrice += product.price * item.quantity;
      orderItems.push({
        productID: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      product.stock -= item.quantity;
      await product.save();
    }

    await Order.create({
      customerID,
      items: orderItems,
      totalPrice,
      shippingAddress,
    });

    const cart = await Cart.findOne({ customerID });
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      message: "Order placed successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (_, res, next) => {
  try {
    const orders = await Order.find()
      .populate("customerID")
      .populate("items.productID");

    return res.status(200).json({ orders });
  } catch (err) {
    next(err);
  }
};

export const getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({ order });
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
