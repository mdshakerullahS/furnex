import express from "express";

import { checkUser } from "../middlewares/checkUser.js";
import { createOTPController } from "../controllers/otp.controller.js";

export const createOTPRouter = (deps) => {
  const router = express.Router();

  const controller = createOTPController(deps);

  router.post("/request-otp", checkUser, controller.reqOTP);
  router.post("/verify-otp", checkUser, controller.verifyOTP);

  return router;
};
