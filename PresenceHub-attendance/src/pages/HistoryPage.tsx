import React, { useState, useEffect } from 'react';
import { Search, Download, FileSpreadsheet } from 'lucide-react';
import { StudentStats } from '../types';
import { formatPercentage, cn } from '../utils/utils';

export const HistoryPage: React.FC = () => {
  const [stats, setStats] = useState<StudentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/stats/summary')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  const filteredStats = stats.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.roll_number.toLowerCase().includes(search.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ['Roll Number', 'Name', 'Present Days', 'Total Days', 'Percentage'];
    const rows = stats.map(s => [
      s.roll_number,
      s.name,
      s.present_count,
      s.total_days,
      `${formatPercentage(s.present_count, s.total_days)}%`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance History</h1>
          <p className="text-muted mt-1">View overall performance and export reports</p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 flex items-center gap-2 transition-all shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4" /> Export CSV
        </button>
      </header>

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
                <th className="px-6 py-4">Present</th>
                <th className="px-6 py-4">Total Days</th>
                <th className="px-6 py-4 text-right">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted">Loading...</td></tr>
              ) : filteredStats.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted">No records found.</td></tr>
              ) : (
                filteredStats.map((s) => {
                  const percentage = formatPercentage(s.present_count, s.total_days);
                  return (
                    <tr key={s.id} className="hover:bg-[#f9f9f9] transition-colors">
                      <td className="px-6 py-4 font-mono text-sm">{s.roll_number}</td>
                      <td className="px-6 py-4 font-medium">{s.name}</td>
                      <td className="px-6 py-4">
                        <span className="text-emerald-600 font-bold">{s.present_count}</span>
                      </td>
                      <td className="px-6 py-4 text-muted">{s.total_days}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <div className="w-24 h-2 bg-black/5 rounded-full overflow-hidden hidden sm:block">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                percentage >= 75 ? "bg-emerald-500" : percentage >= 50 ? "bg-amber-500" : "bg-red-500"
                              )}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className={cn(
                            "font-bold text-sm min-w-[3rem] text-right",
                            percentage >= 75 ? "text-emerald-600" : percentage >= 50 ? "text-amber-600" : "text-red-600"
                          )}>
                            {percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
