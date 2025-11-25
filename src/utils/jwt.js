import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export function signToken(userId, role) {
  return jwt.sign({ sub: userId, role }, SECRET, { expiresIn: '1d' });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
