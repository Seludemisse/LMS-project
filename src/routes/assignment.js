// src/routes/assignment.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authGuard, isAdmin } from '../middleware/authGuard.js';
const router = express.Router();

const prisma = new PrismaClient();

// GET /assignments
router.get('/', authGuard, async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany(); // everyone sees all assignments
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assignments', error: err.message });
  }
});

// POST /assignments
router.post('/',authGuard, async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Only admin can add assignments' });
  }

  const { title, subject, description, dueDate } = req.body;
  const userId = req.user.userId;
  const newAssignment = await prisma.assignment.create({
    data: { title, subject, description, dueDate: new Date(dueDate), userId },
  });
  res.json(newAssignment);
});


// PATCH /assignments/:id
router.patch('/:id',authGuard, async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await prisma.assignment.findUnique({ where: { id: parseInt(id) } });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    
    let updated;


    // Admins can update anything
    if (req.user.role === 'ADMIN') {
      const updateData = { ...req.body };
      if (updateData.dueDate) {updateData.dueDate = new Date(updateData.dueDate);
  }
   updated = await prisma.assignment.update({
    where: { id: parseInt(id) },
    data: updateData,
  });
}else {
    // Regular users can only toggle completion
    updated=await prisma.assignment.update({
      where: { id: parseInt(id) },
      data: {
        completed: req.body.completed,
        status: req.body.completed ? 'Completed' : 'Pending',
      },
    });
  }
  res.json(updated);

  } catch (err) {
    res.status(500).json({ message: 'Failed to update assignment', error: err.message });
  }
});
// DELETE /assignments/:id
router.delete('/:id',authGuard, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only admin can delete assignments' });
    }

    const { id } = req.params;
    const deleted = await prisma.assignment.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Assignment deleted successfully', deleted });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete assignment', error: err.message });
  }
});
// GET /assignments/meta
router.get('/meta', authGuard, async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany();
    const subjects = [...new Set(assignments.map(a => a.subject))];
    const statuses = [...new Set(assignments.map(a => a.status))];
    res.json({ subjects, statuses });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch meta', error: err.message });
  }
});
// POST /assignments/:id/submit
router.post('/:id/submit', authGuard, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body; // e.g., report text or link

    // Ensure assignment exists
    const assignment = await prisma.assignment.findUnique({ where: { id: parseInt(id) } });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Create a submission entry
    const submission = await prisma.submission.create({
      data: {
        content,
        assignmentId: assignment.id,
        userId: req.user.userId
      },
      include: { assignment: true, user: true }
    });

    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit assignment', error: err.message });
  }
});
router.get('/:id/submissions', authGuard, async (req, res) => {
  const { id } = req.params;
  const submissions = await prisma.submission.findMany({
    where: { assignmentId: parseInt(id) },
    include: { user: true }
  });
  res.json(submissions);
});


export default router;