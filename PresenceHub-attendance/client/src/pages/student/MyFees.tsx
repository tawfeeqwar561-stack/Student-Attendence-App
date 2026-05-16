import React, { useEffect } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardHeader } from '../../components/shared/Card';
import { useStudentStore } from '../../stores/student.store';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export const MyFees: React.FC = () => {
  const { fees, isLoading, fetchFees } = useStudentStore();

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

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
        title="Fee Details" 
        subtitle="Manage your academic fees and fine records."
      />
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 font-medium">
              <tr>
                <th className="px-5 py-3">Fee Type</th>
                <th className="px-5 py-3">Academic Term</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3">Total Amount</th>
                <th className="px-5 py-3">Paid</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {fees.map((fee: any) => (
                <tr key={fee.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <td className="px-5 py-4 text-surface-900 dark:text-white font-medium">
                    {fee.type}
                  </td>
                  <td className="px-5 py-4 text-surface-500 dark:text-surface-400">
                    {fee.academicYear} - Sem {fee.semester}
                  </td>
                  <td className="px-5 py-4 text-surface-500 dark:text-surface-400 whitespace-nowrap">
                    {format(new Date(fee.dueDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-5 py-4 text-surface-900 dark:text-white font-semibold">
                    ${fee.amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-emerald-600 font-medium">
                    ${fee.paidAmount.toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      fee.status === 'PAID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                      fee.status === 'OVERDUE' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                      fee.status === 'PARTIALLY_PAID' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                    }`}>
                      {fee.status}
                    </span>
                  </td>
                </tr>
              ))}
              {fees.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-surface-500">
                    No fee records found.
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
