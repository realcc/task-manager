import Link from 'next/link';
import { RegisterForm } from '../../../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="space-y-8 rounded-lg bg-white p-8 shadow">
      <div>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
