import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { TestUtils } from './utils/test-utils';

describe('Projects (e2e)', () => {
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

  describe('createProject', () => {
    it('should create a project', async () => {
      const mutation = `
        mutation CreateProject($input: CreateProjectInput!) {
          createProject(input: $input) {
            id
            name
            description
            taskCount
          }
        }
      `;

      const response = await testUtils.graphql(
        mutation,
        { input: { name: 'Test Project', description: 'A description' } },
        authToken,
      );

      expect(response.status).toBe(200);
      expect(response.body.data.createProject.name).toBe('Test Project');
      expect(response.body.data.createProject.taskCount).toBe(0);
    });
  });

  describe('projects query', () => {
    it('should return all user projects', async () => {
      const createMutation = `
        mutation CreateProject($input: CreateProjectInput!) {
          createProject(input: $input) { id }
        }
      `;

      await testUtils.graphql(
        createMutation,
        { input: { name: 'Project 1' } },
        authToken,
      );
      await testUtils.graphql(
        createMutation,
        { input: { name: 'Project 2' } },
        authToken,
      );

      const query = `
        query Projects {
          projects {
            id
            name
            taskCount
          }
        }
      `;

      const response = await testUtils.graphql(query, {}, authToken);

      expect(response.body.data.projects).toHaveLength(2);
    });
  });

  describe('project query', () => {
    it('should return project with tasks', async () => {
      // Create project
      const createProject = `
        mutation CreateProject($input: CreateProjectInput!) {
          createProject(input: $input) { id }
        }
      `;

      const projectResponse = await testUtils.graphql(
        createProject,
        { input: { name: 'Project With Tasks' } },
        authToken,
      );
      const projectId = projectResponse.body.data.createProject.id;

      // Create task in project
      const createTask = `
        mutation CreateTask($input: CreateTaskInput!) {
          createTask(input: $input) { id }
        }
      `;

      await testUtils.graphql(
        createTask,
        { input: { title: 'Task in Project', projectId } },
        authToken,
      );

      const query = `
        query Project($id: String!) {
          project(id: $id) {
            id
            name
            taskCount
            tasks { id title }
          }
        }
      `;

      const response = await testUtils.graphql(
        query,
        { id: projectId },
        authToken,
      );

      expect(response.body.data.project.taskCount).toBe(1);
      expect(response.body.data.project.tasks).toHaveLength(1);
    });
  });

  describe('updateProject', () => {
    it('should update a project', async () => {
      const createMutation = `
        mutation CreateProject($input: CreateProjectInput!) {
          createProject(input: $input) { id }
        }
      `;

      const createResponse = await testUtils.graphql(
        createMutation,
        { input: { name: 'Original' } },
        authToken,
      );
      const projectId = createResponse.body.data.createProject.id;

      const updateMutation = `
        mutation UpdateProject($input: UpdateProjectInput!) {
          updateProject(input: $input) { id name }
        }
      `;

      const response = await testUtils.graphql(
        updateMutation,
        { input: { id: projectId, name: 'Updated' } },
        authToken,
      );

      expect(response.body.data.updateProject.name).toBe('Updated');
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      const createMutation = `
        mutation CreateProject($input: CreateProjectInput!) {
          createProject(input: $input) { id }
        }
      `;

      const createResponse = await testUtils.graphql(
        createMutation,
        { input: { name: 'To Delete' } },
        authToken,
      );
      const projectId = createResponse.body.data.createProject.id;

      const deleteMutation = `
        mutation DeleteProject($id: String!) {
          deleteProject(id: $id) { id }
        }
      `;

      const response = await testUtils.graphql(
        deleteMutation,
        { id: projectId },
        authToken,
      );

      expect(response.body.data.deleteProject.id).toBe(projectId);
    });
  });
});
