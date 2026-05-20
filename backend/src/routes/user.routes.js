import express from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { getUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", verifyAdmin, getUsers);

export default router;
