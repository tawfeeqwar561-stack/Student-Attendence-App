// ============================================
// Database Seed Script — Full College Data
// 10 Faculty · 50 Students · 5 Departments
// ============================================

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/hash.js';

const prisma = new PrismaClient();

const COMMON_PASSWORD = 'college123'; // Same for all users

async function seed() {
  console.log('🌱 Seeding database with comprehensive data...\n');
  const hashed = await hashPassword(COMMON_PASSWORD);

  // ============ 1. ADMIN ============
  const admin = await prisma.user.upsert({
    where: { email: 'admin@college.edu' },
    update: {},
    create: { email: 'admin@college.edu', password: hashed, firstName: 'Super', lastName: 'Admin', role: 'ADMIN' },
  });
  console.log('✅ Admin: admin@college.edu');

  // ============ 2. DEPARTMENTS (5) ============
  const deptData = [
    { name: 'Computer Science & Engineering', code: 'CSE' },
    { name: 'Electronics & Communication', code: 'ECE' },
    { name: 'Mechanical Engineering', code: 'ME' },
    { name: 'Civil Engineering', code: 'CE' },
    { name: 'Information Technology', code: 'IT' },
  ];

  const depts: any[] = [];
  for (const d of deptData) {
    const dept = await prisma.department.upsert({
      where: { code: d.code },
      update: {},
      create: d,
    });
    depts.push(dept);
    console.log(`✅ Dept: ${d.code}`);
  }

  // ============ 3. FACULTY (10) ============
  const facultyData = [
    { first: 'Rajesh', last: 'Sharma', empId: 'FAC001', deptIdx: 0, desig: 'Professor' },
    { first: 'Priya', last: 'Patel', empId: 'FAC002', deptIdx: 0, desig: 'Associate Professor' },
    { first: 'Amit', last: 'Kumar', empId: 'FAC003', deptIdx: 1, desig: 'Professor' },
    { first: 'Sunita', last: 'Verma', empId: 'FAC004', deptIdx: 1, desig: 'Assistant Professor' },
    { first: 'Vikram', last: 'Singh', empId: 'FAC005', deptIdx: 2, desig: 'Professor' },
    { first: 'Neha', last: 'Gupta', empId: 'FAC006', deptIdx: 2, desig: 'Associate Professor' },
    { first: 'Suresh', last: 'Reddy', empId: 'FAC007', deptIdx: 3, desig: 'Professor' },
    { first: 'Anjali', last: 'Mishra', empId: 'FAC008', deptIdx: 3, desig: 'Assistant Professor' },
    { first: 'Manoj', last: 'Tiwari', empId: 'FAC009', deptIdx: 4, desig: 'Professor' },
    { first: 'Kavita', last: 'Joshi', empId: 'FAC010', deptIdx: 4, desig: 'Associate Professor' },
  ];

  const faculties: any[] = [];
  for (const f of facultyData) {
    const email = `${f.first.toLowerCase()}.${f.last.toLowerCase()}@college.edu`;
    // Check if faculty record already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const fac = await prisma.faculty.findUnique({ where: { userId: existingUser.id } });
      faculties.push({ user: existingUser, faculty: fac });
      console.log(`⏭️  Faculty exists: ${email}`);
      continue;
    }
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName: f.first,
        lastName: f.last,
        role: 'FACULTY',
        faculty: {
          create: {
            employeeId: f.empId,
            departmentId: depts[f.deptIdx].id,
            designation: f.desig,
          },
        },
      },
      include: { faculty: true },
    });
    faculties.push({ user, faculty: user.faculty });
    console.log(`✅ Faculty: ${email} (${f.empId})`);
  }

  // ============ 4. COURSES (15 — 3 per department) ============
  const courseData = [
    // CSE
    { code: 'CS101', name: 'Programming Fundamentals', credits: 4, deptIdx: 0, sem: 1 },
    { code: 'CS201', name: 'Data Structures & Algorithms', credits: 4, deptIdx: 0, sem: 3 },
    { code: 'CS301', name: 'Database Management Systems', credits: 4, deptIdx: 0, sem: 5 },
    // ECE
    { code: 'EC101', name: 'Basic Electronics', credits: 3, deptIdx: 1, sem: 1 },
    { code: 'EC201', name: 'Digital Logic Design', credits: 4, deptIdx: 1, sem: 3 },
    { code: 'EC301', name: 'Signal Processing', credits: 4, deptIdx: 1, sem: 5 },
    // ME
    { code: 'ME101', name: 'Engineering Mechanics', credits: 3, deptIdx: 2, sem: 1 },
    { code: 'ME201', name: 'Thermodynamics', credits: 4, deptIdx: 2, sem: 3 },
    { code: 'ME301', name: 'Machine Design', credits: 4, deptIdx: 2, sem: 5 },
    // CE
    { code: 'CE101', name: 'Engineering Drawing', credits: 3, deptIdx: 3, sem: 1 },
    { code: 'CE201', name: 'Structural Analysis', credits: 4, deptIdx: 3, sem: 3 },
    { code: 'CE301', name: 'Geotechnical Engineering', credits: 4, deptIdx: 3, sem: 5 },
    // IT
    { code: 'IT101', name: 'Intro to Computing', credits: 3, deptIdx: 4, sem: 1 },
    { code: 'IT201', name: 'Web Technologies', credits: 4, deptIdx: 4, sem: 3 },
    { code: 'IT301', name: 'Cloud Computing', credits: 4, deptIdx: 4, sem: 5 },
  ];

  const courses: any[] = [];
  for (const c of courseData) {
    const course = await prisma.course.upsert({
      where: { code: c.code },
      update: {},
      create: { code: c.code, name: c.name, credits: c.credits, departmentId: depts[c.deptIdx].id, semester: c.sem },
    });
    courses.push(course);
  }
  console.log(`✅ Courses: ${courses.length} created`);

  // ============ 5. SECTIONS (15 — one per course, faculty assigned) ============
  // Faculty assignment: 2 faculty per dept, each gets ~1-2 courses
  const sectionAssignments = [
    // CSE: FAC001, FAC002
    { courseIdx: 0, facIdx: 0 }, { courseIdx: 1, facIdx: 0 }, { courseIdx: 2, facIdx: 1 },
    // ECE: FAC003, FAC004
    { courseIdx: 3, facIdx: 2 }, { courseIdx: 4, facIdx: 2 }, { courseIdx: 5, facIdx: 3 },
    // ME: FAC005, FAC006
    { courseIdx: 6, facIdx: 4 }, { courseIdx: 7, facIdx: 4 }, { courseIdx: 8, facIdx: 5 },
    // CE: FAC007, FAC008
    { courseIdx: 9, facIdx: 6 }, { courseIdx: 10, facIdx: 6 }, { courseIdx: 11, facIdx: 7 },
    // IT: FAC009, FAC010
    { courseIdx: 12, facIdx: 8 }, { courseIdx: 13, facIdx: 8 }, { courseIdx: 14, facIdx: 9 },
  ];

  const sections: any[] = [];
  for (const sa of sectionAssignments) {
    const c = courses[sa.courseIdx];
    const section = await prisma.section.upsert({
      where: {
        courseId_name_academicYear_semester: {
          courseId: c.id,
          name: 'A',
          academicYear: '2024-25',
          semester: c.semester,
        },
      },
      update: {},
      create: {
        courseId: c.id,
        facultyId: faculties[sa.facIdx].faculty!.id,
        name: 'A',
        academicYear: '2024-25',
        semester: c.semester,
      },
    });
    sections.push(section);
  }
  console.log(`✅ Sections: ${sections.length} created`);

  // ============ 6. STUDENTS (50 — 10 per department) ============
  const firstNames = [
    'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun',
    'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
    'Ananya', 'Diya', 'Myra', 'Sara', 'Aanya',
    'Aadhya', 'Ira', 'Saanvi', 'Anika', 'Pari',
    'Rohan', 'Karan', 'Aadit', 'Mihir', 'Dev',
    'Ritika', 'Meera', 'Tara', 'Zara', 'Nisha',
    'Aryan', 'Kabir', 'Ravi', 'Shiv', 'Neil',
    'Pooja', 'Sneha', 'Prachi', 'Riya', 'Kiara',
    'Yash', 'Pranav', 'Dhruv', 'Harsh', 'Varun',
    'Simran', 'Nikita', 'Avni', 'Tanvi', 'Kriti',
  ];
  const lastNames = [
    'Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy',
    'Gupta', 'Verma', 'Joshi', 'Mishra', 'Tiwari',
    'Rao', 'Das', 'Nair', 'Pillai', 'Iyer',
    'Chopra', 'Malhotra', 'Kapoor', 'Sethi', 'Bhat',
    'Agarwal', 'Banerjee', 'Chatterjee', 'Roy', 'Dutta',
    'Shah', 'Desai', 'Mehta', 'Gandhi', 'Modi',
    'Kulkarni', 'Patil', 'Pawar', 'Shinde', 'More',
    'Pandey', 'Dubey', 'Srivastava', 'Saxena', 'Rastogi',
    'Chauhan', 'Yadav', 'Thakur', 'Rawat', 'Bisht',
    'Hegde', 'Shenoy', 'Kamath', 'Nayak', 'Gowda',
  ];

  const deptCodes = ['CSE', 'ECE', 'ME', 'CE', 'IT'];
  const students: any[] = [];

  for (let i = 0; i < 50; i++) {
    const deptIdx = Math.floor(i / 10); // 10 per department
    const studentNum = (i % 10) + 1;
    const rollNumber = `${deptCodes[deptIdx]}2024${String(studentNum).padStart(3, '0')}`;
    const firstName = firstNames[i];
    const lastName = lastNames[i];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.college.edu`;
    const semester = [1, 3, 5][i % 3]; // Distribute across semesters

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const student = await prisma.student.findUnique({ where: { userId: existingUser.id } });
      students.push({ user: existingUser, student });
      continue;
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName,
        lastName,
        role: 'STUDENT',
        student: {
          create: {
            rollNumber,
            departmentId: depts[deptIdx].id,
            semester,
          },
        },
      },
      include: { student: true },
    });
    students.push({ user, student: user.student });
  }
  console.log(`✅ Students: ${students.length} created`);

  // ============ 7. ENROLLMENTS ============
  // Each student enrolls in ALL courses from their department
  let enrollCount = 0;
  for (let i = 0; i < 50; i++) {
    const deptIdx = Math.floor(i / 10);
    const student = students[i].student!;

    // Enroll in ALL 3 courses for this department
    const deptCourseStartIdx = deptIdx * 3; // 3 courses per dept
    for (let ci = 0; ci < 3; ci++) {

      const section = sections[deptCourseStartIdx + ci];
      try {
        await prisma.enrollment.upsert({
          where: { studentId_sectionId: { studentId: student.id, sectionId: section.id } },
          update: {},
          create: { studentId: student.id, sectionId: section.id },
        });
        enrollCount++;
      } catch { /* skip duplicates */ }
    }
  }
  console.log(`✅ Enrollments: ${enrollCount} created`);

  // ============ 8. EXAMS (2 per section for active courses) ============
  const examTypes = ['QUIZ', 'MIDTERM', 'ASSIGNMENT', 'PRACTICAL'] as const;
  const createdExams: any[] = [];
  for (let si = 0; si < sections.length; si++) {
    const section = sections[si];
    const course = courses[si];

    // Quiz
    const quiz = await prisma.exam.create({
      data: {
        courseId: course.id, sectionId: section.id,
        name: `Quiz 1 - ${course.code}`, type: 'QUIZ', maxMarks: 20,
        date: new Date('2025-02-15'),
      },
    });
    createdExams.push(quiz);

    // Midterm
    const mid = await prisma.exam.create({
      data: {
        courseId: course.id, sectionId: section.id,
        name: `Midterm - ${course.code}`, type: 'MIDTERM', maxMarks: 50,
        date: new Date('2025-03-15'),
      },
    });
    createdExams.push(mid);
  }
  console.log(`✅ Exams: ${createdExams.length} created`);

  // ============ 9. MARKS (for all enrolled students) ============
  let markCount = 0;
  for (const exam of createdExams) {
    // Get enrolled students for this section
    const enrollments = await prisma.enrollment.findMany({
      where: { sectionId: exam.sectionId },
      select: { studentId: true },
    });

    for (const enrollment of enrollments) {
      const maxMarks = exam.maxMarks;
      const obtained = Math.floor(Math.random() * (maxMarks * 0.4)) + Math.floor(maxMarks * 0.5); // 50%-90%
      try {
        await prisma.mark.upsert({
          where: { studentId_examId: { studentId: enrollment.studentId, examId: exam.id } },
          update: { obtainedMarks: obtained },
          create: { studentId: enrollment.studentId, examId: exam.id, obtainedMarks: obtained },
        });
        markCount++;
      } catch { /* skip */ }
    }
  }
  console.log(`✅ Marks: ${markCount} entries`);

  // ============ 10. ATTENDANCE (last 20 weekdays) ============
  let attendCount = 0;
  const today = new Date();
  const statuses = ['PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'LATE', 'ABSENT'] as const;

  for (let si = 0; si < sections.length; si++) {
    const section = sections[si];
    const enrollments = await prisma.enrollment.findMany({
      where: { sectionId: section.id },
      select: { studentId: true },
    });

    const facultyUserId = faculties[sectionAssignments[si].facIdx].user.id;

    for (let dayOffset = 0; dayOffset < 25; dayOffset++) {
      const date = new Date(today);
      date.setDate(date.getDate() - dayOffset);
      if (date.getDay() === 0 || date.getDay() === 6) continue; // skip weekends

      for (const enrollment of enrollments) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        try {
          await prisma.attendance.upsert({
            where: { studentId_sectionId_date: { studentId: enrollment.studentId, sectionId: section.id, date } },
            update: { status },
            create: { studentId: enrollment.studentId, sectionId: section.id, date, status, markedById: facultyUserId },
          });
          attendCount++;
        } catch { /* skip */ }
      }
    }
  }
  console.log(`✅ Attendance: ${attendCount} records`);

  // ============ 11. FEES ============
  let feeCount = 0;
  for (const s of students) {
    const student = s.student!;
    const feeStatuses = ['PAID', 'PENDING', 'PAID', 'PARTIALLY_PAID'] as const;
    const st = feeStatuses[Math.floor(Math.random() * feeStatuses.length)];
    const amt = 50000;
    const paid = st === 'PAID' ? amt : st === 'PARTIALLY_PAID' ? 25000 : 0;

    await prisma.fee.create({
      data: {
        studentId: student.id, type: 'TUITION', amount: amt,
        dueDate: new Date('2025-06-30'), status: st, paidAmount: paid,
        academicYear: '2024-25', semester: student.semester,
      },
    });
    feeCount++;
  }
  console.log(`✅ Fees: ${feeCount} records`);

  // ============ 12. RESULTS ============
  let resultCount = 0;
  for (const s of students) {
    const student = s.student!;
    if (student.semester > 1) {
      const prevSem = student.semester - 2; // previous completed semester
      if (prevSem >= 1) {
        const sgpa = (7 + Math.random() * 3).toFixed(1);
        await prisma.result.upsert({
          where: { studentId_semester_academicYear: { studentId: student.id, semester: prevSem, academicYear: '2024-25' } },
          update: {},
          create: {
            studentId: student.id, semester: prevSem, academicYear: '2024-25',
            sgpa: parseFloat(sgpa), cgpa: parseFloat(sgpa),
            totalCredits: 24, earnedCredits: 22 + Math.floor(Math.random() * 3),
            isPublished: true,
          },
        });
        resultCount++;
      }
    }
  }
  console.log(`✅ Results: ${resultCount} records`);

  // ============ 13. NOTIFICATIONS ============
  const notifs = [
    { userId: admin.id, title: 'Welcome to College ERP', message: 'System is ready. All modules are operational.', type: 'INFO' as const },
  ];
  for (const n of notifs) {
    await prisma.notification.create({ data: n });
  }
  // Add a notification for first 5 students
  for (let i = 0; i < 5; i++) {
    await prisma.notification.create({
      data: { userId: students[i].user.id, title: 'Fee Reminder', message: 'Your tuition fee for Semester is pending.', type: 'WARNING' },
    });
  }
  console.log(`✅ Notifications created`);

  // ============ DONE ============
  console.log('\n🎉 Seed completed!\n');
  console.log('='.repeat(50));
  console.log('  LOGIN CREDENTIALS (password for ALL: college123)');
  console.log('='.repeat(50));
  console.log('  ADMIN:   admin@college.edu');
  console.log('');
  console.log('  FACULTY (10):');
  for (const f of facultyData) {
    const email = `${f.first.toLowerCase()}.${f.last.toLowerCase()}@college.edu`;
    console.log(`    ${f.empId}: ${email} — ${f.desig}, ${deptCodes[f.deptIdx]}`);
  }
  console.log('');
  console.log('  STUDENTS (50): [first].[last]@student.college.edu');
  console.log('  Examples:');
  for (let i = 0; i < 5; i++) {
    const s = students[i];
    console.log(`    ${s.student!.rollNumber}: ${s.user.email} — Sem ${s.student!.semester}, ${deptCodes[Math.floor(i / 10)]}`);
  }
  console.log('='.repeat(50));
}

seed()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
