// ============================================
// Admin Store — Zustand State Management
// ============================================

import { create } from 'zustand';
import { adminApi } from '../api/admin.api';

interface AdminState {
  dashboard: any;
  users: any[];
  departments: any[];
  courses: any[];
  sections: any[];
  isLoading: boolean;
  error: string | null;

  fetchDashboard: () => Promise<void>;
  fetchUsers: (filters?: { role?: string; search?: string }) => Promise<void>;
  createUser: (data: any) => Promise<void>;
  toggleUserStatus: (userId: string) => Promise<void>;
  fetchDepartments: () => Promise<void>;
  createDepartment: (data: any) => Promise<void>;
  fetchCourses: () => Promise<void>;
  createCourse: (data: any) => Promise<void>;
  fetchSections: () => Promise<void>;
  createSection: (data: any) => Promise<void>;
  enrollStudent: (data: any) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  dashboard: null,
  users: [],
  departments: [],
  courses: [],
  sections: [],
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await adminApi.getDashboard();
      set({ dashboard: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch dashboard', isLoading: false });
    }
  },

  fetchUsers: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const res = await adminApi.listUsers(filters);
      set({ users: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch users', isLoading: false });
    }
  },

  createUser: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.createUser(data);
      set({ isLoading: false });
      await get().fetchUsers();
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to create user', isLoading: false });
      throw err;
    }
  },

  toggleUserStatus: async (userId) => {
    try {
      await adminApi.toggleUserStatus(userId);
      await get().fetchUsers();
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to update user status' });
      throw err;
    }
  },

  fetchDepartments: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await adminApi.listDepartments();
      set({ departments: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch departments', isLoading: false });
    }
  },

  createDepartment: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.createDepartment(data);
      set({ isLoading: false });
      await get().fetchDepartments();
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to create department', isLoading: false });
      throw err;
    }
  },

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await adminApi.listCourses();
      set({ courses: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch courses', isLoading: false });
    }
  },

  createCourse: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.createCourse(data);
      set({ isLoading: false });
      await get().fetchCourses();
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to create course', isLoading: false });
      throw err;
    }
  },

  fetchSections: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await adminApi.listSections();
      set({ sections: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch sections', isLoading: false });
    }
  },

  createSection: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.createSection(data);
      set({ isLoading: false });
      await get().fetchSections();
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to create section', isLoading: false });
      throw err;
    }
  },

  enrollStudent: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.enrollStudent(data);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to enroll student', isLoading: false });
      throw err;
    }
  },
}));
