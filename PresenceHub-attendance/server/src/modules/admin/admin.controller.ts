// ============================================
// Admin Controller — Request/Response Handling
// ============================================

import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service.js';

// ---- Dashboard ----
export const getDashboard = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AdminService.getDashboardStats();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ---- Users ----
export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = req.query.role as string | undefined;
    const search = req.query.search as string | undefined;
    const data = await AdminService.listUsers({ role, search });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AdminService.createUser(req.body);
    res.status(201).json({ success: true, data, message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AdminService.toggleUserStatus(req.params.userId);
    res.json({ success: true, data, message: 'User status updated' });
  } catch (error) {
    next(error);
  }
};

// ---- Departments ----
export const listDepartments = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AdminService.listDepartments();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AdminService.createDepartment(req.body);
    res.status(201).json({ success: true, data, message: 'Department created successfully' });
  } catch (error) {
    next(error);
  }
};

// ---- Courses ----
export const listCourses = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AdminService.listCourses();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AdminService.createCourse(req.body);
    res.status(201).json({ success: true, data, message: 'Course created successfully' });
  } catch (error) {
    next(error);
  }
};

// ---- Sections ----
export const listSections = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AdminService.listSections();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AdminService.createSection(req.body);
    res.status(201).json({ success: true, data, message: 'Section created successfully' });
  } catch (error) {
    next(error);
  }
};

export const enrollStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AdminService.enrollStudent(req.body);
    res.status(201).json({ success: true, data, message: 'Student enrolled successfully' });
  } catch (error) {
    next(error);
  }
};

export const listEnrollments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sectionId = req.query.sectionId as string | undefined;
    const data = await AdminService.listEnrollments(sectionId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const enrollDepartmentStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sectionId, departmentId } = req.body;
    const data = await AdminService.enrollDepartmentStudents(sectionId, departmentId);
    res.json({ success: true, data, message: `${data.enrolled} students enrolled` });
  } catch (error) {
    next(error);
  }
};

export const removeEnrollment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId, sectionId } = req.params;
    await AdminService.removeEnrollment(studentId, sectionId);
    res.json({ success: true, message: 'Enrollment removed' });
  } catch (error) {
    next(error);
  }
};
