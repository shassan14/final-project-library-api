import { PrismaClient, Role, TaskStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: Role.admin
    }
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      passwordHash: userPasswordHash,
      role: Role.user
    }
  });

  const adminProject = await prisma.project.create({
    data: {
      title: 'Admin Project',
      description: 'Sample project owned by admin.',
      userId: admin.id
    }
  });

  const userProject = await prisma.project.create({
    data: {
      title: 'User Project',
      description: 'Sample project owned by user.',
      userId: user.id
    }
  });

  const task1 = await prisma.task.create({
    data: {
      title: 'Set up database',
      status: TaskStatus.todo,
      projectId: adminProject.id
    }
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Implement authentication',
      status: TaskStatus.doing,
      projectId: adminProject.id
    }
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Write documentation',
      status: TaskStatus.done,
      projectId: userProject.id
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Remember to run migrations.',
      taskId: task1.id,
      userId: admin.id
    }
  });

  await prisma.comment.create({
    data: {
      content: 'I can help with auth.',
      taskId: task2.id,
      userId: user.id
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Docs almost done.',
      taskId: task3.id,
      userId: user.id
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
