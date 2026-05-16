// ============================================
// Admin Service — Business Logic
// ============================================

import { prisma } from '../../config/database.js';
import { AppError } from '../../utils/AppError.js';
import { hashPassword } from '../../utils/hash.js';
import { Role } from '@prisma/client';

export const AdminService = {
  // ---- Dashboard Stats ----
  async getDashboardStats() {
    const [totalStudents, totalFaculty, totalDepartments, totalCourses, totalSections] =
      await Promise.all([
        prisma.student.count(),
        prisma.faculty.count(),
        prisma.department.count(),
        prisma.course.count(),
        prisma.section.count(),
      ]);

    // Attendance rate for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAttendance = await prisma.attendance.findMany({
      where: { date: { gte: sevenDaysAgo } },
      select: { status: true, date: true },
    });

    const totalRecords = recentAttendance.length;
    const presentCount = recentAttendance.filter(
      (a) => a.status === 'PRESENT' || a.status === 'LATE'
    ).length;
    const attendanceRate = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

    // Recent users
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Pending fees
    const pendingFees = await prisma.fee.aggregate({
      where: { status: { in: ['PENDING', 'OVERDUE'] } },
      _sum: { amount: true },
    });

    return {
      totalStudents,
      totalFaculty,
      totalDepartments,
      totalCourses,
      totalSections,
      attendanceRate,
      pendingFees: pendingFees._sum.amount || 0,
      recentUsers,
    };
  },

  // ---- Users CRUD ----
  async listUsers(filters?: { role?: string; search?: string }) {
    const where: any = {};
    if (filters?.role && filters.role !== 'ALL') {
      where.role = filters.role;
    }
    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        student: { select: { rollNumber: true, semester: true, department: { select: { name: true, code: true } } } },
        faculty: { select: { employeeId: true, designation: true, department: { select: { name: true, code: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    departmentId?: string;
    rollNumber?: string;
    semester?: number;
    employeeId?: string;
    designation?: string;
  }) {
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw AppError.conflict('User with this email already exists');

    const hashedPassword = await hashPassword(data.password);

    return prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        ...(data.role === 'STUDENT' && data.departmentId && data.rollNumber
          ? {
              student: {
                create: {
                  rollNumber: data.rollNumber,
                  departmentId: data.departmentId,
                  semester: data.semester || 1,
                },
              },
            }
          : {}),
        ...(data.role === 'FACULTY' && data.departmentId && data.employeeId
          ? {
              faculty: {
                create: {
                  employeeId: data.employeeId,
                  departmentId: data.departmentId,
                  designation: data.designation,
                },
              },
            }
          : {}),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  },

  async toggleUserStatus(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw AppError.notFound('User not found');

    return prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: { id: true, isActive: true, firstName: true, lastName: true },
    });
  },

  // ---- Departments ----
  async listDepartments() {
    return prisma.department.findMany({
      include: {
        _count: { select: { students: true, faculty: true, courses: true } },
      },
      orderBy: { name: 'asc' },
    });
  },

  async createDepartment(data: { name: string; code: string }) {
    const exists = await prisma.department.findFirst({
      where: { OR: [{ name: data.name }, { code: data.code }] },
    });
    if (exists) throw AppError.conflict('Department with this name or code already exists');

    return prisma.department.create({ data });
  },

  // ---- Courses ----
  async listCourses() {
    return prisma.course.findMany({
      include: {
        department: { select: { name: true, code: true } },
        _count: { select: { sections: true } },
      },
      orderBy: [{ semester: 'asc' }, { code: 'asc' }],
    });
  },

  async createCourse(data: {
    code: string;
    name: string;
    credits: number;
    departmentId: string;
    semester: number;
    description?: string;
  }) {
    const exists = await prisma.course.findUnique({ where: { code: data.code } });
    if (exists) throw AppError.conflict('Course with this code already exists');

    return prisma.course.create({
      data,
      include: { department: { select: { name: true, code: true } } },
    });
  },

  // ---- Sections ----
  async listSections() {
    return prisma.section.findMany({
      include: {
        course: { select: { name: true, code: true } },
        faculty: {
          include: {
            user: { select: { firstName: true, lastName: true } },
          },
        },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async createSection(data: {
    courseId: string;
    facultyId: string;
    name: string;
    academicYear: string;
    semester: number;
  }) {
    return prisma.section.create({
      data,
      include: {
        course: { select: { name: true, code: true } },
        faculty: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
    });
  },

  async enrollStudent(data: { studentId: string; sectionId: string }) {
    const exists = await prisma.enrollment.findUnique({
      where: { studentId_sectionId: { studentId: data.studentId, sectionId: data.sectionId } },
    });
    if (exists) throw AppError.conflict('Student already enrolled in this section');

    return prisma.enrollment.create({
      data,
      include: {
        student: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
    });
  },

  // ---- Enrollments ----
  async listEnrollments(sectionId?: string) {
    const where: any = {};
    if (sectionId) where.sectionId = sectionId;

    return prisma.enrollment.findMany({
      where,
      include: {
        student: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            department: { select: { name: true, code: true } },
          },
        },
        section: {
          include: {
            course: { select: { name: true, code: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async enrollDepartmentStudents(sectionId: string, departmentId: string) {
    // Get all students in this department
    const students = await prisma.student.findMany({
      where: { departmentId },
      select: { id: true },
    });

    let enrolled = 0;
    for (const student of students) {
      const exists = await prisma.enrollment.findUnique({
        where: { studentId_sectionId: { studentId: student.id, sectionId } },
      });
      if (!exists) {
        await prisma.enrollment.create({
          data: { studentId: student.id, sectionId },
        });
        enrolled++;
      }
    }

    return { enrolled, total: students.length };
  },

  async removeEnrollment(studentId: string, sectionId: string) {
    return prisma.enrollment.delete({
      where: { studentId_sectionId: { studentId, sectionId } },
    });
  },
};
