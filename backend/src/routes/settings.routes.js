import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { verifyRoles } from "../middlewares/verifyRoles.js";

const router = express.Router();

router.get(
  "/",
  verifyAdmin,
  verifyRoles(["super_admin", "manager"]),
  getSettings,
);
router.put(
  "/",
  verifyAdmin,
  verifyRoles(["super_admin", "manager"]),
  updateSettings,
);

export default router;
