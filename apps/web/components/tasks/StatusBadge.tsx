interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  TODO: {
    label: 'To Do',
    className: 'bg-gray-100 text-gray-700',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-blue-100 text-blue-700',
  },
  DONE: {
    label: 'Done',
    className: 'bg-green-100 text-green-700',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.TODO;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
