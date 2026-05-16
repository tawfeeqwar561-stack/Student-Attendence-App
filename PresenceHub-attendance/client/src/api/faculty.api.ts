// ============================================
// Faculty API — HTTP Client Layer
// ============================================

import api from './axios';

export const facultyApi = {
  // Dashboard
  getDashboard: () => api.get('/faculty/dashboard'),

  // Sections
  getSections: () => api.get('/faculty/sections'),
  getSectionStudents: (sectionId: string) =>
    api.get(`/faculty/sections/${sectionId}/students`),
  getExamsForSection: (sectionId: string) =>
    api.get(`/faculty/sections/${sectionId}/exams`),

  // Exams
  createExam: (data: {
    sectionId: string;
    name: string;
    type: string;
    maxMarks: number;
    date: string;
  }) => api.post('/faculty/exams', data),

  // Attendance
  markAttendance: (data: {
    sectionId: string;
    date: string;
    records: { studentId: string; status: string; remarks?: string }[];
  }) => api.post('/faculty/attendance', data),
  getAttendanceHistory: (sectionId: string, date?: string) =>
    api.get(`/faculty/attendance/${sectionId}`, { params: { date } }),

  // Marks
  uploadMarks: (data: {
    examId: string;
    records: { studentId: string; obtainedMarks: number; remarks?: string }[];
  }) => api.post('/faculty/marks', data),

  // Grades
  uploadGrades: (data: {
    sectionId: string;
    records: {
      studentId: string;
      letterGrade: string;
      gradePoints: number;
      remarks?: string;
    }[];
  }) => api.post('/faculty/grades', data),
  getGrades: (sectionId: string) => api.get(`/faculty/grades/${sectionId}`),

  // Results
  uploadResults: (data: {
    records: {
      studentId: string;
      semester: number;
      academicYear: string;
      sgpa: number;
      cgpa: number;
      totalCredits: number;
      earnedCredits: number;
    }[];
  }) => api.post('/faculty/results', data),

  // Discipline
  fileDiscipline: (data: {
    studentId: string;
    description: string;
    actionTaken: string;
    incidentDate: string;
    actionDetails?: string;
  }) => api.post('/faculty/discipline', data),
  getDisciplineRecords: () => api.get('/faculty/discipline'),

  // Fines
  assignFine: (data: {
    studentId: string;
    amount: number;
    dueDate: string;
    academicYear: string;
    semester: number;
  }) => api.post('/faculty/fines', data),
  getAssignedFines: () => api.get('/faculty/fines'),
};
