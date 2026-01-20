import Link from 'next/link';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { formatDate } from '../../lib/utils';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
}

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <Link href={`/tasks/${task.id}`} className="flex-1">
          <h3 className="font-medium text-gray-900 hover:text-blue-600">
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
              {task.description}
            </p>
          )}
        </Link>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span className="text-sm text-gray-500">
            Due {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}
