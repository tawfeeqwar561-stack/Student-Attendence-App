import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/shared/Card';
import { useFacultyStore } from '../../stores/faculty.store';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageAttendance: React.FC = () => {
  const { sections, isLoading, fetchSections, markAttendance } = useFacultyStore();
  const [selectedSection, setSelectedSection] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleSectionChange = (sectionId: string) => {
    setSelectedSection(sectionId);
    // Initialize attendance data to PRESENT by default for all enrolled students
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      const initialData: Record<string, 'PRESENT'> = {};
      section.enrollments.forEach((e: any) => {
        initialData[e.studentId] = 'PRESENT';
      });
      setAttendanceData(initialData);
    }
  };

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (!selectedSection) return toast.error('Please select a section');
    
    setIsSubmitting(true);
    const records = Object.entries(attendanceData).map(([studentId, status]) => ({
      studentId,
      status
    }));

    try {
      await markAttendance({ sectionId: selectedSection, date, records });
      toast.success('Attendance saved successfully');
    } catch (err) {
      // error is handled by store
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
        title="Manage Attendance" 
        subtitle="Mark daily attendance for your assigned sections."
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
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {currentSection && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-surface-200 dark:border-surface-800 rounded-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-50 dark:bg-surface-800/50">
                  <tr>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {currentSection.enrollments.map((enrollment: any) => (
                    <tr key={enrollment.studentId}>
                      <td className="px-4 py-3 font-medium text-surface-900 dark:text-white">
                        {enrollment.student.user.firstName} {enrollment.student.user.lastName}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={attendanceData[enrollment.studentId] || 'PRESENT'}
                          onChange={(e) => handleStatusChange(enrollment.studentId, e.target.value as any)}
                          className={`px-3 py-1 rounded-md text-sm font-semibold border-0 ${
                            attendanceData[enrollment.studentId] === 'PRESENT' ? 'bg-emerald-100 text-emerald-700' :
                            attendanceData[enrollment.studentId] === 'ABSENT' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}
                        >
                          <option value="PRESENT">Present</option>
                          <option value="ABSENT">Absent</option>
                          <option value="LATE">Late</option>
                          <option value="EXCUSED">Excused</option>
                        </select>
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
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Attendance
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
