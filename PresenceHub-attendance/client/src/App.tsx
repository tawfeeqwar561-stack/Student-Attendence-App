// ============================================
// App — Root Router with Role-Based Routing
// ============================================

import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './stores/auth.store';
import { authApi } from './api/auth.api';
import { Role } from '@college-erp/shared';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';

// Shared
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { RoleGate, getDashboardRoute } from './components/shared/RoleGate';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ManageCourses } from './pages/admin/ManageCourses';
import { SettingsPage } from './pages/admin/SettingsPage';
import { ManageDepartments } from './pages/admin/ManageDepartments';
import { ManageEnrollments } from './pages/admin/ManageEnrollments';
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { ManageSections } from './pages/faculty/ManageSections';
import { ManageAttendance as FacultyAttendance } from './pages/faculty/ManageAttendance';
import { ManageMarks as FacultyMarks } from './pages/faculty/ManageMarks';
import { ManageGrades as FacultyGrades } from './pages/faculty/ManageGrades';
import { ManageResults as FacultyResults } from './pages/faculty/ManageResults';
import { ManageDiscipline as FacultyDiscipline } from './pages/faculty/ManageDiscipline';
import { ManageFines as FacultyFines } from './pages/faculty/ManageFines';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MyAttendance } from './pages/student/MyAttendance';
import { MyMarks } from './pages/student/MyMarks';
import { MyFees } from './pages/student/MyFees';
import { MyResults } from './pages/student/MyResults';
import { MyDiscipline } from './pages/student/MyDiscipline';
import { StudentProfile } from './pages/student/StudentProfile';
import { NotificationsPage } from './pages/shared/NotificationsPage';

const App: React.FC = () => {
  const { isAuthenticated, user, setAuth, setLoading } = useAuthStore();

  // Try to restore session on mount via refresh token
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Use direct axios call to avoid interceptor loop
        const axios = (await import('axios')).default;
        const refreshRes = await axios.post('/api/v1/auth/refresh', {}, { withCredentials: true });
        
        if (refreshRes.data?.success && refreshRes.data?.data?.accessToken) {
          const accessToken = refreshRes.data.data.accessToken;
          // Now use the api instance with the token set
          const profileRes = await authApi.getProfile();
          setAuth(profileRes.data, accessToken);
        } else {
          setLoading(false);
        }
      } catch {
        // No valid session — stay on login
        setLoading(false);
      }
    };

    if (!isAuthenticated) {
      restoreSession();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <Routes>
      {/* ---- Public ---- */}
      <Route
        path="/login"
        element={
          isAuthenticated && user ? (
            <Navigate to={getDashboardRoute(user.role as Role)} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* ---- Protected: Dashboard Layout ---- */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Admin Routes */}
        <Route path="/admin" element={<RoleGate allowedRoles={[Role.ADMIN]}><Outlet /></RoleGate>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="courses" element={<ManageCourses />} />
          <Route path="departments" element={<ManageDepartments />} />
          <Route path="enrollments" element={<ManageEnrollments />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Faculty Routes */}
        <Route path="/faculty" element={<RoleGate allowedRoles={[Role.FACULTY]}><Outlet /></RoleGate>}>
          <Route index element={<FacultyDashboard />} />
          <Route path="sections" element={<ManageSections />} />
          <Route path="attendance" element={<FacultyAttendance />} />
          <Route path="marks" element={<FacultyMarks />} />
          <Route path="grades" element={<FacultyGrades />} />
          <Route path="results" element={<FacultyResults />} />
          <Route path="discipline" element={<FacultyDiscipline />} />
          <Route path="fines" element={<FacultyFines />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<RoleGate allowedRoles={[Role.STUDENT]}><Outlet /></RoleGate>}>
          <Route index element={<StudentDashboard />} />
          <Route path="attendance" element={<MyAttendance />} />
          <Route path="marks" element={<MyMarks />} />
          <Route path="fees" element={<MyFees />} />
          <Route path="results" element={<MyResults />} />
          <Route path="discipline" element={<MyDiscipline />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
        
        {/* Shared Notifications Route */}
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      {/* ---- Root Redirect ---- */}
      <Route
        path="/"
        element={
          isAuthenticated && user ? (
            <Navigate to={getDashboardRoute(user.role as Role)} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ---- Catch-All ---- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
