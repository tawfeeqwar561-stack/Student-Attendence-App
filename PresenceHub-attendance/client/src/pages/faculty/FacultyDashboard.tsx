import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardHeader } from '../../components/shared/Card';
import { BookOpen, Users, ClipboardCheck, FileText, BarChart3, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';
import { useFacultyStore } from '../../stores/faculty.store';

export const FacultyDashboard: React.FC = () => {
  const { dashboard, isLoading, fetchDashboard } = useFacultyStore();
  const navigate = useNavigate();

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

  const stats = [
    { label: 'Assigned Sections', value: dashboard.totalSections, icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Total Students', value: dashboard.totalStudents, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Exams', value: dashboard.totalExams || 0, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Discipline Cases', value: dashboard.recentDiscipline || 0, icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  const quickActions = [
    { label: 'Mark Attendance', desc: 'Record daily attendance', icon: ClipboardCheck, path: '/faculty/attendance', color: 'from-blue-500 to-indigo-600' },
    { label: 'Enter Marks', desc: 'Upload exam marks', icon: FileText, path: '/faculty/marks', color: 'from-emerald-500 to-teal-600' },
    { label: 'Assign Grades', desc: 'Final letter grades', icon: BarChart3, path: '/faculty/grades', color: 'from-violet-500 to-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Dashboard"
        subtitle="Manage your assigned classes and student records."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 stagger-children">
        {stats.map((stat, idx) => (
          <Card key={idx} className="flex items-center p-4 lg:p-5 hover:shadow-card-hover transition-shadow duration-300">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mr-3 ${stat.bg} ${stat.color} flex-shrink-0`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-surface-500 dark:text-surface-400 truncate">{stat.label}</p>
              <h4 className="text-xl font-bold text-surface-900 dark:text-white mt-0.5">{stat.value}</h4>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="group p-4 rounded-xl bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800 shadow-card hover:shadow-card-hover transition-all duration-300 text-left"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-surface-900 dark:text-white text-sm">{action.label}</h4>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Sections List */}
      <Card>
        <CardHeader
          title="My Sections"
          action={
            <button onClick={() => navigate('/faculty/sections')} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          }
        />
        <div className="space-y-3">
          {dashboard.sections.length === 0 ? (
            <div className="py-8 text-center">
              <BookOpen className="w-10 h-10 mx-auto text-surface-300 dark:text-surface-600 mb-2" />
              <p className="text-surface-500 dark:text-surface-400 text-sm">No sections assigned.</p>
            </div>
          ) : (
            dashboard.sections.map((section: any) => (
              <div key={section.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-surface-900 dark:text-white text-sm truncate">{section.course.name}</h4>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                      Section {section.name} • {section.academicYear} • Sem {section.semester}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400">
                    {section._count.enrollments} students
                  </span>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                    {section._count.exams} exams
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
