import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import { createOTPRouter } from "./src/routes/otp.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import messageRoutes from "./src/routes/message.routes.js";
import { genOTP, sendOTPMail } from "./src/services/email.service.js";

dotenv.config();

export const createApp = (dep) => {
  const app = express();
  app.use(express.json({ limit: "50mb" }));

  // Middlewares
  app.use(cookieParser());
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    }),
  );

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/otp", createOTPRouter(dep));
  app.use("/api/categories", categoryRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/messages", messageRoutes);

  // Error middleware
  app.use((err, _, res, __) => {
    console.log(err.message); // eslint-disable-line no-console

    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  });

  return app;
};

const app = createApp({ genOTP, sendOTPMail });
export default app;
