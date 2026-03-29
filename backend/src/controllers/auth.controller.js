import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { handleGuestCart } from "../services/cart.service.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPass, guestID } = req.body;

    if (!name || !email || !password || !confirmPass) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    if (password !== confirmPass) {
      return res.status(400).json({
        message: "Passwords in the both fields should be the same",
      });
    }

    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPass,
      isVerified: false,
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      partitioned: process.env.NODE_ENV === "production",
      maxAge: 168 * 60 * 60 * 1000,
    });

    handleGuestCart(guestID, user._id);

    return res.status(201).json({
      user: {
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
      message: "User registered successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, guestID } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const verifyPass = await bcrypt.compare(password, user.password);
    if (!verifyPass) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      partitioned: process.env.NODE_ENV === "production",
      maxAge: 168 * 60 * 60 * 1000,
    });

    handleGuestCart(guestID, user._id);

    return res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
      message: "Logged in successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const loggedInUser = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) return res.status(401).json({ message: "User not found" });

    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};
