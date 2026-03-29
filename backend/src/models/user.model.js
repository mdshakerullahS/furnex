import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: { type: Boolean, required: true, default: false },
    address: {
      city: String,
      state: String,
      zip: Number,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
