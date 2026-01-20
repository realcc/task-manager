export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isOverdue(dueDate: Date | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

export function generateId(): string {
  return crypto.randomUUID();
}
