import React from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/shared/Card';
import { UserCircle, Mail, GraduationCap, Building2, Calendar, Phone } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';

export const StudentProfile: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  const profileItems = [
    { icon: Mail, label: 'Email Address', value: user.email },
    { icon: GraduationCap, label: 'Role', value: 'Student' },
    { icon: Building2, label: 'Department', value: 'Computer Science & Engineering' },
    { icon: Calendar, label: 'Account Created', value: new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) },
    { icon: Phone, label: 'Contact', value: 'Not provided' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" subtitle="View and manage your account details." />

      <Card className="p-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-surface-100 dark:border-surface-800">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-surface-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{user.email}</p>
            <span className="inline-flex items-center mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-6 space-y-4">
          {profileItems.map((item) => (
            <div key={item.label} className="flex items-center gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-500/10 text-primary-500 flex-shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-surface-500 dark:text-surface-400">{item.label}</p>
                <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
