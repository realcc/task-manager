'use client';

import { useQuery, useMutation, gql } from '@apollo/client';
import { useCallback } from 'react';
import { useUIStore } from '../stores';

const GET_TASKS = gql`
  query GetTasks($status: TaskStatus, $priority: TaskPriority, $take: Int, $cursor: String) {
    tasks(status: $status, priority: $priority, take: $take, cursor: $cursor) {
      items {
        id
        title
        description
        status
        priority
        dueDate
        createdAt
        updatedAt
      }
      nextCursor
      hasMore
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      priority
      dueDate
      createdAt
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      status
      priority
      dueDate
      updatedAt
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

interface CreateTaskInput {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  projectId?: string;
}

interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  projectId?: string;
}

export function useTasks() {
  const { taskFilters } = useUIStore();

  const { data, loading, error, fetchMore, refetch } = useQuery(GET_TASKS, {
    variables: {
      status: taskFilters.status || undefined,
      priority: taskFilters.priority || undefined,
      take: 20,
    },
  });

  const [createTaskMutation, { loading: creating }] = useMutation(CREATE_TASK);
  const [updateTaskMutation, { loading: updating }] = useMutation(UPDATE_TASK);
  const [deleteTaskMutation, { loading: deleting }] = useMutation(DELETE_TASK);

  const loadMore = useCallback(() => {
    if (data?.tasks?.hasMore) {
      fetchMore({
        variables: {
          cursor: data.tasks.nextCursor,
        },
      });
    }
  }, [data, fetchMore]);

  const createTask = async (input: CreateTaskInput) => {
    const { data: result } = await createTaskMutation({
      variables: { input },
      refetchQueries: [{ query: GET_TASKS }],
    });
    return result.createTask;
  };

  const updateTask = async (id: string, input: Omit<UpdateTaskInput, 'id'>) => {
    const { data: result } = await updateTaskMutation({
      variables: { id, input },
    });
    return result.updateTask;
  };

  const deleteTask = async (id: string) => {
    await deleteTaskMutation({
      variables: { id },
      refetchQueries: [{ query: GET_TASKS }],
    });
  };

  return {
    tasks: data?.tasks?.items ?? [],
    hasMore: data?.tasks?.hasMore ?? false,
    loading,
    error,
    loadMore,
    refetch,
    createTask,
    updateTask,
    deleteTask,
    creating,
    updating,
    deleting,
  };
}
