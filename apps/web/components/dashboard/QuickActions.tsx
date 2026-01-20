'use client';

import { useUIStore } from '../../stores';
import { Button } from '../ui/Button';

export function QuickActions() {
  const { openModal } = useUIStore();

  return (
    <div className="flex gap-2">
      <Button onClick={() => openModal('task-create')}>+ New Task</Button>
    </div>
  );
}
