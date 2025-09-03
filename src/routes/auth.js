// routes/auth.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // put in .env later

// --- Signup Route ---
router.post("/signup", async (req, res) => {
  try {
    const {name, email, password, role } = req.body;

    // check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "User already exists" });

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.user.create({
      data: { name,email, password: hashed, role },
    });

    res.status(201).json({ message: "User created",
       user: { id: user.id,name:user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// --- Login Route ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    // create JWT
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login successful", token, user: { id: user.id, name: user.name, email: user.email, role: user.role },});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// --- Logout Route ---
router.post("/logout", (req, res) => {
  // Frontend should remove JWT from storage
  res.json({ message: "Logout successful" });
});

// --- Reset Password Route ---
router.post("/reset-password", async (req, res) => {
  try {
    
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and newPassword are required" });
    }

    // find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // update password
    await prisma.user.update({
      where: { email },
      data: { password: hashed },
    });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Password reset failed" });
  }
});



export default router;
