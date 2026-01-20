'use client';

import { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUIStore, useAuthStore } from '../../../stores';
import { Button } from '../../../components/ui/Button';

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      description
      taskCount
      createdAt
    }
  }
`;

interface Project {
  id: string;
  name: string;
  description?: string;
  taskCount: number;
  createdAt: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const { openModal } = useUIStore();
  const { clearAuth } = useAuthStore();
  const { data, loading, error } = useQuery(GET_PROJECTS);

  const isAuthError = error?.graphQLErrors?.some(
    (e) => e.extensions?.code === 'UNAUTHENTICATED'
  );

  useEffect(() => {
    if (isAuthError) {
      clearAuth();
      router.push('/login');
    }
  }, [isAuthError, clearAuth, router]);

  if (loading || isAuthError) {
    return <ProjectsGridSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Button onClick={() => openModal('project-create')}>+ New Project</Button>
      </div>

      {error ? (
        <div className="rounded-lg border bg-white p-6 text-center">
          <p className="text-gray-500">
            Unable to load projects. Please try again later.
          </p>
        </div>
      ) : data?.projects?.length === 0 ? (
        <EmptyState onCreateProject={() => openModal('project-create')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.projects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/tasks?projectId=${project.id}`}
      className="block rounded-lg border bg-white p-6 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-blue-500" />
        <h3 className="font-medium text-gray-900">{project.name}</h3>
      </div>
      {project.description && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
          {project.description}
        </p>
      )}
      <div className="mt-4 text-sm text-gray-500">
        {project.taskCount} {project.taskCount === 1 ? 'task' : 'tasks'}
      </div>
    </Link>
  );
}

function EmptyState({ onCreateProject }: { onCreateProject: () => void }) {
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
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new project.
      </p>
      <div className="mt-6">
        <Button onClick={onCreateProject}>+ New Project</Button>
      </div>
    </div>
  );
}

function ProjectsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border bg-white p-6"
        >
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-gray-200" />
            <div className="h-5 w-32 rounded bg-gray-200" />
          </div>
          <div className="mt-2 h-4 w-full rounded bg-gray-200" />
          <div className="mt-4 h-4 w-16 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
