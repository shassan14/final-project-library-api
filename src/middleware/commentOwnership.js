    import prisma from '../prismaClient.js';

    export const canEditComment = async (req, res, next) => {
        try {
            const commentId = Number(req.params.id);

            const comment = await prisma.comment.findUnique({
                where: { id: commentId }
            });

            if (!comment) {
                return res.status(404).json({ error: "Comment not found" });
            }
            
            if (req.user.role === 'admin') return next();
            
            if (comment.userId === req.user.id) return next();

            return res.status(403).json({ error: "You don't own this comment" });
        
        } catch (error) {
            console.error("Comment ownership error: ", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    };