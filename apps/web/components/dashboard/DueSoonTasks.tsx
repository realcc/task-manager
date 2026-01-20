import Link from 'next/link';
import { PriorityBadge } from '../tasks/PriorityBadge';
import { formatDate, isOverdue, isDueToday } from '../../lib/utils';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
}

interface DueSoonTasksProps {
  tasks: Task[];
}

export function DueSoonTasks({ tasks }: DueSoonTasksProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Due Soon</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks due soon</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate);
            const dueToday = isDueToday(task.dueDate);

            return (
              <li key={task.id}>
                <Link
                  href={`/tasks/${task.id}`}
                  className="flex items-center justify-between rounded-md p-3 hover:bg-gray-50"
                >
                  <span className="truncate font-medium text-gray-900">{task.title}</span>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                    <span
                      className={`text-sm ${
                        overdue
                          ? 'font-medium text-red-600'
                          : dueToday
                            ? 'font-medium text-yellow-600'
                            : 'text-gray-500'
                      }`}
                    >
                      {overdue
                        ? 'Overdue'
                        : dueToday
                          ? 'Today'
                          : formatDate(task.dueDate)}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <Link
        href="/tasks?filter=due-soon"
        className="mt-4 block text-sm text-blue-600 hover:underline"
      >
        View all due soon
      </Link>
    </div>
  );
}
