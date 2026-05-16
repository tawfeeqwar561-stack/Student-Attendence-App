import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardHeader } from '../../components/shared/Card';
import { Plus, BookOpen, Loader2, X } from 'lucide-react';
import { useAdminStore } from '../../stores/admin.store';
import toast from 'react-hot-toast';

export const ManageCourses: React.FC = () => {
  const { courses, departments, isLoading, fetchCourses, fetchDepartments, createCourse } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', credits: 3, departmentId: '', semester: 1, description: '' });

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, [fetchCourses, fetchDepartments]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCourse(form);
      toast.success('Course created!');
      setShowModal(false);
      setForm({ code: '', name: '', credits: 3, departmentId: '', semester: 1, description: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    }
  };

  if (isLoading && courses.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Courses"
        subtitle="Manage academic programs, subjects, and course assignments."
        action={
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Course
          </button>
        }
      />

      {courses.length === 0 ? (
        <Card className="p-8 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-surface-400 mb-3" />
          <p className="text-surface-500 dark:text-surface-400">No courses yet. Create your first course.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {courses.map((course: any) => (
            <Card key={course.id} className="p-5 hover:shadow-card-hover transition-shadow duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-500/10 text-primary-500">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-300">
                  Sem {course.semester}
                </span>
              </div>
              <h4 className="font-semibold text-surface-900 dark:text-white">{course.name}</h4>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                {course.code} • {course.credits} Credits
              </p>
              <div className="mt-3 pt-3 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between text-xs text-surface-500 dark:text-surface-400">
                <span>{course.department?.name}</span>
                <span>{course._count?.sections || 0} Sections</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-end animate-overlayIn">
          <div className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md h-full bg-white dark:bg-surface-900 shadow-elevated overflow-y-auto animate-modalIn">
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-surface-900 border-b border-surface-100 dark:border-surface-800">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">Add New Course</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">Course Code</label>
                  <input required value={form.code} onChange={e => setForm({...form, code: e.target.value})}
                    placeholder="e.g. CS101"
                    className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-surface-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">Credits</label>
                  <input type="number" required min={1} max={6} value={form.credits} onChange={e => setForm({...form, credits: parseInt(e.target.value)})}
                    className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-surface-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">Course Name</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="e.g. Introduction to Computer Science"
                  className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-surface-900 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">Department</label>
                  <select required value={form.departmentId} onChange={e => setForm({...form, departmentId: e.target.value})}
                    className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-surface-900 dark:text-white">
                    <option value="">Select</option>
                    {departments.map((d: any) => (<option key={d.id} value={d.id}>{d.code}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">Semester</label>
                  <input type="number" required min={1} max={8} value={form.semester} onChange={e => setForm({...form, semester: parseInt(e.target.value)})}
                    className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-surface-900 dark:text-white" />
                </div>
              </div>
              <div className="pt-4 border-t border-surface-100 dark:border-surface-800">
                <button type="submit" disabled={isLoading}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50">
                  {isLoading ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
