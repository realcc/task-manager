import { describe, it, expect, beforeEach } from 'vitest';
import { Test } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ProjectsService } from '../projects.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { createMockPrisma, MockPrismaClient } from '../../../test/prisma.mock';

describe('ProjectsService', () => {
  let projectsService: ProjectsService;
  let prisma: MockPrismaClient;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    projectsService = module.get(ProjectsService);
  });

  describe('findAll', () => {
    it('should return all projects for user', async () => {
      const projects = [
        { id: '1', name: 'Project 1', userId: 'user-1', _count: { tasks: 5 } },
        { id: '2', name: 'Project 2', userId: 'user-1', _count: { tasks: 3 } },
      ];
      prisma.project.findMany.mockResolvedValue(projects as any);

      const result = await projectsService.findAll('user-1');

      expect(result).toHaveLength(2);
    });
  });

  describe('findById', () => {
    it('should return project with tasks for owner', async () => {
      const project = {
        id: '1',
        name: 'Project 1',
        userId: 'user-1',
        tasks: [],
        _count: { tasks: 0 },
      };
      prisma.project.findUnique.mockResolvedValue(project as any);

      const result = await projectsService.findById('1', 'user-1');

      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException for missing project', async () => {
      prisma.project.findUnique.mockResolvedValue(null);

      await expect(projectsService.findById('1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException for other user project', async () => {
      prisma.project.findUnique.mockResolvedValue({
        id: '1',
        userId: 'other-user',
      } as any);

      await expect(projectsService.findById('1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('create', () => {
    it('should create project with userId', async () => {
      const newProject = {
        id: '1',
        name: 'New Project',
        userId: 'user-1',
        _count: { tasks: 0 },
      };
      prisma.project.create.mockResolvedValue(newProject as any);

      const result = await projectsService.create('user-1', {
        name: 'New Project',
      });

      expect(result.name).toBe('New Project');
    });
  });

  describe('update', () => {
    it('should update project for owner', async () => {
      prisma.project.findUnique.mockResolvedValue({
        id: '1',
        userId: 'user-1',
        tasks: [],
        _count: { tasks: 0 },
      } as any);
      prisma.project.update.mockResolvedValue({
        id: '1',
        name: 'Updated',
        userId: 'user-1',
        _count: { tasks: 0 },
      } as any);

      const result = await projectsService.update('user-1', {
        id: '1',
        name: 'Updated',
      });

      expect(result.name).toBe('Updated');
    });
  });

  describe('delete', () => {
    it('should delete project for owner', async () => {
      prisma.project.findUnique.mockResolvedValue({
        id: '1',
        userId: 'user-1',
        tasks: [],
        _count: { tasks: 0 },
      } as any);
      prisma.project.delete.mockResolvedValue({ id: '1' } as any);

      const result = await projectsService.delete('user-1', '1');

      expect(result.id).toBe('1');
    });
  });
});
