import { z } from 'zod';

export const TaskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);
export const TaskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  status: TaskStatusSchema.default('TODO'),
  priority: TaskPrioritySchema.default('MEDIUM'),
  dueDate: z.coerce.date().optional(),
  projectId: z.string().uuid().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
  id: z.string().uuid(),
});

export type CreateTaskSchemaInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskSchemaInput = z.infer<typeof UpdateTaskSchema>;
