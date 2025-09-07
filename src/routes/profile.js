import express from "express";
import { PrismaClient } from "@prisma/client";
import { authGuard } from "../middleware/authGuard.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get current user profile
router.get("/", authGuard, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        major: true,
        year: true,
        studentId: true,
        bio: true,
        address: true,
        dateOfBirth: true,
      },
    });

    if (!user) return res.status(404).json({ error: "Profile not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update current user profile
router.put("/", authGuard, async (req, res) => {
  try {
    const data = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        ...data,
      },
    });
    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
