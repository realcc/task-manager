interface PriorityBadgeProps {
  priority: string;
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  LOW: {
    label: 'Low',
    className: 'bg-gray-100 text-gray-700',
  },
  MEDIUM: {
    label: 'Medium',
    className: 'bg-yellow-100 text-yellow-700',
  },
  HIGH: {
    label: 'High',
    className: 'bg-red-100 text-red-700',
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || priorityConfig.MEDIUM;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
