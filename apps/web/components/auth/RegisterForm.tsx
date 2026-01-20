'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useState } from 'react';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerUser, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      await registerUser(data.name, data.email, data.password);
    } catch {
      setError('Registration failed. Email may already be in use.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Input
        id="name"
        type="text"
        label="Name"
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        id="email"
        type="email"
        label="Email"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        id="password"
        type="password"
        label="Password"
        {...register('password')}
        error={errors.password?.message}
      />

      <Input
        id="confirmPassword"
        type="password"
        label="Confirm Password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
}
