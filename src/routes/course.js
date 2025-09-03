// routes/course.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authGuard,isAdmin } from "../middleware/authGuard.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET all courses (public)
router.get("/", async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { lessons: true }, // optional: include lessons
    });
    const response = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      createdAt: course.createdAt,
      lessonsCount: course.lessons.length,
      lessons: course.lessons
    }));

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// GET single course by ID (public)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: { lessons: true },
    });
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

// POST create a course (ADMIN only)
router.post("/", authGuard, async (req, res) => {
  const { title, description } = req.body;

    // Validate input
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  // Check if user is admin
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ error: "Forbidden: Admins only" });

  try {
    const course = await prisma.course.create({
      data: { title, description },
    });
    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create course" });
  }
});

// --- Update Course (Admin only) ---
router.put("/:id", authGuard, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const updated = await prisma.course.update({
      where: { id: parseInt(id) },
      data: { title, description },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update course" });
  }
});

// --- Delete Course (Admin only) ---
router.delete("/:id", authGuard, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.course.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Course deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete course" });
  }
});


export default router;
