// ============================================
// Role Gate — Only renders children if user has required role
// ============================================

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { Role } from '@college-erp/shared';
import { ROUTES } from '../../constants/routes';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallbackRoute?: string;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  children,
  allowedRoles,
  fallbackRoute,
}) => {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role as Role)) {
    // Redirect to appropriate dashboard based on role
    const redirect = fallbackRoute || getDashboardRoute(user?.role as Role);
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
};

function getDashboardRoute(role?: Role): string {
  switch (role) {
    case Role.ADMIN:
      return ROUTES.ADMIN_DASHBOARD;
    case Role.FACULTY:
      return ROUTES.FACULTY_DASHBOARD;
    case Role.STUDENT:
      return ROUTES.STUDENT_DASHBOARD;
    default:
      return ROUTES.LOGIN;
  }
}

export { getDashboardRoute };
