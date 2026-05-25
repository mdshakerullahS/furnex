import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: ["automatic", "promo_code"],
      default: "automatic",
    },
    code: { type: String },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    discountValue: { type: Number, required: true },
    targetScope: {
      type: String,
      enum: ["storewide", "category", "product"],
      default: "storewide",
    },
    targetValue: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Promotion", promotionSchema);
