import express from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import {
  createPromotion,
  getPromotions,
  togglePromotion,
  deletePromotion,
} from "../controllers/promotion.controller.js";

const router = express.Router();

router.post("/", verifyAdmin, createPromotion);
router.get("/", verifyAdmin, getPromotions);
router.patch("/:id/toggle", verifyAdmin, togglePromotion);
router.delete("/:id", verifyAdmin, deletePromotion);

export default router;
