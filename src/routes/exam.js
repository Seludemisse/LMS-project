import express from "express";
import { authGuard } from "../middleware/authGuard.js";

const router = express.Router();

// Admin: create exam
router.post("/", authGuard, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  const { title, subject, date, time, location, duration, status, priority } = req.body;

  try {
    const exam = await req.prisma.exam.create({
      data: {
        title, subject, date, time, location, duration,
        status, priority, createdBy: req.user.userId,
      },
    });
    const fullExam = await req.prisma.exam.findUnique({ where: { id: exam.id } });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all exams
router.get("/", authGuard, async (req, res) => {
  try {
    const exams = await req.prisma.exam.findMany();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student results
router.get("/my-results", authGuard, async (req, res) => {
  try {
    const results = await req.prisma.examResult.findMany({
      where: { userId: req.user.userId },
      include: { exam: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: all results
router.get("/results/all", authGuard, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
  const { examId, userId } = req.query;
  const where = {};
  if (examId) where.examId = Number(examId);
  if (userId) where.userId = Number(userId);

  try {
    const results = await req.prisma.examResult.findMany({
      where, include: { exam: true }, orderBy: { createdAt: "desc" }
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single exam
router.get("/:id", authGuard, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const exam = await req.prisma.exam.findUnique({
      where: { id },
      include: { results: req.user.role === "admin" ? true : false },
    });
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: update exam
router.put("/:id", authGuard, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
  const id = Number(req.params.id);
  const data = req.body;
  delete data.createdBy;
  try {
    const updated = await req.prisma.exam.update({ where: { id }, data });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: delete exam
router.delete("/:id", authGuard, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
  const id = Number(req.params.id);
  try {
    await req.prisma.examResult.deleteMany({ where: { examId: id } });
    await req.prisma.exam.delete({ where: { id } });
    res.json({ message: "Exam deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Student submit exam
router.post("/:id/submit", authGuard, async (req, res) => {
  if (req.user.role !== "user") return res.status(403).json({ message: "Only students can submit exams" });
  const examId = Number(req.params.id);
  const { score, details } = req.body;

  if (typeof score !== "number") return res.status(400).json({ message: "Score must be a number" });

  try {
    const exam = await req.prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    const result = await req.prisma.examResult.create({
      data: { examId, userId: req.user.userId, score, details: details || null },
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
