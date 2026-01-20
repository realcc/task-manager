import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: 'blue' | 'yellow' | 'green' | 'gray';
  onClick?: () => void;
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  green: 'bg-green-50 text-green-600',
  gray: 'bg-gray-50 text-gray-600',
};

export function StatsCard({
  title,
  value,
  icon,
  color,
  onClick,
}: StatsCardProps) {
  return (
    <div
      className={`rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-full p-3 ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
}
