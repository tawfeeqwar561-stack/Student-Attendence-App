// ============================================
// Route Constants
// ============================================

export const ROUTES = {
  LOGIN: '/login',

  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_DEPARTMENTS: '/admin/departments',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_ENROLLMENTS: '/admin/enrollments',
  ADMIN_SETTINGS: '/admin/settings',

  // Faculty
  FACULTY_DASHBOARD: '/faculty',
  FACULTY_ATTENDANCE: '/faculty/attendance',
  FACULTY_MARKS: '/faculty/marks',
  FACULTY_GRADES: '/faculty/grades',
  FACULTY_RESULTS: '/faculty/results',
  FACULTY_SECTIONS: '/faculty/sections',
  FACULTY_DISCIPLINE: '/faculty/discipline',
  FACULTY_FINES: '/faculty/fines',

  // Student
  STUDENT_DASHBOARD: '/student',
  STUDENT_ATTENDANCE: '/student/attendance',
  STUDENT_MARKS: '/student/marks',
  STUDENT_FEES: '/student/fees',
  STUDENT_RESULTS: '/student/results',
  STUDENT_DISCIPLINE: '/student/discipline',
  STUDENT_PROFILE: '/student/profile',

  // Shared
  NOTIFICATIONS: '/notifications',
} as const;
