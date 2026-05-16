import React, { useEffect } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/shared/Card';
import { useStudentStore } from '../../stores/student.store';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export const MyMarks: React.FC = () => {
  const { marks, isLoading, fetchMarks } = useStudentStore();

  useEffect(() => {
    fetchMarks();
  }, [fetchMarks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Marks" 
        subtitle="Subject-wise marks and exam records."
      />
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 font-medium">
              <tr>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Exam Type</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Marks Obtained</th>
                <th className="px-5 py-3">Max Marks</th>
                <th className="px-5 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {marks.map((mark: any) => (
                <tr key={mark.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <td className="px-5 py-4 text-surface-900 dark:text-white font-medium">
                    {mark.exam.course.name}
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400">
                      {mark.exam.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-surface-500 dark:text-surface-400 whitespace-nowrap">
                    {format(new Date(mark.exam.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-5 py-4 text-surface-900 dark:text-white font-semibold">
                    {mark.obtainedMarks}
                  </td>
                  <td className="px-5 py-4 text-surface-500 dark:text-surface-400">
                    {mark.exam.maxMarks}
                  </td>
                  <td className="px-5 py-4 text-surface-500 dark:text-surface-400">
                    {mark.remarks || '-'}
                  </td>
                </tr>
              ))}
              {marks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-surface-500">
                    No marks records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
