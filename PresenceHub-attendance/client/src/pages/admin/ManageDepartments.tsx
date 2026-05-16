import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardHeader } from '../../components/shared/Card';
import { Plus, Building2, Users, GraduationCap, BookOpen, Loader2, X } from 'lucide-react';
import { useAdminStore } from '../../stores/admin.store';
import toast from 'react-hot-toast';

export const ManageDepartments: React.FC = () => {
  const { departments, isLoading, fetchDepartments, createDepartment } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', code: '' });

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDepartment(form);
      toast.success('Department created!');
      setShowModal(false);
      setForm({ name: '', code: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create department');
    }
  };

  if (isLoading && departments.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const colors = [
    { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-200 dark:border-blue-800' },
    { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-200 dark:border-emerald-800' },
    { bg: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-200 dark:border-violet-800' },
    { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-200 dark:border-amber-800' },
    { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-200 dark:border-rose-800' },
    { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-200 dark:border-cyan-800' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Departments"
        subtitle="Organize and manage academic departments."
        action={
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Department
          </button>
        }
      />

      {departments.length === 0 ? (
        <Card className="p-8 text-center">
          <Building2 className="w-12 h-12 mx-auto text-surface-400 mb-3" />
          <p className="text-surface-500 dark:text-surface-400">No departments yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 stagger-children">
          {departments.map((dept: any, idx: number) => {
            const color = colors[idx % colors.length];
            return (
              <Card key={dept.id} className={`p-5 hover:shadow-card-hover transition-shadow duration-300 border-l-4 ${color.border}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color.bg} ${color.text}`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-300">
                    {dept.code}
                  </span>
                </div>
                <h4 className="font-semibold text-surface-900 dark:text-white text-base">{dept.name}</h4>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
                    <Users className="w-3.5 h-3.5" /> {dept._count?.faculty || 0} Faculty
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
                    <GraduationCap className="w-3.5 h-3.5" /> {dept._count?.students || 0} Students
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
                    <BookOpen className="w-3.5 h-3.5" /> {dept._count?.courses || 0} Courses
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Department Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-end animate-overlayIn">
          <div className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md h-full bg-white dark:bg-surface-900 shadow-elevated overflow-y-auto animate-modalIn">
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-surface-900 border-b border-surface-100 dark:border-surface-800">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">Add New Department</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">Department Name</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-surface-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">Department Code</label>
                <input required value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
                  placeholder="e.g. CSE"
                  className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-surface-900 dark:text-white" />
              </div>
              <div className="pt-4 border-t border-surface-100 dark:border-surface-800">
                <button type="submit" disabled={isLoading}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50">
                  {isLoading ? 'Creating...' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
