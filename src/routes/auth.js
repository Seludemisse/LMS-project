// routes/auth.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authGuard } from "../middleware/authGuard.js";


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
// --- LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // 1. find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ error: "Invalid credentials" })

    // 2. check password
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json({ error: "Invalid credentials" })

    // 3. issue JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    // 4. send response
    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role.toUpperCase() },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Login failed" })
  }
})// --- Get current user ---
router.get("/me", authGuard, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, role: true }
    })
    if (!user) return res.status(404).json({ error: "User not found" })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" })
  }
})

// --- LOGOUT ---
router.post("/logout", (req, res) => {
  // stateless → frontend just removes token
  res.json({ message: "Logout successful" })
})



export default router



