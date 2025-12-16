import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import sweetRoutes from "./routes/sweetRoutes";

dotenv.config();

const app = express();

// ✅ FINAL CORS CONFIG
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      /\.vercel\.app$/,
    ],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/sweets", sweetRoutes);

app.get("/", (req, res) => {
  res.send("Sweet Shop Backend Running");
});

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB Connected"))
  .catch(console.log);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
