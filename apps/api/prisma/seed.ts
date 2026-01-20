import { PrismaClient, TaskStatus, TaskPriority } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {
      passwordHash: hashedPassword,
    },
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      passwordHash: hashedPassword,
    },
  });

  console.log(`Created user: ${user.email}`);

  // Create projects
  const workProject = await prisma.project.upsert({
    where: { id: 'work-project-id' },
    update: {},
    create: {
      id: 'work-project-id',
      name: 'Work',
      description: 'Work-related tasks',
      color: 'blue',
      userId: user.id,
    },
  });

  const personalProject = await prisma.project.upsert({
    where: { id: 'personal-project-id' },
    update: {},
    create: {
      id: 'personal-project-id',
      name: 'Personal',
      description: 'Personal tasks and errands',
      color: 'green',
      userId: user.id,
    },
  });

  console.log(`Created projects: ${workProject.name}, ${personalProject.name}`);

  // Create sample tasks
  const tasks = [
    {
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the API endpoints',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      projectId: workProject.id,
    },
    {
      title: 'Review pull requests',
      description: 'Review and merge pending pull requests from team members',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      projectId: workProject.id,
    },
    {
      title: 'Set up CI/CD pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment',
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      projectId: workProject.id,
    },
    {
      title: 'Update dependencies',
      description: 'Update npm packages to latest versions',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      projectId: workProject.id,
    },
    {
      title: 'Grocery shopping',
      description: 'Buy groceries for the week',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      projectId: personalProject.id,
    },
    {
      title: 'Schedule dentist appointment',
      description: 'Call dentist office to schedule regular checkup',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      projectId: personalProject.id,
    },
    {
      title: 'Read TypeScript book',
      description: 'Finish reading "Effective TypeScript"',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.LOW,
      projectId: personalProject.id,
    },
    {
      title: 'Plan weekend trip',
      description: 'Research and book accommodations for weekend getaway',
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      projectId: personalProject.id,
    },
  ];

  for (const taskData of tasks) {
    await prisma.task.create({
      data: {
        ...taskData,
        userId: user.id,
      },
    });
  }

  console.log(`Created ${tasks.length} tasks`);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
