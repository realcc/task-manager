'use client';

import { useQuery, useMutation, gql } from '@apollo/client';

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      description
      color
      taskCount
      createdAt
    }
  }
`;

const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      description
      color
      createdAt
    }
  }
`;

const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      name
      description
      color
      updatedAt
    }
  }
`;

const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`;

interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
}

interface UpdateProjectInput {
  name?: string;
  description?: string;
  color?: string;
}

export function useProjects() {
  const { data, loading, error, refetch } = useQuery(GET_PROJECTS);

  const [createProjectMutation, { loading: creating }] =
    useMutation(CREATE_PROJECT);
  const [updateProjectMutation, { loading: updating }] =
    useMutation(UPDATE_PROJECT);
  const [deleteProjectMutation, { loading: deleting }] =
    useMutation(DELETE_PROJECT);

  const createProject = async (input: CreateProjectInput) => {
    const { data: result } = await createProjectMutation({
      variables: { input },
      refetchQueries: [{ query: GET_PROJECTS }],
    });
    return result.createProject;
  };

  const updateProject = async (id: string, input: UpdateProjectInput) => {
    const { data: result } = await updateProjectMutation({
      variables: { id, input },
    });
    return result.updateProject;
  };

  const deleteProject = async (id: string) => {
    await deleteProjectMutation({
      variables: { id },
      refetchQueries: [{ query: GET_PROJECTS }],
    });
  };

  return {
    projects: data?.projects ?? [],
    loading,
    error,
    refetch,
    createProject,
    updateProject,
    deleteProject,
    creating,
    updating,
    deleting,
  };
}
