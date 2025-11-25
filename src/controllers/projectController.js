import prisma from '../prismaClient.js';

export const getProjects = async (req, res) => {
  try {
    const where = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const projects = await prisma.project.findMany({
      where,
      select: { id: true, title: true, description: true }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

export const createProject = async (req, res) => {
  const { title, description } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: { message: 'Title is required' } });
  }

  try {
    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: description || '',
        userId: req.user.id
      },
      select: { id: true, title: true, description: true }
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

export const updateProject = async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: { message: 'Invalid project id' } });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      select: { id: true, title: true, description: true, userId: true }
    });

    if (!project) {
      return res.status(404).json({ error: { message: 'Project not found' } });
    }

    const isOwner = project.userId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: { message: 'Forbidden' } });
    }

    const data = {};

    if (typeof req.body.title === 'string') {
      if (req.body.title.trim() === '') {
        return res.status(400).json({ error: { message: 'Title cannot be empty' } });
      }
      data.title = req.body.title.trim();
    }

    if (typeof req.body.description === 'string') {
      data.description = req.body.description;
    }

    const updated = await prisma.project.update({
      where: { id },
      data,
      select: { id: true, title: true, description: true }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

export const deleteProject = async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: { message: 'Invalid project id' } });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      select: { id: true, userId: true }
    });

    if (!project) {
      return res.status(404).json({ error: { message: 'Project not found' } });
    }

    const isOwner = project.userId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: { message: 'Forbidden' } });
    }

    await prisma.project.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
};
