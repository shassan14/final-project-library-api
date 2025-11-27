import prisma from '../prismaClient.js';

export async function me(req, res) {
  try {
    console.log('[/users/me] req.user =', req.user);

    const { sub, id, userId } = req.user || {};
    const userIdValue = sub ?? id ?? userId;

    if (!userIdValue) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userIdValue },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (err) {
    console.error('Get current user error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
