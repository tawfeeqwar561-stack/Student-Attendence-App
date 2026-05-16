import { prisma } from '../../config/database.js';
import { AppError } from '../../utils/AppError.js';

export const StudentService = {
  async getStudentIdByUserId(userId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
      select: { id: true }
    });
    if (!student) throw new AppError('Student profile not found', 404);
    return student.id;
  },

  async getDashboardData(userId: string) {
    const studentId = await this.getStudentIdByUserId(userId);

    const [attendance, fees, marks, results, notifications] = await Promise.all([
      prisma.attendance.findMany({ where: { studentId } }),
      prisma.fee.findMany({ where: { studentId } }),
      prisma.mark.findMany({
        where: { studentId },
        include: { exam: { include: { course: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.result.findFirst({ where: { studentId }, orderBy: { createdAt: 'desc' } }),
      prisma.notification.findMany({ where: { userId, isRead: false }, take: 5 })
    ]);

    const totalClasses = attendance.length;
    const presentClasses = attendance.filter((a) => a.status === 'PRESENT').length;
    const attendancePercentage = totalClasses === 0 ? 100 : Math.round((presentClasses / totalClasses) * 100);

    const pendingFees = fees
      .filter((f) => f.status === 'PENDING' || f.status === 'OVERDUE')
      .reduce((sum, f) => sum + (f.amount - f.paidAmount), 0);

    return {
      attendancePercentage,
      latestSgpa: results?.sgpa || null,
      pendingFees,
      recentMarks: marks,
      notifications
    };
  },

  async getAttendance(userId: string) {
    const studentId = await this.getStudentIdByUserId(userId);
    return prisma.attendance.findMany({
      where: { studentId },
      include: { section: { include: { course: true } } },
      orderBy: { date: 'desc' }
    });
  },

  async getMarks(userId: string) {
    const studentId = await this.getStudentIdByUserId(userId);
    return prisma.mark.findMany({
      where: { studentId },
      include: { exam: { include: { course: true } } },
      orderBy: { createdAt: 'desc' }
    });
  },

  async getFees(userId: string) {
    const studentId = await this.getStudentIdByUserId(userId);
    return prisma.fee.findMany({
      where: { studentId },
      include: { payments: true },
      orderBy: { dueDate: 'asc' }
    });
  },

  async getResults(userId: string) {
    const studentId = await this.getStudentIdByUserId(userId);
    return prisma.result.findMany({
      where: { studentId },
      orderBy: { semester: 'desc' }
    });
  },

  async getDiscipline(userId: string) {
    const studentId = await this.getStudentIdByUserId(userId);
    return prisma.disciplineRecord.findMany({
      where: { studentId },
      orderBy: { incidentDate: 'desc' }
    });
  }
};
