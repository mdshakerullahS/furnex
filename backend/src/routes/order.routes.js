import express from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { checkUser } from "../middlewares/checkUser.js";
import {
  createOrder,
  deleteOrder,
  getMyOrders,
  getOrders,
  updateOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", checkUser, createOrder);
router.get("/", verifyAdmin, getOrders);
router.get("/me", checkUser, getMyOrders);
router.put("/:id", verifyAdmin, updateOrder);
router.delete("/:id", verifyAdmin, deleteOrder);

export default router;
