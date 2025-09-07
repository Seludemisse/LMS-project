import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// Routes
import authRoutes from "./src/routes/auth.js";
import assignmentRoutes from "./src/routes/assignment.js";
import profileRoutes from "./src/routes/profile.js";
import examRoutes from "./src/routes/exam.js";
import { authGuard } from "./src/middleware/authGuard.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
}));

// attach prisma to req
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Get logged-in user info
app.get("/api/me", authGuard, (req, res) => {
  res.json({ id: req.user.userId, role: req.user.role });
});

// Routes
app.use("/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/exams", examRoutes);

// default route
app.get("/", (req, res) => {
  res.send("LMS backend is running");
});

export default app;
