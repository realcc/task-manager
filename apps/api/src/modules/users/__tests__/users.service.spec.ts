import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { createMockPrisma, MockPrismaClient } from '../../../test/prisma.mock';
import * as bcrypt from 'bcrypt';

vi.mock('bcrypt');

describe('UsersService', () => {
  let usersService: UsersService;
  let prisma: MockPrismaClient;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    usersService = module.get(UsersService);
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const user = { id: '1', email: 'test@test.com', name: 'Test' };
      prisma.user.findUnique.mockResolvedValue(user as any);

      const result = await usersService.findById('1');

      expect(result?.email).toBe('test@test.com');
    });

    it('should return null for non-existent user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await usersService.findById('1');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const user = { id: '1', email: 'test@test.com', name: 'Test' };
      prisma.user.findUnique.mockResolvedValue(user as any);

      const result = await usersService.findByEmail('test@test.com');

      expect(result?.id).toBe('1');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updatedUser = { id: '1', email: 'test@test.com', name: 'Updated' };
      prisma.user.update.mockResolvedValue(updatedUser as any);

      const result = await usersService.updateProfile('1', { name: 'Updated' });

      expect(result.name).toBe('Updated');
    });
  });

  describe('changePassword', () => {
    it('should change password with valid current password', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        passwordHash: 'old-hash',
      } as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(bcrypt.hash).mockResolvedValue('new-hash' as never);
      prisma.user.update.mockResolvedValue({ id: '1' } as any);

      const result = await usersService.changePassword('1', {
        currentPassword: 'old',
        newPassword: 'new-password',
      });

      expect(result.id).toBe('1');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { passwordHash: 'new-hash' },
      });
    });

    it('should throw BadRequestException for wrong current password', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        passwordHash: 'hash',
      } as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        usersService.changePassword('1', {
          currentPassword: 'wrong',
          newPassword: 'new-password',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for non-existent user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        usersService.changePassword('1', {
          currentPassword: 'old',
          newPassword: 'new',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
