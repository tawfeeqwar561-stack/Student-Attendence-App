// ============================================
// Navigation Configuration — Per-Role Sidebar Items
// ============================================

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardCheck,
  FileText,
  DollarSign,
  BarChart3,
  ShieldAlert,
  Bell,
  Settings,
  BookOpen,
  Building2,
  UserCircle,
  UserPlus,
} from 'lucide-react';
import { Role } from '@college-erp/shared';
import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  path: string;
  icon: React.FC<any>;
  badge?: number;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export function getNavigationForRole(role: Role): NavSection[] {
  switch (role) {
    case Role.ADMIN:
      return [
        {
          title: 'Overview',
          items: [
            { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
          ],
        },
        {
          title: 'Management',
          items: [
            { label: 'Users', path: ROUTES.ADMIN_USERS, icon: Users },
            { label: 'Departments', path: ROUTES.ADMIN_DEPARTMENTS, icon: Building2 },
            { label: 'Courses', path: ROUTES.ADMIN_COURSES, icon: BookOpen },
            { label: 'Enrollments', path: ROUTES.ADMIN_ENROLLMENTS, icon: UserPlus },
          ],
        },
        {
          title: 'System',
          items: [
            { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
            { label: 'Settings', path: ROUTES.ADMIN_SETTINGS, icon: Settings },
          ],
        },
      ];

    case Role.FACULTY:
      return [
        {
          title: 'Overview',
          items: [
            { label: 'Dashboard', path: ROUTES.FACULTY_DASHBOARD, icon: LayoutDashboard },
          ],
        },
        {
          title: 'Academic',
          items: [
            { label: 'My Sections', path: ROUTES.FACULTY_SECTIONS, icon: BookOpen },
            { label: 'Attendance', path: ROUTES.FACULTY_ATTENDANCE, icon: ClipboardCheck },
            { label: 'Marks', path: ROUTES.FACULTY_MARKS, icon: FileText },
            { label: 'Grades', path: ROUTES.FACULTY_GRADES, icon: BarChart3 },
            { label: 'Results', path: ROUTES.FACULTY_RESULTS, icon: GraduationCap },
          ],
        },
        {
          title: 'Other',
          items: [
            { label: 'Fines', path: ROUTES.FACULTY_FINES, icon: DollarSign },
            { label: 'Discipline', path: ROUTES.FACULTY_DISCIPLINE, icon: ShieldAlert },
            { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
          ],
        },
      ];

    case Role.STUDENT:
      return [
        {
          title: 'Overview',
          items: [
            { label: 'Dashboard', path: ROUTES.STUDENT_DASHBOARD, icon: LayoutDashboard },
          ],
        },
        {
          title: 'Academics',
          items: [
            { label: 'Attendance', path: ROUTES.STUDENT_ATTENDANCE, icon: ClipboardCheck },
            { label: 'Marks', path: ROUTES.STUDENT_MARKS, icon: FileText },
            { label: 'Results', path: ROUTES.STUDENT_RESULTS, icon: BarChart3 },
          ],
        },
        {
          title: 'Other',
          items: [
            { label: 'Fees', path: ROUTES.STUDENT_FEES, icon: DollarSign },
            { label: 'Discipline', path: ROUTES.STUDENT_DISCIPLINE, icon: ShieldAlert },
            { label: 'Profile', path: ROUTES.STUDENT_PROFILE, icon: UserCircle },
            { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
          ],
        },
      ];

    default:
      return [];
  }
}
