import express from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import {
  addCategory,
  deleteCategory,
  editCategory,
  getCategories,
} from "../controllers/category.controller.js";
import { uploadCategoryImage } from "../middlewares/multer.js";

const router = express.Router();

router.post("/", verifyAdmin, uploadCategoryImage.single("image"), addCategory);
router.get("/", getCategories);
router.put(
  "/:id",
  verifyAdmin,
  uploadCategoryImage.single("image"),
  editCategory,
);
router.delete("/:id", verifyAdmin, deleteCategory);

export default router;
