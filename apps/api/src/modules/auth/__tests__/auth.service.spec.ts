import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { createMockPrisma, MockPrismaClient } from '../../../test/prisma.mock';
import * as bcrypt from 'bcrypt';

vi.mock('bcrypt');
vi.mock('uuid', () => ({ v4: () => 'mock-uuid' }));

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: MockPrismaClient;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: { sign: vi.fn(() => 'mock-token') } },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  describe('register', () => {
    it('should create user and return tokens', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        name: 'Test',
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);
      prisma.refreshToken.create.mockResolvedValue({
        id: '1',
        token: 'mock-uuid',
        userId: '1',
        expiresAt: new Date(),
        createdAt: new Date(),
      });
      vi.mocked(bcrypt.hash).mockResolvedValue('hash' as never);

      const result = await authService.register({
        email: 'test@test.com',
        password: 'password123',
        name: 'Test',
      });

      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBe('mock-uuid');
      expect(result.user.email).toBe('test@test.com');
    });

    it('should throw ConflictException for existing email', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: '1' } as any);

      await expect(
        authService.register({
          email: 'test@test.com',
          password: 'password123',
          name: 'Test',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        name: 'Test',
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      prisma.refreshToken.create.mockResolvedValue({
        id: '1',
        token: 'mock-uuid',
        userId: '1',
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      const result = await authService.login({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(result.accessToken).toBe('mock-token');
      expect(result.user.id).toBe('1');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        passwordHash: 'hash',
      } as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        authService.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should delete all refresh tokens for user', async () => {
      prisma.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

      const result = await authService.logout('user-id');

      expect(result).toBe(true);
      expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-id' },
      });
    });
  });
});
