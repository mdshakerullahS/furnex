import bcrypt from "bcryptjs";
import OTP from "../models/OTP.model.js";
import { saveOTP, sendOTPMail } from "../services/email.service.js";
import User from "../models/user.model.js";

export const reqOTP = async (req, res, next) => {
  try {
    const userID = req.user?._id;
    const email = req.user?.email;

    if (!userID)
      return res.status(401).json({ message: "Not authorized, please login" });

    if (!email) {
      const user = await User.findById(userID);
      if (!user) return res.status(404).json({ message: "User not found" });
      email = user.email;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await saveOTP(email, otp);
    await sendOTPMail(email, otp);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    next(err);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;

    const userID = req.user._id;
    const user = await User.findOne({ _id: userID }).select("-password");

    const record = await OTP.findOne({ email: user.email });
    if (!record) return res.status(404).json({ message: "Invalid OTP" });

    if (record.expiresAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) return res.status(404).json({ message: "Invalid OTP" });

    user.isVerified = true;

    await user.save();

    await OTP.deleteOne({ email: user.email });

    return res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
      message: "OTP verified",
    });
  } catch (err) {
    next(err);
  }
};
