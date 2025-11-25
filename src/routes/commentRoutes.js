import { Router } from 'express';
import { getCommentsForTask, createComment, updateComment, deleteComment } from '../controllers/commentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { canEditComment } from '../middleware/commentOwnership.js';

const router = Router();


router.get('/tasks/:taskId/comments', authenticate, getCommentsForTask);

router.post('/tasks/:taskId/comments', authenticate, createComment);

router.put('/comments/:id', authenticate, canEditComment, updateComment);

router.delete('/comments/:id', authenticate, canEditComment, deleteComment);

export default router;