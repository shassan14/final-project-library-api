import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getProjects);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
