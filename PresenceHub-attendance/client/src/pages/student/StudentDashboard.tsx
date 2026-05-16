import React, { useEffect } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardHeader } from '../../components/shared/Card';
import { ClipboardCheck, FileText, Bell, Loader2 } from 'lucide-react';
import { useStudentStore } from '../../stores/student.store';

export const StudentDashboard: React.FC = () => {
  const { dashboard, isLoading, fetchDashboard } = useStudentStore();

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

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Student Dashboard" 
        subtitle="Your academic summary at a glance."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <Card className="flex items-center p-5 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-white/20">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">Overall Attendance</p>
            <h4 className="text-3xl font-bold mt-0.5">{dashboard.attendancePercentage}%</h4>
          </div>
        </Card>
        
        <Card className="flex items-center p-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-emerald-500/10 text-emerald-500">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Current SGPA</p>
            <h4 className="text-2xl font-bold text-surface-900 dark:text-white mt-0.5">{dashboard.latestSgpa || 'N/A'}</h4>
          </div>
        </Card>

        <Card className="flex items-center p-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-rose-500/10 text-rose-500">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Pending Dues</p>
            <h4 className="text-2xl font-bold text-surface-900 dark:text-white mt-0.5">${dashboard.pendingFees.toFixed(2)}</h4>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Recent Marks" />
          <div className="space-y-4">
             {dashboard.recentMarks.length === 0 ? (
               <p className="text-sm text-surface-500 dark:text-surface-400">No recent marks available.</p>
             ) : (
               dashboard.recentMarks.map((mark: any) => (
                 <div key={mark.id} className="p-4 rounded-lg bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-surface-900 dark:text-white">{mark.exam.course.name}</h4>
                      <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{mark.exam.type} Exam</p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400">
                      {mark.obtainedMarks} / {mark.exam.maxMarks}
                    </span>
                  </div>
                </div>
               ))
             )}
          </div>
        </Card>
        <Card>
          <CardHeader title="Recent Announcements" />
          <div className="space-y-4">
             {dashboard.notifications.length === 0 ? (
               <p className="text-surface-500 dark:text-surface-400">No new announcements today.</p>
             ) : (
               dashboard.notifications.map((notification: any) => (
                 <div key={notification.id} className="flex gap-3 items-start pb-4 border-b border-surface-100 dark:border-surface-800 last:border-0 last:pb-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">{notification.title}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{notification.message}</p>
                  </div>
                </div>
               ))
             )}
          </div>
        </Card>
      </div>
    </div>
  );
};
