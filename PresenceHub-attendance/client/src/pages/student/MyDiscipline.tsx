import React, { useEffect } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/shared/Card';
import { useStudentStore } from '../../stores/student.store';
import { Loader2, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

export const MyDiscipline: React.FC = () => {
  const { discipline, isLoading, fetchDiscipline } = useStudentStore();

  useEffect(() => {
    fetchDiscipline();
  }, [fetchDiscipline]);

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
        title="Discipline Records" 
        subtitle="Warnings, fines, and other disciplinary actions."
      />
      
      {discipline.length === 0 ? (
        <Card className="text-center py-16 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-surface-900 dark:text-white">Clean Record!</h3>
          <p className="text-surface-500 mt-2">You have no disciplinary actions recorded.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {discipline.map((record: any) => (
            <Card key={record.id} className="border-l-4 border-l-red-500">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 uppercase tracking-wider">
                  {record.actionTaken}
                </span>
                <span className="text-sm text-surface-500 font-medium">
                  {format(new Date(record.incidentDate), 'MMMM dd, yyyy')}
                </span>
              </div>
              <p className="text-surface-900 dark:text-white font-medium mb-1">
                {record.description}
              </p>
              {record.actionDetails && (
                <p className="text-sm text-surface-600 dark:text-surface-400 mt-2 bg-surface-50 dark:bg-surface-800 p-3 rounded-md">
                  <strong>Action Details:</strong> {record.actionDetails}
                </p>
              )}
              <div className="mt-4 flex items-center">
                <span className={`text-xs font-semibold ${record.isResolved ? 'text-emerald-500' : 'text-amber-500'}`}>
                  Status: {record.isResolved ? 'Resolved' : 'Pending Review'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
