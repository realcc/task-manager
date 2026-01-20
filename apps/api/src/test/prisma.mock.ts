import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { Mock } from 'vitest';

// Use a simplified type to avoid circular type references in Prisma's AND/OR/NOT
type PrismaClientKeys = 'user' | 'task' | 'project' | 'refreshToken';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockFn = Mock<any> & {
  mockResolvedValue: (val: any) => void;
  mockRejectedValue: (val: any) => void;
};

type MockPrismaDelegate = {
  findUnique: MockFn;
  findFirst: MockFn;
  findMany: MockFn;
  create: MockFn;
  createMany: MockFn;
  update: MockFn;
  updateMany: MockFn;
  delete: MockFn;
  deleteMany: MockFn;
  count: MockFn;
  aggregate: MockFn;
  groupBy: MockFn;
  upsert: MockFn;
};

export type MockPrismaClient = {
  [K in PrismaClientKeys]: MockPrismaDelegate;
} & {
  $connect: MockFn;
  $disconnect: MockFn;
  $transaction: MockFn;
};

export const createMockPrisma = (): MockPrismaClient =>
  mockDeep<PrismaClient>() as unknown as MockPrismaClient;

export const resetMockPrisma = (mock: MockPrismaClient) =>
  mockReset(mock as unknown as DeepMockProxy<PrismaClient>);
