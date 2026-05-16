import React, { useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/shared/Card';
import { useFacultyStore } from '../../stores/faculty.store';
import { Loader2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageDiscipline: React.FC = () => {
  const { fileDiscipline } = useFacultyStore();
  const [studentId, setStudentId] = useState('');
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('WARNING');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !description) return toast.error('Please fill all required fields');

    setIsSubmitting(true);
    try {
      await fileDiscipline({ studentId, description, actionTaken, incidentDate });
      toast.success('Discipline record filed successfully');
      setStudentId('');
      setDescription('');
    } catch (err) {
      // error handled by store
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Discipline Records" 
        subtitle="File a disciplinary action or warning for a student."
      />

      <div className="max-w-2xl">
        <Card className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Student ID (UUID)
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. 123e4567-e89b-..."
                className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Incident Date
              </label>
              <input
                type="date"
                required
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Action Taken
              </label>
              <select
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary-500"
              >
                <option value="WARNING">Warning</option>
                <option value="FINE">Fine</option>
                <option value="SUSPENSION">Suspension</option>
                <option value="EXPULSION">Expulsion</option>
                <option value="COMMUNITY_SERVICE">Community Service</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed information about the incident..."
                className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                File Record
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
