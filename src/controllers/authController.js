import prisma from '../prismaClient.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';

export async function register(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const passwordHash = await hashPassword(password);

    const normalizedRole = role === 'admin' ? 'admin' : 'user';

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: normalizedRole
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    return res.status(201).json(user);
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await comparePassword(password, user.passwordHash);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken(user.id, user.role);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
