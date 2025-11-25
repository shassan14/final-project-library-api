const express = require('express');
const router = express.Router();
const { Task, Project } = require('../models');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Get all tasks for a project
router.get('/projects/:projectId/tasks', auth, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findOne({
      where: { id: projectId },
      include: [{
        model: Task,
        as: 'tasks'
      }]
    });

    if (!project) {
      return res.status(404).json({
        error: { message: 'Project not found' }
      });
    }

    if (project.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: { message: 'Access denied' }
      });
    }

    res.json(project.tasks || []);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      error: { message: 'Server error' }
    });
  }
});

// Create a new task
router.post('/projects/:projectId/tasks', [
  auth,
  check('title', 'Task title is required').notEmpty(),
  check('status', 'Status must be one of: todo, doing, done').optional().isIn(['todo', 'doing', 'done']),
  check('dueDate', 'Due date must be a valid future date').optional().isDate()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: { 
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const { projectId } = req.params;
    const { title, status = 'todo', dueDate } = req.body;

    const project = await Project.findOne({ where: { id: projectId } });
    
    if (!project) {
      return res.status(404).json({
        error: { message: 'Project not found' }
      });
    }

    if (project.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: { message: 'Access denied' }
      });
    }

    if (dueDate && new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        error: { message: 'Due date cannot be in the past' }
      });
    }

    const task = await Task.create({
      title,
      status,
      dueDate,
      projectId,
      userId: req.user.id
    });

    res.status(201).json({
      id: task.id,
      title: task.title,
      status: task.status,
      dueDate: task.dueDate
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      error: { message: 'Server error' }
    });
  }
});

// Update a task
router.put('/tasks/:id', [
  auth,
  check('status', 'Status must be one of: todo, doing, done').optional().isIn(['todo', 'doing', 'done']),
  check('dueDate', 'Due date must be a valid future date').optional().isDate()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: { 
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const { id } = req.params;
    const { title, status, dueDate } = req.body;

    const task = await Task.findOne({
      where: { id },
      include: [{
        model: Project,
        as: 'project'
      }]
    });

    if (!task) {
      return res.status(404).json({
        error: { message: 'Task not found' }
      });
    }

    if (task.project.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: { message: 'Access denied' }
      });
    }

    if (dueDate && new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        error: { message: 'Due date cannot be in the past' }
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    await task.update(updateData);

    res.json({
      id: task.id,
      title: task.title,
      status: task.status,
      dueDate: task.dueDate
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      error: { message: 'Server error' }
    });
  }
});

// Delete a task
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: { id },
      include: [{
        model: Project,
        as: 'project'
      }]
    });

    if (!task) {
      return res.status(404).json({
        error: { message: 'Task not found' }
      });
    }

    if (task.project.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: { message: 'Access denied' }
      });
    }

    await task.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      error: { message: 'Server error' }
    });
  }
});

module.exports = router;