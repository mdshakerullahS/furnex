import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.get("/", verifyAdmin, getSettings);
router.put("/", verifyAdmin, updateSettings);

export default router;
