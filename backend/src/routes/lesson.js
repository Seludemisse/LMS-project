import express from "express";
import { PrismaClient } from "@prisma/client";
import { authGuard,isAdmin } from "../middleware/authGuard.js";

const router = express.Router();
const prisma = new PrismaClient();

//  Create a lesson
router.post("/",authGuard, async (req, res) => {
  const { title, content, courseId } = req.body;

  // Only admins can create lessons
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  try {
    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        course:{
            connect:{ id: Number(courseId) } 
      },
    },
        include: { course: true},
      
    });
    res.status(201).json({message:"Lesson created",lesson});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create lesson" });
  }
});

//  Get all lessons
router.get("/", async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      include: { course: true }, // also fetch course info
    });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

// Get lessons by course
router.get("/course/:courseId", async (req, res) => {
  const { courseId } = req.params;
  try {
    const lessons = await prisma.lesson.findMany({
      where: { courseId: Number(courseId) },
      include: { course: true },
    });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lessons for course" });
  }
});
// --- Update Lesson (Admin only) ---
router.put("/:id", authGuard, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const updated = await prisma.lesson.update({
      where: { id: parseInt(id) },
      data: { title, content },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update lesson" });
  }
});

// --- Delete Lesson (Admin only) ---
router.delete("/:id", authGuard, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.lesson.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Lesson deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete lesson" });
  }
});

export default router;
