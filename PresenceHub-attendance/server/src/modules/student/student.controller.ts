import { Request, Response, NextFunction } from 'express';
import { StudentService } from './student.service.js';

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await StudentService.getDashboardData(req.user!.userId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await StudentService.getAttendance(req.user!.userId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getMarks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await StudentService.getMarks(req.user!.userId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getFees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await StudentService.getFees(req.user!.userId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getResults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await StudentService.getResults(req.user!.userId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getDiscipline = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await StudentService.getDiscipline(req.user!.userId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
