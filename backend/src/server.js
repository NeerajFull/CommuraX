import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { server, app } from "./lib/socket.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import meetRoutes from "./routes/meet.route.js";
import messageRoutes from "./routes/message.route.js";

import { connectDB } from "./lib/db.js";

const PORT = process.env.PORT;


const __dirname = path.resolve();

app.use(
  cors({
    origin: process.env.MODE === "production" ? "https://commurax.onrender.com/" : "http://localhost:5173",
    credentials: true, // allow frontend to send cookies
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", meetRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
