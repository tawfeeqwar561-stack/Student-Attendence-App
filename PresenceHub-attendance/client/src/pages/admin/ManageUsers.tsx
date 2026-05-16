import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardHeader } from '../../components/shared/Card';
import { Plus, Search, Loader2, X, UserCheck, UserX } from 'lucide-react';
import { useAdminStore } from '../../stores/admin.store';
import toast from 'react-hot-toast';

export const ManageUsers: React.FC = () => {
  const { users, departments, isLoading, fetchUsers, fetchDepartments, createUser, toggleUserStatus } = useAdminStore();
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [form, setForm] = useState({
    email: '', password: '', firstName: '', lastName: '',
    role: 'STUDENT', departmentId: '', rollNumber: '', semester: 1,
    employeeId: '', designation: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, [fetchUsers, fetchDepartments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers({ role: roleFilter, search });
    }, 300);
    return () => clearTimeout(timer);
  }, [roleFilter, search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(form);
      toast.success('User created successfully!');
      setShowModal(false);
      setForm({ email: '', password: '', firstName: '', lastName: '', role: 'STUDENT', departmentId: '', rollNumber: '', semester: 1, employeeId: '', designation: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleToggleStatus = async (userId: string, name: string) => {
    try {
      await toggleUserStatus(userId);
      toast.success(`${name}'s status updated`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      ADMIN: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
      FACULTY: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
      STUDENT: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    };
    return styles[role] || '';
  };

  const getDepartment = (user: any) => {
    if (user.student?.department) return user.student.department.name;
    if (user.faculty?.department) return user.faculty.department.name;
    return '—';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Users"
        subtitle="Add, edit, or remove students and faculty members."
        action={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        }
      />

      <Card noPadding>
        <div className="p-5 border-b border-surface-100 dark:border-surface-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          {/* Search */}
          <div className="flex items-center px-3 py-2 bg-surface-50 dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 w-full sm:w-72">
            <Search className="w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ml-2 bg-transparent border-none focus:outline-none text-sm text-surface-700 dark:text-surface-200 placeholder-surface-400 w-full"
            />
          </div>
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 text-surface-700 dark:text-surface-200"
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 font-medium">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3 hidden md:table-cell">Department</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-surface-500 dark:text-surface-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user: any) => (
                    <tr key={user.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-surface-900 dark:text-white">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-surface-500 dark:text-surface-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-surface-600 dark:text-surface-300 hidden md:table-cell">
                        {getDepartment(user)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                          user.isActive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-red-500 dark:text-red-400'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(user.id, user.firstName)}
                          className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                            user.isActive
                              ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'
                              : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                          }`}
                        >
                          {user.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ---- Add User Modal ---- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-end animate-overlayIn">
          <div className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md h-full bg-white dark:bg-surface-900 shadow-elevated overflow-y-auto animate-modalIn">
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-surface-900 border-b border-surface-100 dark:border-surface-800">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">Add New User</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">First Name</label>
                  <input required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})}
                    className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-surface-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">Last Name</label>
                  <input required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})}
                    className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-surface-900 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">Email</label>
                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-surface-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">Password</label>
                <input type="password" required minLength={6} value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-surface-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">Role</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                  className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-surface-900 dark:text-white">
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {(form.role === 'STUDENT' || form.role === 'FACULTY') && (
                <div>
                  <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">Department</label>
                  <select value={form.departmentId} onChange={e => setForm({...form, departmentId: e.target.value})}
                    className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-surface-900 dark:text-white">
                    <option value="">Select Department</option>
                    {departments.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>
              )}

              {form.role === 'STUDENT' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">Roll Number</label>
                    <input value={form.rollNumber} onChange={e => setForm({...form, rollNumber: e.target.value})}
                      className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-surface-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">Semester</label>
                    <input type="number" min={1} max={8} value={form.semester} onChange={e => setForm({...form, semester: parseInt(e.target.value)})}
                      className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-surface-900 dark:text-white" />
                  </div>
                </div>
              )}

              {form.role === 'FACULTY' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">Employee ID</label>
                    <input value={form.employeeId} onChange={e => setForm({...form, employeeId: e.target.value})}
                      className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-surface-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">Designation</label>
                    <input value={form.designation} onChange={e => setForm({...form, designation: e.target.value})}
                      className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-surface-900 dark:text-white" />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-surface-100 dark:border-surface-800">
                <button type="submit" disabled={isLoading}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50">
                  {isLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
