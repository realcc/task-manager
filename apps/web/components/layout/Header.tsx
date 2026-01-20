'use client';

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:text-gray-700">
          <span className="sr-only">Notifications</span>
          🔔
        </button>
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">U</span>
        </div>
      </div>
    </header>
  );
}
