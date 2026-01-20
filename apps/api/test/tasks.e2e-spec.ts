import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { TestUtils } from './utils/test-utils';

describe('Tasks (e2e)', () => {
  const testUtils = new TestUtils();
  let authToken: string;

  beforeAll(async () => {
    await testUtils.init();
  });

  afterAll(async () => {
    await testUtils.close();
  });

  beforeEach(async () => {
    await testUtils.cleanup();
    const auth = await testUtils.createTestUser();
    authToken = auth.accessToken;
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const mutation = `
        mutation CreateTask($input: CreateTaskInput!) {
          createTask(input: $input) {
            id
            title
            status
            priority
          }
        }
      `;

      const response = await testUtils.graphql(
        mutation,
        { input: { title: 'Test Task' } },
        authToken,
      );

      expect(response.status).toBe(200);
      expect(response.body.data.createTask.title).toBe('Test Task');
      expect(response.body.data.createTask.status).toBe('TODO');
      expect(response.body.data.createTask.priority).toBe('MEDIUM');
    });

    it('should create task with all fields', async () => {
      const mutation = `
        mutation CreateTask($input: CreateTaskInput!) {
          createTask(input: $input) {
            title
            description
            status
            priority
          }
        }
      `;

      const response = await testUtils.graphql(
        mutation,
        {
          input: {
            title: 'Full Task',
            description: 'A description',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
          },
        },
        authToken,
      );

      expect(response.body.data.createTask.status).toBe('IN_PROGRESS');
      expect(response.body.data.createTask.priority).toBe('HIGH');
    });

    it('should reject unauthenticated request', async () => {
      const mutation = `
        mutation CreateTask($input: CreateTaskInput!) {
          createTask(input: $input) { id }
        }
      `;

      const response = await testUtils.graphql(mutation, {
        input: { title: 'Test' },
      });

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('tasks query', () => {
    it('should return paginated tasks', async () => {
      // Create tasks first
      const createMutation = `
        mutation CreateTask($input: CreateTaskInput!) {
          createTask(input: $input) { id }
        }
      `;

      for (let i = 0; i < 5; i++) {
        await testUtils.graphql(
          createMutation,
          { input: { title: `Task ${i}` } },
          authToken,
        );
      }

      const query = `
        query Tasks($take: Int) {
          tasks(take: $take) {
            items { id title }
            hasMore
            nextCursor
          }
        }
      `;

      const response = await testUtils.graphql(query, { take: 3 }, authToken);

      expect(response.body.data.tasks.items).toHaveLength(3);
      expect(response.body.data.tasks.hasMore).toBe(true);
    });

    it('should filter by status', async () => {
      const createMutation = `
        mutation CreateTask($input: CreateTaskInput!) {
          createTask(input: $input) { id }
        }
      `;

      await testUtils.graphql(
        createMutation,
        { input: { title: 'Todo Task', status: 'TODO' } },
        authToken,
      );
      await testUtils.graphql(
        createMutation,
        { input: { title: 'Done Task', status: 'DONE' } },
        authToken,
      );

      const query = `
        query Tasks($status: TaskStatus) {
          tasks(status: $status) {
            items { title status }
          }
        }
      `;

      const response = await testUtils.graphql(
        query,
        { status: 'TODO' },
        authToken,
      );

      expect(response.body.data.tasks.items).toHaveLength(1);
      expect(response.body.data.tasks.items[0].status).toBe('TODO');
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const createMutation = `
        mutation CreateTask($input: CreateTaskInput!) {
          createTask(input: $input) { id }
        }
      `;

      const createResponse = await testUtils.graphql(
        createMutation,
        { input: { title: 'Original' } },
        authToken,
      );
      const taskId = createResponse.body.data.createTask.id;

      const updateMutation = `
        mutation UpdateTask($input: UpdateTaskInput!) {
          updateTask(input: $input) { id title status }
        }
      `;

      const response = await testUtils.graphql(
        updateMutation,
        { input: { id: taskId, title: 'Updated', status: 'DONE' } },
        authToken,
      );

      expect(response.body.data.updateTask.title).toBe('Updated');
      expect(response.body.data.updateTask.status).toBe('DONE');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const createMutation = `
        mutation CreateTask($input: CreateTaskInput!) {
          createTask(input: $input) { id }
        }
      `;

      const createResponse = await testUtils.graphql(
        createMutation,
        { input: { title: 'To Delete' } },
        authToken,
      );
      const taskId = createResponse.body.data.createTask.id;

      const deleteMutation = `
        mutation DeleteTask($id: String!) {
          deleteTask(id: $id) { id }
        }
      `;

      const response = await testUtils.graphql(
        deleteMutation,
        { id: taskId },
        authToken,
      );

      expect(response.body.data.deleteTask.id).toBe(taskId);

      // Verify it's deleted
      const query = `query Task($id: String!) { task(id: $id) { id } }`;
      const getResponse = await testUtils.graphql(
        query,
        { id: taskId },
        authToken,
      );
      expect(getResponse.body.errors).toBeDefined();
    });
  });
});
