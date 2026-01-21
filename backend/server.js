import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import otpRoutes from "./src/routes/otp.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import messageRoutes from "./src/routes/message.routes.js";

dotenv.config();

const server = express();

// Middlewares
server.use(express.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// DB Connection
connectDB();

// Routes
server.use("/api/auth", authRoutes);
server.use("/api/otp", otpRoutes);
server.use("/api/categories", categoryRoutes);
server.use("/api/products", productRoutes);
server.use("/api/cart", cartRoutes);
server.use("/api/orders", orderRoutes);
server.use("/api/messages", messageRoutes);

// Error middleware
server.use((err, _, res, __) => {
  console.log(err.message);

  return res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server is running on http://0.0.0.0:${PORT}`),
);
