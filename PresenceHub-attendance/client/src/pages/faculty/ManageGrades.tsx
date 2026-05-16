import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardHeader } from '../../components/shared/Card';
import { useFacultyStore } from '../../stores/faculty.store';
import { Loader2, Save, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageGrades: React.FC = () => {
  const { sections, isLoading, fetchSections, uploadGrades } = useFacultyStore();
  const [selectedSection, setSelectedSection] = useState('');
  const [gradeData, setGradeData] = useState<Record<string, { letterGrade: string; gradePoints: number }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const gradeOptions = [
    { label: 'A+', grade: 'A+', points: 10 },
    { label: 'A', grade: 'A', points: 9 },
    { label: 'B+', grade: 'B+', points: 8 },
    { label: 'B', grade: 'B', points: 7 },
    { label: 'C+', grade: 'C+', points: 6 },
    { label: 'C', grade: 'C', points: 5 },
    { label: 'D', grade: 'D', points: 4 },
    { label: 'F', grade: 'F', points: 0 },
  ];

  const handleSectionChange = (sectionId: string) => {
    setSelectedSection(sectionId);
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      const initialData: Record<string, { letterGrade: string; gradePoints: number }> = {};
      section.enrollments.forEach((e: any) => {
        initialData[e.studentId] = { letterGrade: 'A', gradePoints: 9 };
      });
      setGradeData(initialData);
    }
  };

  const handleGradeChange = (studentId: string, letterGrade: string) => {
    const option = gradeOptions.find((g) => g.grade === letterGrade);
    setGradeData((prev) => ({
      ...prev,
      [studentId]: { letterGrade, gradePoints: option?.points || 0 },
    }));
  };

  const handleSubmit = async () => {
    if (!selectedSection) return toast.error('Please select a section');

    setIsSubmitting(true);
    const records = Object.entries(gradeData).map(([studentId, { letterGrade, gradePoints }]) => ({
      studentId,
      letterGrade,
      gradePoints,
    }));

    try {
      await uploadGrades({ sectionId: selectedSection, records });
      toast.success('Grades saved successfully');
    } catch {
      // error handled by store
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && sections.length === 0) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  }

  const currentSection = sections.find((s) => s.id === selectedSection);

  const getGradeColor = (grade: string) => {
    if (['A+', 'A'].includes(grade)) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
    if (['B+', 'B'].includes(grade)) return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
    if (['C+', 'C'].includes(grade)) return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
    return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Grades"
        subtitle="Assign final letter grades to students for your sections."
      />

      <Card className="p-4 md:p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Select Section</label>
          <select
            value={selectedSection}
            onChange={(e) => handleSectionChange(e.target.value)}
            className="w-full max-w-md px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm text-surface-900 dark:text-white"
          >
            <option value="">-- Choose a Section --</option>
            {sections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.course.name} - Section {sec.name}
              </option>
            ))}
          </select>
        </div>

        {!currentSection ? (
          <div className="py-12 text-center">
            <BarChart3 className="w-12 h-12 mx-auto text-surface-300 dark:text-surface-600 mb-3" />
            <p className="text-surface-500 dark:text-surface-400">Select a section to assign grades.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-surface-200 dark:border-surface-800 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-50 dark:bg-surface-800/50">
                  <tr>
                    <th className="px-5 py-3 text-surface-500 dark:text-surface-400 font-medium">Student</th>
                    <th className="px-5 py-3 text-surface-500 dark:text-surface-400 font-medium">Letter Grade</th>
                    <th className="px-5 py-3 text-surface-500 dark:text-surface-400 font-medium">Grade Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {currentSection.enrollments.map((enrollment: any) => {
                    const data = gradeData[enrollment.studentId];
                    return (
                      <tr key={enrollment.studentId} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold">
                              {enrollment.student.user.firstName[0]}{enrollment.student.user.lastName[0]}
                            </div>
                            <span className="font-medium text-surface-900 dark:text-white">
                              {enrollment.student.user.firstName} {enrollment.student.user.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <select
                            value={data?.letterGrade || 'A'}
                            onChange={(e) => handleGradeChange(enrollment.studentId, e.target.value)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-0 cursor-pointer ${getGradeColor(data?.letterGrade || 'A')}`}
                          >
                            {gradeOptions.map((g) => (
                              <option key={g.grade} value={g.grade}>{g.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-3.5 text-surface-600 dark:text-surface-300 font-medium">
                          {data?.gradePoints || 0}
                        </td>
                      </tr>
                    );
                  })}
                  {currentSection.enrollments.length === 0 && (
                    <tr><td colSpan={3} className="px-5 py-8 text-center text-surface-500">No students enrolled.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || currentSection.enrollments.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 shadow-sm"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Grades
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
