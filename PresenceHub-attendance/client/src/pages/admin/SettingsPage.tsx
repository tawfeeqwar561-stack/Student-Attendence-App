import React from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardHeader } from '../../components/shared/Card';
import { Shield, Palette, Bell, Database, Globe, Clock } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useUI();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage system preferences and configurations."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-500/10 text-violet-500">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 dark:text-white">Appearance</h3>
              <p className="text-xs text-surface-500 dark:text-surface-400">Customize the look and feel</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800">
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">Dark Mode</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">Toggle dark/light theme</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-primary-600' : 'bg-surface-300'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 dark:text-white">Notifications</h3>
              <p className="text-xs text-surface-500 dark:text-surface-400">Manage notification preferences</p>
            </div>
          </div>
          <div className="space-y-3">
            {['Email Notifications', 'Attendance Alerts', 'Fee Reminders'].map((label) => (
              <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800">
                <p className="text-sm font-medium text-surface-900 dark:text-white">{label}</p>
                <div className="relative inline-flex h-7 w-12 items-center rounded-full bg-primary-600">
                  <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow-sm translate-x-6" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/10 text-red-500">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 dark:text-white">Security</h3>
              <p className="text-xs text-surface-500 dark:text-surface-400">Account security settings</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800">
              <p className="text-sm font-medium text-surface-900 dark:text-white">Password</p>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Last changed 30 days ago</p>
            </div>
            <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800">
              <p className="text-sm font-medium text-surface-900 dark:text-white">Session Timeout</p>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Auto-logout after 30 minutes</p>
            </div>
          </div>
        </Card>

        {/* System Info */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 dark:text-white">System Info</h3>
              <p className="text-xs text-surface-500 dark:text-surface-400">Application & database status</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Version', value: 'v1.0.0', icon: Globe },
              { label: 'Database', value: 'PostgreSQL (Supabase)', icon: Database },
              { label: 'Academic Year', value: '2024-25', icon: Clock },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800">
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-surface-400" />
                  <p className="text-sm font-medium text-surface-900 dark:text-white">{item.label}</p>
                </div>
                <p className="text-sm text-surface-500 dark:text-surface-400">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
