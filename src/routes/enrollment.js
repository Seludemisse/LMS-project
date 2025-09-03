// src/routes/enrollment.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authGuard } from "../middleware/authGuard.js";

const router = express.Router();
const prisma = new PrismaClient();

//  Enroll in a course (any user)
router.post("/", authGuard, async (req, res) => {
  const userId = req.user.userId;
  const { courseId } = req.body;

  try {
    // Check if user already enrolled
    const existing = await prisma.enrollment.findFirst({
      where: { userId, courseId },
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "You are already enrolled in this course" });
    }

    const enrollment = await prisma.enrollment.create({
      data: { userId, courseId },
      include: { course: true },
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to enroll in course" });
  }
});

//  Get enrollments for logged-in user
router.get("/me", authGuard, async (req, res) => {
  const userId = req.user.userId;

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
    });
    res.json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch your enrollments" });
  }
});

//  Admin: get all enrollments
router.get("/", authGuard, async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const enrollments = await prisma.enrollment.findMany({
      include: { course: true, user: { select: { id: true, name: true, email: true } } },
    });
    res.json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
});
// --- Remove Enrollment (User can remove own, Admin can remove any) ---
router.delete("/:id", authGuard, async (req, res) => {
  try {
    const { id } = req.params;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    // Check ownership (user) or admin role
    if (req.user.role !== "ADMIN" && enrollment.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to delete this enrollment" });
    }

    await prisma.enrollment.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Enrollment removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove enrollment" });
  }
});

export default router;
