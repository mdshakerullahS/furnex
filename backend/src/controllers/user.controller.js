import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "customerID",
          as: "orders",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          address: 1,
          ordersCount: { $size: "$orders" },
          totalSpent: { $sum: "$orders.totalPrice" },
        },
      },
    ]);

    return res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};
