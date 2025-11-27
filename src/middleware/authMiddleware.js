// middleware/authMiddleware.js
import { verifyToken } from '../utils/jwt.js';
import prisma from '../prismaClient.js'; 

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token); 

    const user = await prisma.user.findUnique({
      where: { id: payload.sub }, 
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;         
    req.userId = user.id;
    req.userRole = user.role;

    next();
  } catch (err) {
    console.error('AUTH ERROR:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
