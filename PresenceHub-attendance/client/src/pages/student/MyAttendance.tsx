import React, { useEffect } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/shared/Card';
import { useStudentStore } from '../../stores/student.store';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export const MyAttendance: React.FC = () => {
  const { attendance, isLoading, fetchAttendance } = useStudentStore();

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

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
        title="My Attendance" 
        subtitle="View your daily class attendance records."
      />
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 font-medium">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Section</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {attendance.map((record: any) => (
                <tr key={record.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap text-surface-900 dark:text-white">
                    {format(new Date(record.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-300 font-medium">
                    {record.section.course.name}
                  </td>
                  <td className="px-5 py-4 text-surface-500 dark:text-surface-400">
                    {record.section.name}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      record.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                      record.status === 'ABSENT' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                      record.status === 'LATE' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-surface-500 dark:text-surface-400">
                    {record.remarks || '-'}
                  </td>
                </tr>
              ))}
              {attendance.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-surface-500">
                    No attendance records found.
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
