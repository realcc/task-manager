import { z } from 'zod';

export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  id: z.string().uuid(),
});

export type CreateProjectSchemaInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectSchemaInput = z.infer<typeof UpdateProjectSchema>;
