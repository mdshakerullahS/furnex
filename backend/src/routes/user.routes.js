import express from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { verifyRoles } from "../middlewares/verifyRoles.js";
import {
  getUsers,
  getAdmins,
  createAdmin,
  updateAdminRole,
  deleteAdmin,
} from "../controllers/user.controller.js";

const router = express.Router();

// Customer management
router.get("/", verifyAdmin, verifyRoles(["super_admin", "manager"]), getUsers);

// Admin management (super_admin only)
router.get("/admins", verifyAdmin, verifyRoles(["super_admin"]), getAdmins);
router.post("/admins", verifyAdmin, verifyRoles(["super_admin"]), createAdmin);
router.put(
  "/admins/:id",
  verifyAdmin,
  verifyRoles(["super_admin"]),
  updateAdminRole,
);
router.delete(
  "/admins/:id",
  verifyAdmin,
  verifyRoles(["super_admin"]),
  deleteAdmin,
);

export default router;
