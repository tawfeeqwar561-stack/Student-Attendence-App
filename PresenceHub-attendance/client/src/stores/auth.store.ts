// ============================================
// Auth Store — Zustand
// ============================================

import { create } from 'zustand';
import type { UserProfile } from '@college-erp/shared';

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: UserProfile, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: UserProfile) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, accessToken) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    }),

  setAccessToken: (accessToken) =>
    set({ accessToken }),

  setUser: (user) =>
    set({ user }),

  setLoading: (isLoading) =>
    set({ isLoading }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));
