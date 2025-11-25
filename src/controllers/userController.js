import { prisma } from '../db.js';

export async function me(req, res) {
  try {
    const { sub } = req.user;

    const user = await prisma.user.findUnique({
      where: { id: sub },
      select: { id: true, email: true, role: true }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
