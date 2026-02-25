import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Check, X, Save, Search } from 'lucide-react';
import { AttendanceRecord } from '../types';
import { cn } from '../utils/utils';
import { motion } from 'motion/react';

export const AttendancePage: React.FC = () => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?date=${date}`);
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (studentId: number, status: 'present' | 'absent') => {
    setRecords(prev => prev.map(r => 
      r.student_id === studentId ? { ...r, status } : r
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = records.map(r => ({
        student_id: r.student_id,
        status: r.status || 'absent' // Default to absent if not marked
      }));
      const res = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, records: payload }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Attendance saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save attendance.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const filteredRecords = records.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.roll_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mark Attendance</h1>
          <p className="text-muted mt-1">Select date and mark student presence</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white border border-black/5 rounded-xl py-2 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving || records.length === 0}
            className="bg-black text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-black/90 disabled:opacity-50 flex items-center gap-2 transition-all"
          >
            {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </header>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 rounded-2xl mb-6 text-sm font-medium flex items-center gap-2",
            message.type === 'success' ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          )}
        >
          {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {message.text}
        </motion.div>
      )}

      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-black/5 bg-[#f9f9f9]">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-black/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9f9f9] text-xs font-semibold uppercase tracking-wider text-muted">
                <th className="px-6 py-4">Roll No.</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-muted">Loading students...</td></tr>
              ) : filteredRecords.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-muted">No students found.</td></tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.student_id} className="hover:bg-[#f9f9f9] transition-colors">
                    <td className="px-6 py-4 font-mono text-sm">{record.roll_number}</td>
                    <td className="px-6 py-4 font-medium">{record.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => toggleStatus(record.student_id, 'present')}
                          className={cn(
                            "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                            record.status === 'present'
                              ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                              : "bg-white text-muted border-black/5 hover:border-emerald-500 hover:text-emerald-500"
                          )}
                        >
                          <Check className="w-3 h-3" /> Present
                        </button>
                        <button
                          onClick={() => toggleStatus(record.student_id, 'absent')}
                          className={cn(
                            "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                            record.status === 'absent'
                              ? "bg-red-500 text-white border-red-500 shadow-sm"
                              : "bg-white text-muted border-black/5 hover:border-red-500 hover:text-red-500"
                          )}
                        >
                          <X className="w-3 h-3" /> Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
