import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: "Furnex Premium" },
    storeEmail: { type: String, default: "support@furnex.com" },
    storePhone: { type: String, default: "+1 (555) 234-5678" },
    currency: { type: String, default: "USD" },
    address: { type: String, default: "224 Luxury Showroom Dr, New York, NY" },
    stripePublicKey: { type: String, default: "" },
    stripeSecretKey: { type: String, default: "" },
    enableCod: { type: Boolean, default: true },
    lowStockThreshold: { type: Number, default: 10 },
    enableNotifications: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
