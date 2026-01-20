import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { TestUtils } from './utils/test-utils';

describe('Auth (e2e)', () => {
  const testUtils = new TestUtils();

  beforeAll(async () => {
    await testUtils.init();
  });

  afterAll(async () => {
    await testUtils.close();
  });

  beforeEach(async () => {
    await testUtils.cleanup();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mutation = `
        mutation Register($input: RegisterInput!) {
          register(input: $input) {
            accessToken
            user { email name }
          }
        }
      `;

      const response = await testUtils.graphql(mutation, {
        input: {
          email: 'new@test.com',
          password: 'password123',
          name: 'New User',
        },
      });

      expect(response.status).toBe(200);
      expect(response.body.data.register.accessToken).toBeDefined();
      expect(response.body.data.register.user.email).toBe('new@test.com');
    });

    it('should reject duplicate email', async () => {
      await testUtils.createTestUser('dup@test.com');

      const mutation = `
        mutation Register($input: RegisterInput!) {
          register(input: $input) {
            accessToken
          }
        }
      `;

      const response = await testUtils.graphql(mutation, {
        input: {
          email: 'dup@test.com',
          password: 'password123',
          name: 'Duplicate',
        },
      });

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      await testUtils.createTestUser('login@test.com', 'password123');

      const mutation = `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            accessToken
            user { email }
          }
        }
      `;

      const response = await testUtils.graphql(mutation, {
        input: { email: 'login@test.com', password: 'password123' },
      });

      expect(response.status).toBe(200);
      expect(response.body.data.login.accessToken).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const mutation = `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            accessToken
          }
        }
      `;

      const response = await testUtils.graphql(mutation, {
        input: { email: 'wrong@test.com', password: 'wrong' },
      });

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('me query', () => {
    it('should return current user when authenticated', async () => {
      const auth = await testUtils.createTestUser();

      const query = `
        query Me {
          me { id email name }
        }
      `;

      const response = await testUtils.graphql(query, {}, auth.accessToken);

      expect(response.status).toBe(200);
      expect(response.body.data.me.email).toBe('test@test.com');
    });

    it('should reject unauthenticated request', async () => {
      const query = `query Me { me { id } }`;

      const response = await testUtils.graphql(query);

      expect(response.body.errors).toBeDefined();
    });
  });
});
