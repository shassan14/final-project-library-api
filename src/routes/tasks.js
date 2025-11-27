// src/routes/tasks.js
import express from 'express';
import prisma from '../prismaClient.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all tasks for a project
router.get('/projects/:projectId/tasks', requireAuth, async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);

    if (Number.isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project id' });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Ownership check
    if (project.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const tasks = await prisma.task.findMany({
      where: { projectId }
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE a task for a project
router.post('/projects/:projectId/tasks', requireAuth, async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);
    const { title, status = 'todo', dueDate } = req.body;

    if (Number.isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project id' });
    }

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Ownership check
    if (project.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId
        // ⛔️ no userId here – Task model doesn’t have userId in Prisma
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE a task
router.put('/tasks/:id', requireAuth, async (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const { title, status, dueDate } = req.body;

    if (Number.isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Ownership check
    if (task.project.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const data = {};

    if (typeof title === 'string') {
      if (title.trim() === '') {
        return res.status(400).json({ error: 'Title cannot be empty' });
      }
      data.title = title.trim();
    }

    if (typeof status === 'string') {
      data.status = status;
    }

    if (typeof dueDate === 'string') {
      data.dueDate = new Date(dueDate);
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data
    });

    res.json(updated);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE a task
router.delete('/tasks/:id', requireAuth, async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Ownership check
    if (task.project.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.task.delete({ where: { id: taskId } });

    res.status(204).send();
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
