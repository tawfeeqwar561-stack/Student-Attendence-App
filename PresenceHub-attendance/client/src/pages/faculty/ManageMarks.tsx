import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/shared/Card';
import { useFacultyStore } from '../../stores/faculty.store';
import { Loader2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageMarks: React.FC = () => {
  const { sections, isLoading, fetchSections, uploadMarks } = useFacultyStore();
  const [selectedSection, setSelectedSection] = useState('');
  const [examId, setExamId] = useState('');
  const [marksData, setMarksData] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleSectionChange = (sectionId: string) => {
    setSelectedSection(sectionId);
    setMarksData({});
  };

  const handleMarkChange = (studentId: string, value: string) => {
    const num = parseFloat(value);
    setMarksData((prev) => ({ ...prev, [studentId]: isNaN(num) ? 0 : num }));
  };

  const handleSubmit = async () => {
    if (!selectedSection) return toast.error('Please select a section');
    if (!examId) return toast.error('Please enter an Exam ID'); // In a real app, this would be a dropdown of Exams
    
    setIsSubmitting(true);
    const records = Object.entries(marksData).map(([studentId, obtainedMarks]) => ({
      studentId,
      obtainedMarks
    }));

    try {
      await uploadMarks({ examId, records });
      toast.success('Marks uploaded successfully');
    } catch (err) {
      // store handles error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSection = sections.find((s) => s.id === selectedSection);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Upload Marks" 
        subtitle="Enter exam or assignment marks for your students."
      />

      <Card className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Select Section</label>
            <select
              value={selectedSection}
              onChange={(e) => handleSectionChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary-500"
            >
              <option value="">-- Choose a Section --</option>
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.course.name} - {sec.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Exam ID (UUID)</label>
            <input
              type="text"
              placeholder="e.g. 123e4567-e89b-..."
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-surface-500 mt-1">Requires an existing Exam ID for this section.</p>
          </div>
        </div>

        {currentSection && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-surface-200 dark:border-surface-800 rounded-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-50 dark:bg-surface-800/50">
                  <tr>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3 w-48">Marks Obtained</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {currentSection.enrollments.map((enrollment: any) => (
                    <tr key={enrollment.studentId}>
                      <td className="px-4 py-3 font-medium text-surface-900 dark:text-white">
                        {enrollment.student.user.firstName} {enrollment.student.user.lastName}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          value={marksData[enrollment.studentId] || ''}
                          onChange={(e) => handleMarkChange(enrollment.studentId, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-md border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary-500"
                          placeholder="0"
                        />
                      </td>
                    </tr>
                  ))}
                  {currentSection.enrollments.length === 0 && (
                    <tr><td colSpan={2} className="px-4 py-8 text-center text-surface-500">No students enrolled.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || currentSection.enrollments.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Submit Marks
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
