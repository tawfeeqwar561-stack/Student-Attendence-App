// ============================================
// Faculty Store — Zustand State Management
// ============================================

import { create } from 'zustand';
import { facultyApi } from '../api/faculty.api';

export interface SectionStudent {
  studentId: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

export interface SectionExam {
  id: string;
  name: string;
  type: string;
  maxMarks: number;
  date: string;
  course?: { name: string; code: string };
}

interface FacultyState {
  dashboard: any;
  sections: any[];
  currentStudents: SectionStudent[];
  currentExams: SectionExam[];
  grades: any[];
  disciplineRecords: any[];
  fines: any[];
  isLoading: boolean;
  error: string | null;

  fetchDashboard: () => Promise<void>;
  fetchSections: () => Promise<void>;
  fetchSectionStudents: (sectionId: string) => Promise<SectionStudent[]>;
  fetchExamsForSection: (sectionId: string) => Promise<SectionExam[]>;
  createExam: (data: any) => Promise<any>;
  markAttendance: (data: any) => Promise<void>;
  getAttendanceHistory: (sectionId: string, date?: string) => Promise<any[]>;
  uploadMarks: (data: any) => Promise<void>;
  uploadGrades: (data: any) => Promise<void>;
  fetchGrades: (sectionId: string) => Promise<void>;
  uploadResults: (data: any) => Promise<void>;
  fileDiscipline: (data: any) => Promise<void>;
  fetchDisciplineRecords: () => Promise<void>;
  assignFine: (data: any) => Promise<void>;
  fetchAssignedFines: () => Promise<void>;
}

export const useFacultyStore = create<FacultyState>((set) => ({
  dashboard: null,
  sections: [],
  currentStudents: [],
  currentExams: [],
  grades: [],
  disciplineRecords: [],
  fines: [],
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await facultyApi.getDashboard();
      set({ dashboard: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch dashboard', isLoading: false });
    }
  },

  fetchSections: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await facultyApi.getSections();
      set({ sections: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch sections', isLoading: false });
    }
  },

  fetchSectionStudents: async (sectionId: string) => {
    try {
      const res = await facultyApi.getSectionStudents(sectionId);
      const students = res.data.data;
      set({ currentStudents: students });
      return students;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch students' });
      return [];
    }
  },

  fetchExamsForSection: async (sectionId: string) => {
    try {
      const res = await facultyApi.getExamsForSection(sectionId);
      const exams = res.data.data;
      set({ currentExams: exams });
      return exams;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch exams' });
      return [];
    }
  },

  createExam: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const res = await facultyApi.createExam(data);
      set({ isLoading: false });
      return res.data.data;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to create exam', isLoading: false });
      throw err;
    }
  },

  markAttendance: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      await facultyApi.markAttendance(data);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to mark attendance', isLoading: false });
      throw err;
    }
  },

  getAttendanceHistory: async (sectionId: string, date?: string) => {
    try {
      const res = await facultyApi.getAttendanceHistory(sectionId, date);
      return res.data.data;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch attendance' });
      return [];
    }
  },

  uploadMarks: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      await facultyApi.uploadMarks(data);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to upload marks', isLoading: false });
      throw err;
    }
  },

  uploadGrades: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      await facultyApi.uploadGrades(data);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to upload grades', isLoading: false });
      throw err;
    }
  },

  fetchGrades: async (sectionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await facultyApi.getGrades(sectionId);
      set({ grades: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch grades', isLoading: false });
    }
  },

  uploadResults: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      await facultyApi.uploadResults(data);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to upload results', isLoading: false });
      throw err;
    }
  },

  fileDiscipline: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      await facultyApi.fileDiscipline(data);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to file discipline record', isLoading: false });
      throw err;
    }
  },

  fetchDisciplineRecords: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await facultyApi.getDisciplineRecords();
      set({ disciplineRecords: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch records', isLoading: false });
    }
  },

  assignFine: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      await facultyApi.assignFine(data);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to assign fine', isLoading: false });
      throw err;
    }
  },

  fetchAssignedFines: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await facultyApi.getAssignedFines();
      set({ fines: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch fines', isLoading: false });
    }
  },
}));
