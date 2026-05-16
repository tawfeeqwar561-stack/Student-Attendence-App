import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/shared/Card';
import { useFacultyStore } from '../../stores/faculty.store';
import { Loader2, Save, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageResults: React.FC = () => {
  const { sections, isLoading, fetchSections, uploadResults } = useFacultyStore();
  const [selectedSection, setSelectedSection] = useState('');
  const [resultData, setResultData] = useState<Record<string, { sgpa: number; cgpa: number; totalCredits: number; earnedCredits: number }>>({});
  const [semester, setSemester] = useState(1);
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleSectionChange = (sectionId: string) => {
    setSelectedSection(sectionId);
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      setSemester(section.semester);
      const initialData: Record<string, any> = {};
      section.enrollments.forEach((e: any) => {
        initialData[e.studentId] = { sgpa: 8.0, cgpa: 8.0, totalCredits: 24, earnedCredits: 24 };
      });
      setResultData(initialData);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSection) return toast.error('Please select a section');

    setIsSubmitting(true);
    const records = Object.entries(resultData).map(([studentId, data]) => ({
      studentId,
      semester,
      academicYear,
      ...data,
    }));

    try {
      await uploadResults({ records });
      toast.success('Results uploaded successfully');
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Results"
        subtitle="Upload semester SGPA/CGPA results for students."
      />

      <Card className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Select Section</label>
            <select value={selectedSection} onChange={(e) => handleSectionChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary-500/20 text-sm text-surface-900 dark:text-white">
              <option value="">-- Choose --</option>
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>{sec.course.name} - {sec.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Semester</label>
            <input type="number" min={1} max={8} value={semester} onChange={e => setSemester(parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary-500/20 text-sm text-surface-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Academic Year</label>
            <input value={academicYear} onChange={e => setAcademicYear(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary-500/20 text-sm text-surface-900 dark:text-white" />
          </div>
        </div>

        {!currentSection ? (
          <div className="py-12 text-center">
            <Trophy className="w-12 h-12 mx-auto text-surface-300 dark:text-surface-600 mb-3" />
            <p className="text-surface-500 dark:text-surface-400">Select a section to upload results.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-surface-200 dark:border-surface-800 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-50 dark:bg-surface-800/50">
                  <tr>
                    <th className="px-5 py-3 text-surface-500 dark:text-surface-400 font-medium">Student</th>
                    <th className="px-5 py-3 text-surface-500 dark:text-surface-400 font-medium">SGPA</th>
                    <th className="px-5 py-3 text-surface-500 dark:text-surface-400 font-medium">CGPA</th>
                    <th className="px-5 py-3 text-surface-500 dark:text-surface-400 font-medium">Credits (Total)</th>
                    <th className="px-5 py-3 text-surface-500 dark:text-surface-400 font-medium">Credits (Earned)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {currentSection.enrollments.map((enrollment: any) => {
                    const data = resultData[enrollment.studentId] || {};
                    return (
                      <tr key={enrollment.studentId} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                              {enrollment.student.user.firstName[0]}{enrollment.student.user.lastName[0]}
                            </div>
                            <span className="font-medium text-surface-900 dark:text-white">
                              {enrollment.student.user.firstName} {enrollment.student.user.lastName}
                            </span>
                          </div>
                        </td>
                        {['sgpa', 'cgpa', 'totalCredits', 'earnedCredits'].map((field) => (
                          <td key={field} className="px-5 py-3.5">
                            <input
                              type="number" step={field.includes('gpa') ? '0.1' : '1'} min={0}
                              max={field.includes('gpa') ? 10 : 50}
                              value={(data as any)[field] || 0}
                              onChange={(e) => setResultData((prev) => ({
                                ...prev,
                                [enrollment.studentId]: { ...prev[enrollment.studentId], [field]: parseFloat(e.target.value) }
                              }))}
                              className="w-20 px-2 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-sm text-center text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500/20"
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={handleSubmit} disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 shadow-sm">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Upload Results
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
