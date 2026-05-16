import { create } from 'zustand';
import { studentApi } from '../api/student.api';

interface StudentState {
  dashboard: any;
  attendance: any[];
  marks: any[];
  fees: any[];
  results: any[];
  discipline: any[];
  isLoading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
  fetchAttendance: () => Promise<void>;
  fetchMarks: () => Promise<void>;
  fetchFees: () => Promise<void>;
  fetchResults: () => Promise<void>;
  fetchDiscipline: () => Promise<void>;
}

export const useStudentStore = create<StudentState>((set) => ({
  dashboard: null,
  attendance: [],
  marks: [],
  fees: [],
  results: [],
  discipline: [],
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await studentApi.getDashboard();
      set({ dashboard: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch dashboard', isLoading: false });
    }
  },

  fetchAttendance: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await studentApi.getAttendance();
      set({ attendance: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch attendance', isLoading: false });
    }
  },

  fetchMarks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await studentApi.getMarks();
      set({ marks: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch marks', isLoading: false });
    }
  },

  fetchFees: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await studentApi.getFees();
      set({ fees: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch fees', isLoading: false });
    }
  },

  fetchResults: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await studentApi.getResults();
      set({ results: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch results', isLoading: false });
    }
  },

  fetchDiscipline: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await studentApi.getDiscipline();
      set({ discipline: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch discipline records', isLoading: false });
    }
  }
}));
