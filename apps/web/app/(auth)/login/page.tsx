import Link from 'next/link';
import { LoginForm } from '../../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="space-y-8 rounded-lg bg-white p-8 shadow">
      <div>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Sign in to Task Manager
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            create a new account
          </Link>
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
