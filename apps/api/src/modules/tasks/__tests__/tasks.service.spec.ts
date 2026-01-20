import { describe, it, expect, beforeEach } from 'vitest';
import { Test } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TasksService } from '../tasks.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { createMockPrisma, MockPrismaClient } from '../../../test/prisma.mock';

describe('TasksService', () => {
  let tasksService: TasksService;
  let prisma: MockPrismaClient;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module = await Test.createTestingModule({
      providers: [TasksService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    tasksService = module.get(TasksService);
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const tasks = [
        { id: '1', title: 'Task 1', userId: 'user-1' },
        { id: '2', title: 'Task 2', userId: 'user-1' },
      ];
      prisma.task.findMany.mockResolvedValue(tasks as any);

      const result = await tasksService.findAll('user-1', {
        take: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result.items).toHaveLength(2);
      expect(result.hasMore).toBe(false);
    });

    it('should indicate hasMore when more results exist', async () => {
      const tasks = Array(21).fill({ id: '1', userId: 'user-1' });
      prisma.task.findMany.mockResolvedValue(tasks as any);

      const result = await tasksService.findAll('user-1', {
        take: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result.items).toHaveLength(20);
      expect(result.hasMore).toBe(true);
    });

    it('should filter by status', async () => {
      prisma.task.findMany.mockResolvedValue([]);

      await tasksService.findAll('user-1', {
        status: 'TODO' as any,
        take: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'TODO' }),
        }),
      );
    });

    it('should filter by priority', async () => {
      prisma.task.findMany.mockResolvedValue([]);

      await tasksService.findAll('user-1', {
        priority: 'HIGH' as any,
        take: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ priority: 'HIGH' }),
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return task for owner', async () => {
      const task = { id: '1', title: 'Task 1', userId: 'user-1' };
      prisma.task.findUnique.mockResolvedValue(task as any);

      const result = await tasksService.findById('1', 'user-1');

      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException for missing task', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(tasksService.findById('1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException for other user task', async () => {
      prisma.task.findUnique.mockResolvedValue({
        id: '1',
        userId: 'other-user',
      } as any);

      await expect(tasksService.findById('1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('create', () => {
    it('should create task with userId', async () => {
      const newTask = { id: '1', title: 'New Task', userId: 'user-1' };
      prisma.task.create.mockResolvedValue(newTask as any);

      const result = await tasksService.create('user-1', { title: 'New Task' });

      expect(result.title).toBe('New Task');
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: { title: 'New Task', userId: 'user-1' },
      });
    });
  });

  describe('update', () => {
    it('should update task for owner', async () => {
      prisma.task.findUnique.mockResolvedValue({
        id: '1',
        userId: 'user-1',
      } as any);
      prisma.task.update.mockResolvedValue({
        id: '1',
        title: 'Updated',
        userId: 'user-1',
      } as any);

      const result = await tasksService.update('user-1', {
        id: '1',
        title: 'Updated',
      });

      expect(result.title).toBe('Updated');
    });
  });

  describe('delete', () => {
    it('should delete task for owner', async () => {
      prisma.task.findUnique.mockResolvedValue({
        id: '1',
        userId: 'user-1',
      } as any);
      prisma.task.delete.mockResolvedValue({ id: '1' } as any);

      const result = await tasksService.delete('user-1', '1');

      expect(result.id).toBe('1');
    });
  });
});
