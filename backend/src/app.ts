import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import sweetRoutes from "./routes/sweetRoutes";

dotenv.config();

const app = express();

// ✅ CORS FIX (THIS IS THE KEY)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://sweet-shop-management-system-sooty-one.vercel.app",
      "https://sweet-shop-management-system-git-main-ankitkrg9s-projects.vercel.app",
      "https://sweet-shop-management-system-1fe18joid-ankitkrg9s-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ JSON BODY PARSER
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/sweets", sweetRoutes);

app.get("/", (req, res) => {
  res.send("Sweet Shop Backend Running");
});

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
