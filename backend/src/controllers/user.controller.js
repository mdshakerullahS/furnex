import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

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

export const getAdmins = async (req, res, next) => {
  try {
    const admins = await User.find({
      role: { $in: ["super_admin", "manager", "staff"] },
    })
      .select("-password")
      .sort({ createdAt: -1 });
    return res.status(200).json({ admins });
  } catch (err) {
    next(err);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const validRoles = ["super_admin", "manager", "staff"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name,
      email,
      password: hashedPass,
      role,
      isVerified: true, // Auto-verify admin accounts created by super_admin
    });

    return res
      .status(201)
      .json({ message: "Admin created successfully", admin });
  } catch (err) {
    next(err);
  }
};

export const updateAdminRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["super_admin", "manager", "staff"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Prevent modifying oneself
    if (id === req.admin.userId) {
      return res.status(400).json({ message: "Cannot modify your own role" });
    }

    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.role = role;
    await admin.save();

    return res
      .status(200)
      .json({ message: "Admin role updated successfully", admin });
  } catch (err) {
    next(err);
  }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent deleting oneself
    if (id === req.admin.userId) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    const admin = await User.findByIdAndDelete(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    next(err);
  }
};
