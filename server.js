// server.js
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";


// Routes
import authRoutes from "./src/routes/auth.js";
import assignmentRoutes from "./src/routes/assignment.js";
import profileRoutes from "./src/routes/profile.js";
import { authGuard } from "./src/middleware/authGuard.js";


dotenv.config();

const app = express();

//
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true,
}));

app.get("/api/me", authGuard, (req, res) => {
  res.json({ id: req.user.userId, role: req.user.role });
});

// Routes
app.use("/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/profile", profileRoutes);


// default route
app.get("/", (req, res) => {
  res.send("LMS backend is running ");
});

// EXPORT app for index.js
export default app;
