import express from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import {
  addProduct,
  deleteProduct,
  getBestSellers,
  getProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/products.controller.js";
import { uploadProductImage } from "../middlewares/multer.js";

const router = express.Router();

router.post("/", verifyAdmin, uploadProductImage.array("images"), addProduct);
router.get("/", getProducts);
router.get("/best-sellers", getBestSellers);
router.get("/:id", getSingleProduct);
router.put(
  "/:id",
  verifyAdmin,
  uploadProductImage.array("images"),
  updateProduct,
);
router.delete("/:id", verifyAdmin, deleteProduct);

export default router;
