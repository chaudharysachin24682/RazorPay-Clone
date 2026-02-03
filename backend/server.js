import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express(); // 🔥 FIRST

// 🔥 LOG EVERY REQUEST (VERY IMPORTANT)
app.use((req, res, next) => {
  console.log("➡️ REQUEST:", req.method, req.url);
  next();
});

app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(express.json());

// 🔥 ROOT ROUTE (TEST)
app.get("/test", (req, res) => {
  res.send("API WORKING");
});


import connectDB from "./config/db.js";
import paymentRoutes from "./routes/payment.routes.js";

connectDB();

app.use("/api/payment", paymentRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
