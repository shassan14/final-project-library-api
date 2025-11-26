import jwt from 'jsonwebtoken';
import prisma from '../utils/prismaClient.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const auth = async (req, res, next) => {
  try {
    const header = req.header('Authorization') || req.header('authorization');

    if (!header) {
      return res.status(401).json({
        error: { message: 'No token, authorization denied' }
      });
    }

    const token = header.replace('Bearer ', '').trim();

    if (!token) {
      return res.status(401).json({
        error: { message: 'No token, authorization denied' }
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      return res.status(401).json({
        error: { message: 'Token is not valid' }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      error: { message: 'Token is not valid' }
    });
  }
};

export default auth;
