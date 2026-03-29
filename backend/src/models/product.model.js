import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    features: { type: [String] },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
    },
    stock: {
      type: Number,
      default: 0,
    },
    imageURLs: {
      type: [String],
      default: [],
    },
    cloudinaryIDs: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
