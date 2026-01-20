import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(8).max(100),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
