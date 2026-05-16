// ============================================
// Admin API — HTTP Client Layer
// ============================================

import api from './axios';

export const adminApi = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),

  // Users
  listUsers: (params?: { role?: string; search?: string }) =>
    api.get('/admin/users', { params }),
  createUser: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    departmentId?: string;
    rollNumber?: string;
    semester?: number;
    employeeId?: string;
    designation?: string;
  }) => api.post('/admin/users', data),
  toggleUserStatus: (userId: string) =>
    api.patch(`/admin/users/${userId}/toggle-status`),

  // Departments
  listDepartments: () => api.get('/admin/departments'),
  createDepartment: (data: { name: string; code: string }) =>
    api.post('/admin/departments', data),

  // Courses
  listCourses: () => api.get('/admin/courses'),
  createCourse: (data: {
    code: string;
    name: string;
    credits: number;
    departmentId: string;
    semester: number;
    description?: string;
  }) => api.post('/admin/courses', data),

  // Sections
  listSections: () => api.get('/admin/sections'),
  createSection: (data: {
    courseId: string;
    facultyId: string;
    name: string;
    academicYear: string;
    semester: number;
  }) => api.post('/admin/sections', data),
  enrollStudent: (data: { studentId: string; sectionId: string }) =>
    api.post('/admin/sections/enroll', data),

  // Enrollments
  listEnrollments: (sectionId?: string) =>
    api.get('/admin/enrollments', { params: sectionId ? { sectionId } : {} }),
  enrollDepartmentStudents: (data: { sectionId: string; departmentId: string }) =>
    api.post('/admin/enrollments/bulk', data),
  removeEnrollment: (studentId: string, sectionId: string) =>
    api.delete(`/admin/enrollments/${studentId}/${sectionId}`),
};
