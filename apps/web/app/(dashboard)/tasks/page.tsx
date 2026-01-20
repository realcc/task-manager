'use client';

import { useTasks } from '../../../hooks/useTasks';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';
import { TaskFilters, TaskCard } from '../../../components/tasks';
import { useUIStore } from '../../../stores';
import { Button } from '../../../components/ui/Button';

export default function TasksPage() {
  const { tasks, loading, hasMore, loadMore } = useTasks();
  const { openModal } = useUIStore();
  const { lastElementRef } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: loadMore,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <Button onClick={() => openModal('task-create')}>+ New Task</Button>
      </div>

      <TaskFilters />

      {tasks.length === 0 && !loading ? (
        <EmptyState onCreateTask={() => openModal('task-create')} />
      ) : (
        <div className="grid gap-4">
          {tasks.map(
            (
              task: {
                id: string;
                title: string;
                description?: string;
                status: string;
                priority: string;
                dueDate?: string;
              },
              index: number
            ) => (
              <div
                key={task.id}
                ref={index === tasks.length - 1 ? lastElementRef : null}
              >
                <TaskCard task={task} />
              </div>
            )
          )}
          {loading && <TaskListSkeleton />}
        </div>
      )}
    </div>
  );
}

function EmptyState({ onCreateTask }: { onCreateTask: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new task.
      </p>
      <div className="mt-6">
        <Button onClick={onCreateTask}>+ New Task</Button>
      </div>
    </div>
  );
}

function TaskListSkeleton() {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border bg-white p-4"
        >
          <div className="h-5 w-3/4 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
          <div className="mt-3 flex gap-2">
            <div className="h-6 w-16 rounded-full bg-gray-200" />
            <div className="h-6 w-16 rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
    </>
  );
}
