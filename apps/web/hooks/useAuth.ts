'use client';

import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../stores';

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        name
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        name
      }
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export function useAuth() {
  const router = useRouter();
  const { setAuth, clearAuth, isAuthenticated, user, isLoading } =
    useAuthStore();

  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [registerMutation, { loading: registerLoading }] =
    useMutation(REGISTER_MUTATION);
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  const login = async (email: string, password: string) => {
    const { data } = await loginMutation({
      variables: { input: { email, password } },
    });
    setAuth(data.login);
    router.push('/dashboard');
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await registerMutation({
      variables: { input: { name, email, password } },
    });
    setAuth(data.register);
    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      await logoutMutation();
    } catch {
      // Ignore logout errors
    }
    clearAuth();
    router.push('/login');
  };

  return {
    login,
    register,
    logout,
    isAuthenticated,
    user,
    isLoading: isLoading || loginLoading || registerLoading,
  };
}
