import React, { useEffect } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/shared/Card';
import { useStudentStore } from '../../stores/student.store';
import { Loader2, Award } from 'lucide-react';

export const MyResults: React.FC = () => {
  const { results, isLoading, fetchResults } = useStudentStore();

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

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
        title="Exam Results" 
        subtitle="Your semester-wise academic performance (SGPA & CGPA)."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result: any) => (
          <Card key={result.id} className="relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Award className="w-24 h-24 text-primary-500" />
            </div>
            
            <div className="relative z-10">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400 mb-4 inline-block">
                {result.academicYear}
              </span>
              <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-6">
                Semester {result.semester}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-surface-500 dark:text-surface-400">SGPA</p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white">{result.sgpa}</p>
                </div>
                <div>
                  <p className="text-xs text-surface-500 dark:text-surface-400">CGPA</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{result.cgpa}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-surface-100 dark:border-surface-800 flex justify-between">
                <span className="text-sm text-surface-500">Earned Credits</span>
                <span className="text-sm font-semibold text-surface-900 dark:text-white">
                  {result.earnedCredits} / {result.totalCredits}
                </span>
              </div>
            </div>
          </Card>
        ))}

        {results.length === 0 && (
          <div className="col-span-full">
            <Card className="text-center py-12">
              <p className="text-surface-500">No published results found.</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
