import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: ({ user, accessToken, refreshToken }) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
        }
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
        }
      },

      setLoading: (isLoading) => set({ isLoading }),

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken && typeof window !== 'undefined') {
          localStorage.setItem('accessToken', state.accessToken);
        }
        state?.setLoading(false);
      },
    }
  )
);
