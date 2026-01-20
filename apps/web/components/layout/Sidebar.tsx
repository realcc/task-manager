'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Tasks', href: '/tasks', icon: '✓' },
  { name: 'Projects', href: '/projects', icon: '📁' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Task Manager</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full text-left text-gray-300 hover:text-white transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
