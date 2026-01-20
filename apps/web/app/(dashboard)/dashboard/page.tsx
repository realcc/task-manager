'use client';

import { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import {
  StatsCard,
  RecentTasks,
  DueSoonTasks,
  QuickActions,
} from '../../../components/dashboard';
import { useUIStore, useAuthStore } from '../../../stores';

const DASHBOARD_QUERY = gql`
  query DashboardData {
    tasks(take: 10) {
      items {
        id
        title
        status
        priority
        dueDate
        updatedAt
      }
    }
  }
`;

export default function DashboardPage() {
  const router = useRouter();
  const { setTaskFilters } = useUIStore();
  const { clearAuth } = useAuthStore();
  const { data, loading, error } = useQuery(DASHBOARD_QUERY);

  const isAuthError = error?.graphQLErrors?.some(
    (e) => e.extensions?.code === 'UNAUTHENTICATED'
  );

  useEffect(() => {
    if (isAuthError) {
      clearAuth();
      router.push('/login');
    }
  }, [isAuthError, clearAuth, router]);

  const handleStatClick = (status?: string) => {
    setTaskFilters({ status });
    router.push('/tasks');
  };

  if (loading || isAuthError) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <QuickActions />
        </div>
        <div className="rounded-lg border bg-white p-6 text-center">
          <p className="text-gray-500">
            Unable to load dashboard data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const tasks = data?.tasks?.items || [];

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t: { status: string }) => t.status === 'TODO').length,
    inProgress: tasks.filter((t: { status: string }) => t.status === 'IN_PROGRESS').length,
    done: tasks.filter((t: { status: string }) => t.status === 'DONE').length,
  };

  const dueSoonTasks = tasks
    .filter((t: { dueDate: string | null }) => t.dueDate)
    .slice(0, 5);
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Tasks"
          value={taskStats.total}
          icon={<ListIcon />}
          color="gray"
          onClick={() => handleStatClick()}
        />
        <StatsCard
          title="To Do"
          value={taskStats.todo}
          icon={<CircleIcon />}
          color="blue"
          onClick={() => handleStatClick('TODO')}
        />
        <StatsCard
          title="In Progress"
          value={taskStats.inProgress}
          icon={<ClockIcon />}
          color="yellow"
          onClick={() => handleStatClick('IN_PROGRESS')}
        />
        <StatsCard
          title="Done"
          value={taskStats.done}
          icon={<CheckIcon />}
          color="green"
          onClick={() => handleStatClick('DONE')}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DueSoonTasks tasks={dueSoonTasks} />
        <RecentTasks tasks={recentTasks} />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 rounded bg-gray-200" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-lg bg-gray-200" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-lg bg-gray-200" />
        <div className="h-64 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

function ListIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 10h16M4 14h16M4 18h16"
      />
    </svg>
  );
}

function CircleIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
