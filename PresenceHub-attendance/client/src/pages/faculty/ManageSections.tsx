import React, { useEffect } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/shared/Card';
import { BookOpen, Users, Loader2 } from 'lucide-react';
import { useFacultyStore } from '../../stores/faculty.store';

export const ManageSections: React.FC = () => {
  const { dashboard, isLoading, fetchDashboard } = useFacultyStore();

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
        title="My Sections"
        subtitle="View and manage your assigned course sections."
      />

      {dashboard.sections.length === 0 ? (
        <Card className="p-8 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-surface-400 mb-3" />
          <p className="text-surface-500 dark:text-surface-400">No sections assigned yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {dashboard.sections.map((section: any) => (
            <Card key={section.id} className="p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-500">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                  {section.academicYear}
                </span>
              </div>
              <h4 className="font-semibold text-surface-900 dark:text-white text-lg">
                {section.course?.name ?? 'Course'}
              </h4>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                Section: {section.name}
              </p>
              <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-800 flex items-center text-sm text-surface-500 dark:text-surface-400">
                <Users className="w-4 h-4 mr-1.5" />
                {section._count?.enrollments ?? 0} Students Enrolled
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
