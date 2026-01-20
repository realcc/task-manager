import Link from 'next/link';
import { StatusBadge } from '../tasks/StatusBadge';
import { formatRelativeTime } from '../../lib/utils';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  updatedAt: string;
}

interface RecentTasksProps {
  tasks: Task[];
}

export function RecentTasks({ tasks }: RecentTasksProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No recent tasks</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id}>
              <Link
                href={`/tasks/${task.id}`}
                className="flex items-center justify-between rounded-md p-3 hover:bg-gray-50"
              >
                <span className="truncate font-medium text-gray-900">{task.title}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={task.status} />
                  <span className="text-sm text-gray-500">
                    {formatRelativeTime(task.updatedAt)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link
        href="/tasks"
        className="mt-4 block text-sm text-blue-600 hover:underline"
      >
        View all tasks
      </Link>
    </div>
  );
}
