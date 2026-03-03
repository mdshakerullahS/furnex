import bcrypt from "bcryptjs";
import OTP from "../models/OTP.model.js";
import { saveOTP, sendOTPMail } from "../services/email.service.js";

export const reqOTP = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user)
      return res.status(401).json({ message: "Not authorized, please login" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await saveOTP(user.email, otp);
    await sendOTPMail(user.email, otp);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    next(err);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;

    const user = req.user;

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
      isVerified: user.isVerified,
      message: "OTP verified",
    });
  } catch (err) {
    next(err);
  }
};
