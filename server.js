// server.js
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Routes
import authRoutes from "./src/routes/auth.js";
import courseRoutes from "./src/routes/course.js";
import lessonRoutes from "./src/routes/lesson.js";
import enrollmentRoutes from "./src/routes/enrollment.js";

dotenv.config();

const app = express();

//
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);

// default route
app.get("/", (req, res) => {
  res.send("LMS backend is running ");
});

// EXPORT app for index.js
export default app;
