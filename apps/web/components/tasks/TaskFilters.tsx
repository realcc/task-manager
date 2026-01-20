'use client';

import { useUIStore } from '../../stores';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priority' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

export function TaskFilters() {
  const { taskFilters, setTaskFilters, clearTaskFilters } = useUIStore();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={taskFilters.status || ''}
        onChange={(e) =>
          setTaskFilters({ ...taskFilters, status: e.target.value || undefined })
        }
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={taskFilters.priority || ''}
        onChange={(e) =>
          setTaskFilters({
            ...taskFilters,
            priority: e.target.value || undefined,
          })
        }
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {PRIORITY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {Object.values(taskFilters).some(Boolean) && (
        <button
          onClick={clearTaskFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
