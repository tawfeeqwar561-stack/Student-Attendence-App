// ============================================
// Faculty Controller — Request/Response Handling
// ============================================

import { Request, Response, NextFunction } from 'express';
import { FacultyService } from './faculty.service.js';

// ---- Dashboard ----

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await FacultyService.getDashboardData(req.user!.userId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ---- Sections ----

export const getSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await FacultyService.getSections(req.user!.userId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSectionStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await FacultyService.getSectionStudents(req.user!.userId, req.params.sectionId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ---- Exams ----

export const getExamsForSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await FacultyService.getExamsForSection(req.user!.userId, req.params.sectionId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await FacultyService.createExam(req.user!.userId, req.body);
    res.status(201).json({ success: true, data, message: 'Exam created successfully' });
  } catch (error) {
    next(error);
  }
};

// ---- Attendance ----

export const markAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await FacultyService.markAttendance(req.user!.userId, req.body);
    res.json({ success: true, data, message: 'Attendance marked successfully' });
  } catch (error) {
    next(error);
  }
};

export const getAttendanceHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const date = req.query.date as string | undefined;
    const data = await FacultyService.getAttendanceHistory(req.user!.userId, req.params.sectionId, date);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ---- Marks ----

export const uploadMarks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await FacultyService.uploadMarks(req.user!.userId, req.body);
    res.json({ success: true, data, message: 'Marks uploaded successfully' });
  } catch (error) {
    next(error);
  }
};

// ---- Grades ----

export const uploadGrades = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await FacultyService.uploadGrades(req.user!.userId, req.body);
    res.json({ success: true, data, message: 'Grades uploaded successfully' });
  } catch (error) {
    next(error);
  }
};

export const getGrades = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await FacultyService.getGrades(req.user!.userId, req.params.sectionId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ---- Results ----

export const uploadResults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await FacultyService.uploadResults(req.user!.userId, req.body);
    res.json({ success: true, data, message: 'Results uploaded successfully' });
  } catch (error) {
    next(error);
  }
};

// ---- Discipline ----

export const fileDiscipline = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await FacultyService.fileDiscipline(req.user!.userId, req.body);
    res.status(201).json({ success: true, data, message: 'Discipline record filed successfully' });
  } catch (error) {
    next(error);
  }
};

export const getDisciplineRecords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await FacultyService.getDisciplineRecords(req.user!.userId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ---- Fines ----

export const assignFine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await FacultyService.assignFine(req.user!.userId, req.body);
    res.status(201).json({ success: true, data, message: 'Fine assigned successfully' });
  } catch (error) {
    next(error);
  }
};

export const getAssignedFines = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await FacultyService.getAssignedFines(req.user!.userId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
