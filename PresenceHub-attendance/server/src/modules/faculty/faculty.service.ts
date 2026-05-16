// ============================================
// Faculty Service — Business Logic
// ============================================

import { prisma } from '../../config/database.js';
import { AppError } from '../../utils/AppError.js';
import { AttendanceStatus, FeeType, DisciplineAction } from '@prisma/client';

export const FacultyService = {
  // ---- Helpers ----

  async getFacultyByUserId(userId: string) {
    const faculty = await prisma.faculty.findUnique({
      where: { userId },
      select: { id: true, employeeId: true, departmentId: true },
    });
    if (!faculty) throw new AppError('Faculty profile not found', 404);
    return faculty;
  },

  async verifySectionOwnership(facultyId: string, sectionId: string) {
    const section = await prisma.section.findFirst({
      where: { id: sectionId, facultyId },
    });
    if (!section) throw new AppError('Section not found or access denied', 403);
    return section;
  },

  // ---- Dashboard ----

  async getDashboardData(userId: string) {
    const faculty = await this.getFacultyByUserId(userId);

    const sections = await prisma.section.findMany({
      where: { facultyId: faculty.id },
      include: {
        course: true,
        _count: { select: { enrollments: true, exams: true, grades: true } },
      },
    });

    const totalStudents = sections.reduce(
      (sum, sec) => sum + sec._count.enrollments,
      0
    );
    const totalExams = sections.reduce(
      (sum, sec) => sum + sec._count.exams,
      0
    );

    // Recent discipline records filed by this faculty
    const recentDiscipline = await prisma.disciplineRecord.count({
      where: { reportedById: userId },
    });

    // Fines assigned (count)
    const finesCount = await prisma.fee.count({
      where: { type: 'FINE' },
    });

    return {
      totalSections: sections.length,
      totalStudents,
      totalExams,
      recentDiscipline,
      finesAssigned: finesCount,
      sections,
    };
  },

  // ---- Sections ----

  async getSections(userId: string) {
    const faculty = await this.getFacultyByUserId(userId);
    return prisma.section.findMany({
      where: { facultyId: faculty.id },
      include: {
        course: true,
        enrollments: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
        _count: { select: { enrollments: true, exams: true } },
      },
    });
  },

  async getSectionStudents(userId: string, sectionId: string) {
    const faculty = await this.getFacultyByUserId(userId);
    await this.verifySectionOwnership(faculty.id, sectionId);

    const enrollments = await prisma.enrollment.findMany({
      where: { sectionId },
      include: {
        student: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { student: { rollNumber: 'asc' } },
    });

    return enrollments.map((e) => ({
      studentId: e.studentId,
      rollNumber: e.student.rollNumber,
      firstName: e.student.user.firstName,
      lastName: e.student.user.lastName,
      email: e.student.user.email,
      avatarUrl: e.student.user.avatarUrl,
    }));
  },

  // ---- Exams ----

  async getExamsForSection(userId: string, sectionId: string) {
    const faculty = await this.getFacultyByUserId(userId);
    await this.verifySectionOwnership(faculty.id, sectionId);

    return prisma.exam.findMany({
      where: { sectionId },
      include: { course: { select: { name: true, code: true } } },
      orderBy: { date: 'desc' },
    });
  },

  async createExam(
    userId: string,
    data: {
      sectionId: string;
      name: string;
      type: string;
      maxMarks: number;
      date: string;
    }
  ) {
    const faculty = await this.getFacultyByUserId(userId);
    const section = await this.verifySectionOwnership(faculty.id, data.sectionId);

    return prisma.exam.create({
      data: {
        courseId: section.courseId,
        sectionId: data.sectionId,
        name: data.name,
        type: data.type as any,
        maxMarks: data.maxMarks,
        date: new Date(data.date),
      },
    });
  },

  // ---- Attendance ----

  async markAttendance(
    userId: string,
    data: {
      sectionId: string;
      date: string;
      records: {
        studentId: string;
        status: AttendanceStatus;
        remarks?: string;
      }[];
    }
  ) {
    const faculty = await this.getFacultyByUserId(userId);
    await this.verifySectionOwnership(faculty.id, data.sectionId);

    const results = await Promise.all(
      data.records.map((record) =>
        prisma.attendance.upsert({
          where: {
            studentId_sectionId_date: {
              studentId: record.studentId,
              sectionId: data.sectionId,
              date: new Date(data.date),
            },
          },
          update: {
            status: record.status,
            remarks: record.remarks,
            markedById: userId,
          },
          create: {
            studentId: record.studentId,
            sectionId: data.sectionId,
            date: new Date(data.date),
            status: record.status,
            remarks: record.remarks,
            markedById: userId,
          },
        })
      )
    );

    return results;
  },

  async getAttendanceHistory(
    userId: string,
    sectionId: string,
    date?: string
  ) {
    const faculty = await this.getFacultyByUserId(userId);
    await this.verifySectionOwnership(faculty.id, sectionId);

    const where: any = { sectionId };
    if (date) {
      where.date = new Date(date);
    }

    return prisma.attendance.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: [{ date: 'desc' }, { student: { rollNumber: 'asc' } }],
    });
  },

  // ---- Marks ----

  async uploadMarks(
    userId: string,
    data: {
      examId: string;
      records: {
        studentId: string;
        obtainedMarks: number;
        remarks?: string;
      }[];
    }
  ) {
    const faculty = await this.getFacultyByUserId(userId);

    // Verify faculty owns the section the exam belongs to
    const exam = await prisma.exam.findFirst({
      where: { id: data.examId, section: { facultyId: faculty.id } },
    });
    if (!exam) throw new AppError('Exam not found or access denied', 403);

    // Validate marks don't exceed max
    for (const record of data.records) {
      if (record.obtainedMarks > exam.maxMarks) {
        throw new AppError(
          `Marks for student ${record.studentId} exceed max marks (${exam.maxMarks})`,
          400
        );
      }
    }

    const results = await Promise.all(
      data.records.map((record) =>
        prisma.mark.upsert({
          where: {
            studentId_examId: {
              studentId: record.studentId,
              examId: data.examId,
            },
          },
          update: {
            obtainedMarks: record.obtainedMarks,
            remarks: record.remarks,
          },
          create: {
            studentId: record.studentId,
            examId: data.examId,
            obtainedMarks: record.obtainedMarks,
            remarks: record.remarks,
          },
        })
      )
    );

    return results;
  },

  // ---- Grades ----

  async uploadGrades(
    userId: string,
    data: {
      sectionId: string;
      records: {
        studentId: string;
        letterGrade: string;
        gradePoints: number;
        remarks?: string;
      }[];
    }
  ) {
    const faculty = await this.getFacultyByUserId(userId);
    await this.verifySectionOwnership(faculty.id, data.sectionId);

    const results = await Promise.all(
      data.records.map((record) =>
        prisma.grade.upsert({
          where: {
            studentId_sectionId: {
              studentId: record.studentId,
              sectionId: data.sectionId,
            },
          },
          update: {
            letterGrade: record.letterGrade,
            gradePoints: record.gradePoints,
            remarks: record.remarks,
          },
          create: {
            studentId: record.studentId,
            sectionId: data.sectionId,
            letterGrade: record.letterGrade,
            gradePoints: record.gradePoints,
            remarks: record.remarks,
          },
        })
      )
    );

    return results;
  },

  async getGrades(userId: string, sectionId: string) {
    const faculty = await this.getFacultyByUserId(userId);
    await this.verifySectionOwnership(faculty.id, sectionId);

    return prisma.grade.findMany({
      where: { sectionId },
      include: {
        student: {
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: { student: { rollNumber: 'asc' } },
    });
  },

  // ---- Results ----

  async uploadResults(
    userId: string,
    data: {
      records: {
        studentId: string;
        semester: number;
        academicYear: string;
        sgpa: number;
        cgpa: number;
        totalCredits: number;
        earnedCredits: number;
      }[];
    }
  ) {
    // Verify faculty exists
    await this.getFacultyByUserId(userId);

    const results = await Promise.all(
      data.records.map((record) =>
        prisma.result.upsert({
          where: {
            studentId_semester_academicYear: {
              studentId: record.studentId,
              semester: record.semester,
              academicYear: record.academicYear,
            },
          },
          update: {
            sgpa: record.sgpa,
            cgpa: record.cgpa,
            totalCredits: record.totalCredits,
            earnedCredits: record.earnedCredits,
          },
          create: {
            studentId: record.studentId,
            semester: record.semester,
            academicYear: record.academicYear,
            sgpa: record.sgpa,
            cgpa: record.cgpa,
            totalCredits: record.totalCredits,
            earnedCredits: record.earnedCredits,
            isPublished: false,
          },
        })
      )
    );

    return results;
  },

  // ---- Discipline ----

  async fileDiscipline(
    userId: string,
    data: {
      studentId: string;
      description: string;
      actionTaken: DisciplineAction;
      incidentDate: string;
      actionDetails?: string;
    }
  ) {
    return prisma.disciplineRecord.create({
      data: {
        studentId: data.studentId,
        reportedById: userId,
        description: data.description,
        actionTaken: data.actionTaken,
        incidentDate: new Date(data.incidentDate),
        actionDetails: data.actionDetails,
        isResolved: false,
      },
    });
  },

  async getDisciplineRecords(userId: string) {
    return prisma.disciplineRecord.findMany({
      where: { reportedById: userId },
      include: {
        student: {
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // ---- Fines ----

  async assignFine(
    userId: string,
    data: {
      studentId: string;
      amount: number;
      dueDate: string;
      academicYear: string;
      semester: number;
    }
  ) {
    // Verify faculty exists
    await this.getFacultyByUserId(userId);

    return prisma.fee.create({
      data: {
        studentId: data.studentId,
        type: 'FINE',
        amount: data.amount,
        dueDate: new Date(data.dueDate),
        academicYear: data.academicYear,
        semester: data.semester,
        status: 'PENDING',
      },
    });
  },

  async getAssignedFines(_userId: string) {
    return prisma.fee.findMany({
      where: { type: 'FINE' },
      include: {
        student: {
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};
