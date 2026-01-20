import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskInput, UpdateTaskInput, TasksArgs } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, args: TasksArgs) {
    const {
      status,
      priority,
      projectId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      cursor,
      take = 20,
    } = args;

    const where = {
      userId,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(projectId && { projectId }),
    };

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      take: take + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });

    const hasMore = tasks.length > take;
    const items = hasMore ? tasks.slice(0, -1) : tasks;

    return {
      items,
      nextCursor: hasMore ? items[items.length - 1]?.id : null,
      hasMore,
    };
  }

  async findById(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException();
    return task;
  }

  async create(userId: string, input: CreateTaskInput) {
    return this.prisma.task.create({
      data: { ...input, userId },
    });
  }

  async update(userId: string, input: UpdateTaskInput) {
    await this.findById(input.id, userId); // Check ownership
    const { id, ...data } = input;
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async delete(userId: string, id: string) {
    await this.findById(id, userId); // Check ownership
    return this.prisma.task.delete({ where: { id } });
  }
}
