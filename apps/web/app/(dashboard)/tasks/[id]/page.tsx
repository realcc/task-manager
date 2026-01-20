'use client';

import { useQuery, useMutation, gql } from '@apollo/client';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { StatusBadge, PriorityBadge } from '../../../../components/tasks';
import { formatDate } from '../../../../lib/utils';

const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      priority
      dueDate
      createdAt
      updatedAt
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

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
  });

  const { data, loading, error } = useQuery(GET_TASK, {
    variables: { id: taskId },
    onCompleted: (data) => {
      if (data?.task) {
        setEditForm({
          title: data.task.title,
          description: data.task.description || '',
          status: data.task.status,
          priority: data.task.priority,
        });
      }
    },
  });

  const [updateTask, { loading: updating }] = useMutation(UPDATE_TASK);
  const [deleteTask, { loading: deleting }] = useMutation(DELETE_TASK);

  const handleSave = async () => {
    await updateTask({
      variables: {
        id: taskId,
        input: editForm,
      },
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask({ variables: { id: taskId } });
      router.push('/tasks');
    }
  };

  if (loading) {
    return <TaskDetailSkeleton />;
  }

  if (error || !data?.task) {
    return (
      <div className="text-center">
        <p className="text-gray-500">Task not found</p>
        <Button variant="secondary" onClick={() => router.push('/tasks')} className="mt-4">
          Back to Tasks
        </Button>
      </div>
    );
  }

  const task = data.task;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/tasks')}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Back to Tasks
        </button>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updating}>
                {updating ? 'Saving...' : 'Save'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              label="Title"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                rows={4}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  value={editForm.priority}
                  onChange={(e) =>
                    setEditForm({ ...editForm, priority: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>

            <div className="mt-4 flex items-center gap-3">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
              {task.dueDate && (
                <span className="text-sm text-gray-500">
                  Due {formatDate(task.dueDate)}
                </span>
              )}
            </div>

            {task.description && (
              <div className="mt-6">
                <h2 className="text-sm font-medium text-gray-500">Description</h2>
                <p className="mt-2 whitespace-pre-wrap text-gray-900">
                  {task.description}
                </p>
              </div>
            )}

            <div className="mt-6 border-t pt-4">
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500">Created</dt>
                  <dd className="text-gray-900">{formatDate(task.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Updated</dt>
                  <dd className="text-gray-900">{formatDate(task.updatedAt)}</dd>
                </div>
              </dl>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TaskDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-6">
      <div className="h-4 w-24 rounded bg-gray-200" />
      <div className="rounded-lg border bg-white p-6">
        <div className="h-8 w-3/4 rounded bg-gray-200" />
        <div className="mt-4 flex gap-3">
          <div className="h-6 w-16 rounded-full bg-gray-200" />
          <div className="h-6 w-16 rounded-full bg-gray-200" />
        </div>
        <div className="mt-6 space-y-2">
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
