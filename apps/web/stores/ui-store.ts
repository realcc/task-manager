import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  activeModal: string | null;
  modalData: unknown;
  openModal: (modal: string, data?: unknown) => void;
  closeModal: () => void;

  taskFilters: {
    status?: string;
    priority?: string;
    projectId?: string;
  };
  setTaskFilters: (filters: UIState['taskFilters']) => void;
  clearTaskFilters: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      theme: 'system',
      setTheme: (theme) => set({ theme }),

      activeModal: null,
      modalData: null,
      openModal: (modal, data) => set({ activeModal: modal, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: null }),

      taskFilters: {},
      setTaskFilters: (filters) => set({ taskFilters: filters }),
      clearTaskFilters: () => set({ taskFilters: {} }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
