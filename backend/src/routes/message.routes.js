import express from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import {
  createMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", createMessage);
router.get("/", verifyAdmin, getMessages);
router.patch("/:id", verifyAdmin, updateMessageStatus);
router.delete("/:id", verifyAdmin, deleteMessage);

export default router;
