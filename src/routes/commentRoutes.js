import { Router } from 'express';
import {
  getCommentsForTask,
  createComment,
  updateComment,
  deleteComment
} from '../controllers/commentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { canEditComment } from '../middleware/commentOwnership.js';

const router = Router();

router.get('/tasks/:taskId/comments', requireAuth, getCommentsForTask);

router.post('/tasks/:taskId/comments', requireAuth, createComment);

router.put('/comments/:id', requireAuth, canEditComment, updateComment);

router.delete('/comments/:id', requireAuth, canEditComment, deleteComment);

export default router;
