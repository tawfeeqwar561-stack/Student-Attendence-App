import React from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/shared/Card';
import { Bell, Info, AlertTriangle, Megaphone } from 'lucide-react';

const sampleNotifications = [
  { id: '1', title: 'Fee Payment Reminder', message: 'Lab fee of ₹5,000 is pending for Semester 3.', type: 'WARNING', time: '2 hours ago' },
  { id: '2', title: 'Midterm Results Published', message: 'Your midterm results for CS301 are now available.', type: 'INFO', time: '1 day ago' },
  { id: '3', title: 'Attendance Alert', message: 'Your attendance in OS is below 75%. Please attend regularly.', type: 'URGENT', time: '2 days ago' },
  { id: '4', title: 'System Maintenance', message: 'The portal will be down for maintenance this Saturday 2 AM - 4 AM.', type: 'ANNOUNCEMENT', time: '3 days ago' },
  { id: '5', title: 'New Course Material', message: 'New study material uploaded for Database Management Systems.', type: 'INFO', time: '5 days ago' },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    case 'URGENT': return <AlertTriangle className="w-5 h-5 text-red-500" />;
    case 'ANNOUNCEMENT': return <Megaphone className="w-5 h-5 text-violet-500" />;
    default: return <Info className="w-5 h-5 text-blue-500" />;
  }
};

const getBg = (type: string) => {
  switch (type) {
    case 'WARNING': return 'border-l-amber-400 bg-amber-50/50 dark:bg-amber-950/20';
    case 'URGENT': return 'border-l-red-400 bg-red-50/50 dark:bg-red-950/20';
    case 'ANNOUNCEMENT': return 'border-l-violet-400 bg-violet-50/50 dark:bg-violet-950/20';
    default: return 'border-l-blue-400 bg-blue-50/50 dark:bg-blue-950/20';
  }
};

export const NotificationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with important announcements and alerts."
        action={
          <button className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-xl transition-colors">
            Mark all as read
          </button>
        }
      />

      <div className="space-y-3 stagger-children">
        {sampleNotifications.map((notif) => (
          <Card key={notif.id} className={`p-4 border-l-4 ${getBg(notif.type)} hover:shadow-card-hover transition-shadow duration-300`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-surface-900 dark:text-white">{notif.title}</h4>
                  <span className="text-xs text-surface-400 dark:text-surface-500 flex-shrink-0">{notif.time}</span>
                </div>
                <p className="text-sm text-surface-600 dark:text-surface-300 mt-1">{notif.message}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
