import React, { useEffect } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardHeader } from '../../components/shared/Card';
import { Users, GraduationCap, Building2, TrendingUp, BookOpen, Layers, DollarSign, Loader2 } from 'lucide-react';
import { useAdminStore } from '../../stores/admin.store';

export const AdminDashboard: React.FC = () => {
  const { dashboard, isLoading, fetchDashboard } = useAdminStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading || !dashboard) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const metrics = [
    { label: 'Total Students', value: dashboard.totalStudents, icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Faculty', value: dashboard.totalFaculty, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Departments', value: dashboard.totalDepartments, icon: Building2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Courses', value: dashboard.totalCourses, icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Sections', value: dashboard.totalSections, icon: Layers, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Attendance Rate', value: `${dashboard.attendanceRate}%`, icon: TrendingUp, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Overview"
        subtitle="Welcome back. Here's what's happening across your institution."
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 stagger-children">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="flex items-center p-5 hover:shadow-card-hover transition-shadow duration-300">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${metric.bg} ${metric.color}`}>
              <metric.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{metric.label}</p>
              <h4 className="text-2xl font-bold text-surface-900 dark:text-white mt-0.5">{metric.value}</h4>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <Card className="lg:col-span-2">
          <CardHeader title="Recent Users" />
          <div className="space-y-3">
            {dashboard.recentUsers.length === 0 ? (
              <p className="text-surface-500 dark:text-surface-400 text-sm">No users yet.</p>
            ) : (
              dashboard.recentUsers.map((user: any) => (
                <div key={user.id} className="flex items-center gap-4 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{user.email}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'ADMIN'
                      ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                      : user.role === 'FACULTY'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader title="Financial Summary" />
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200/50 dark:border-amber-700/30">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-300">Pending Fees</p>
                  <p className="text-xl font-bold text-amber-900 dark:text-amber-100">₹{dashboard.pendingFees.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200/50 dark:border-emerald-700/30">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Attendance Rate</p>
                  <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">{dashboard.attendanceRate}%</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">Last 7 days</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
