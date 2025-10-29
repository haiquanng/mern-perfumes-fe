import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../api/client';

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/login', { email, password });
          // Nếu response có user data thì dùng luôn, không cần fetchProfile
          if (response.data?.id || response.data?.user) {
            const userData = response.data.user || response.data;
            set({ user: userData, isAuthenticated: true, isLoading: false });
          } else {
            await get().fetchProfile();
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          await api.post('/register', { email, password, name });
          const loginResponse = await api.post('/login', { email, password });
          // Nếu response có user data thì dùng luôn
          if (loginResponse.data?.id || loginResponse.data?.user) {
            const userData = loginResponse.data.user || loginResponse.data;
            set({ user: userData, isAuthenticated: true, isLoading: false });
          } else {
            await get().fetchProfile();
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      fetchProfile: async () => {
        try {
          const { data } = await api.get('/profile');
          // Backend trả về user object trực tiếp: { id, name, email, isAdmin }
          set({ user: data, isAuthenticated: true, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      logout: async () => {
        try {
          await api.post('/logout');
        } catch {}
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
