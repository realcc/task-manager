import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectInput, UpdateProjectInput } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      include: {
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        tasks: { orderBy: { createdAt: 'desc' } },
        _count: { select: { tasks: true } },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) throw new ForbiddenException();
    return project;
  }

  async create(userId: string, input: CreateProjectInput) {
    return this.prisma.project.create({
      data: { ...input, userId },
      include: { _count: { select: { tasks: true } } },
    });
  }

  async update(userId: string, input: UpdateProjectInput) {
    await this.findById(input.id, userId); // Check ownership
    const { id, ...data } = input;
    return this.prisma.project.update({
      where: { id },
      data,
      include: { _count: { select: { tasks: true } } },
    });
  }

  async delete(userId: string, id: string) {
    await this.findById(id, userId); // Check ownership
    return this.prisma.project.delete({ where: { id } });
  }
}
