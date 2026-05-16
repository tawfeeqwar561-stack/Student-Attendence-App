import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/shared/Card';
import { adminApi } from '../../api/admin.api';
import { Users, BookOpen, Plus, Trash2, Loader2, UserPlus, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageEnrollments: React.FC = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedSection) {
      loadEnrollments(selectedSection);
    } else {
      setEnrollments([]);
    }
  }, [selectedSection]);

  const loadData = async () => {
    try {
      const [secRes, deptRes] = await Promise.all([
        adminApi.listSections(),
        adminApi.listDepartments(),
      ]);
      setSections(secRes.data.data);
      setDepartments(deptRes.data.data);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollments = async (sectionId: string) => {
    try {
      const res = await adminApi.listEnrollments(sectionId);
      setEnrollments(res.data.data);
    } catch {
      toast.error('Failed to load enrollments');
    }
  };

  const handleBulkEnroll = async (departmentId: string) => {
    if (!selectedSection) {
      toast.error('Select a section first');
      return;
    }
    setEnrolling(true);
    try {
      const res = await adminApi.enrollDepartmentStudents({
        sectionId: selectedSection,
        departmentId,
      });
      toast.success(res.data.message);
      loadEnrollments(selectedSection);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handleRemove = async (studentId: string) => {
    if (!confirm('Remove this student from the section?')) return;
    try {
      await adminApi.removeEnrollment(studentId, selectedSection);
      toast.success('Student removed');
      loadEnrollments(selectedSection);
    } catch {
      toast.error('Failed to remove');
    }
  };

  const selectedSectionData = sections.find((s: any) => s.id === selectedSection);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Enrollments"
        subtitle="Manage which students are enrolled in each course section."
      />

      {/* Section Selector */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <BookOpen className="w-5 h-5 text-primary-500" />
            <span className="font-semibold text-surface-900 dark:text-white text-sm">Select Section:</span>
          </div>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">— Choose a section —</option>
            {sections.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.course.code} — {s.course.name} (Section {s.name}) • Faculty: {s.faculty?.user?.firstName} {s.faculty?.user?.lastName} • {s._count.enrollments} students
              </option>
            ))}
          </select>
        </div>
      </Card>

      {selectedSection && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Bulk enroll by department */}
          <Card className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary-500" />
              Bulk Enroll by Department
            </h3>
            <p className="text-xs text-surface-500 dark:text-surface-400 mb-4">
              Add ALL students from a department to this section.
            </p>
            <div className="space-y-2">
              {departments.map((dept: any) => (
                <button
                  key={dept.id}
                  onClick={() => handleBulkEnroll(dept.id)}
                  disabled={enrolling}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors text-left group disabled:opacity-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">{dept.code}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">{dept.name}</p>
                    <p className="text-xs text-surface-400 mt-0.5">{dept._count.students} students</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <UserPlus className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Right: Enrolled students */}
          <Card className="lg:col-span-2" noPadding>
            <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-surface-100 dark:border-surface-800">
              <div>
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Enrolled Students
                </h3>
                {selectedSectionData && (
                  <p className="text-xs text-surface-500 mt-0.5">
                    {selectedSectionData.course.code} — Section {selectedSectionData.name}
                  </p>
                )}
              </div>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400">
                {enrollments.length} students
              </span>
            </div>

            {enrollments.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="w-10 h-10 mx-auto text-surface-300 dark:text-surface-600 mb-3" />
                <p className="text-sm text-surface-500 dark:text-surface-400">No students enrolled yet.</p>
                <p className="text-xs text-surface-400 mt-1">Use the department buttons to bulk-enroll students.</p>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-surface-50 dark:bg-surface-800 z-10">
                    <tr className="text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      <th className="px-5 py-3">#</th>
                      <th className="px-5 py-3">Student</th>
                      <th className="px-5 py-3">Department</th>
                      <th className="px-5 py-3">Roll No</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                    {enrollments.map((e: any, idx: number) => (
                      <tr key={e.id || idx} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                        <td className="px-5 py-3 text-surface-400 text-xs">{idx + 1}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {e.student?.user?.firstName?.[0]}{e.student?.user?.lastName?.[0]}
                            </div>
                            <div>
                              <p className="font-medium text-surface-900 dark:text-white">
                                {e.student?.user?.firstName} {e.student?.user?.lastName}
                              </p>
                              <p className="text-xs text-surface-400">{e.student?.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">
                            {e.student?.department?.code}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-surface-600 dark:text-surface-300 font-mono text-xs">
                          {e.student?.rollNumber}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => handleRemove(e.student?.id)}
                            className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Remove enrollment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
