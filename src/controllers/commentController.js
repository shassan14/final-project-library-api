import prisma from '../prismaClient.js';


export const getCommentsForTask = async (req, res) => {
    try {
        const { taskId } = req.params

        const comments = await prisma.comment.findMany({
            where: { taskId: Number(taskId) },
            include: { 
                user: { 
                    select: { id: true, email: true } 
                } 
            }
        });
       
        return res.status(200).json(comments);
    } catch (error) {
         console.error("Get comments error: ", error);
         res.status(500).json({ error:"Internal server error" });
    }
};


export const createComment = async (req, res) => {
    try {
        const { taskId } = req.params
        const { content } = req.body

        const newComment = await prisma.comment.create({
            data: {
                content,
                taskId: Number(taskId),
                userId: req.user.id
            }
        });

        return res.status(201).json(newComment);
    } catch (error) {
        console.error("Create comment error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
    

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const updatedComment = await prisma.comment.update({
            where: { id: Number(id) },
            data: { content }
        });

        return res.status(200).json(updatedComment);
    } catch (error) {
        console.error("Update comment error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
         await prisma.comment.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({ message: "Comment deleted successfully" });
   
    } catch (error) {
        console.error("Delete comment error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
