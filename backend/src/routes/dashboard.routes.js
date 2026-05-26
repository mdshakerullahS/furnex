import express from "express";
import { getOverviewData } from "../controllers/dashboard.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.get("/overview", verifyAdmin, getOverviewData);

export default router;
