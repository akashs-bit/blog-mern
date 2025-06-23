import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";
import commentRoute from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "https://blog-mern-aoc0.onrender.com",
    credentials: true,
  })
);

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/comment", commentRoute);

// Serve frontend
app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
