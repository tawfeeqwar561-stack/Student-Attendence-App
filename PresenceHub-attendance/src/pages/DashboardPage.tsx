import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StudentStats } from '../types';
import { formatPercentage, cn } from '../utils/utils';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<StudentStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats/summary')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  const totalStudents = stats.length;
  const overallAttendance = stats.length > 0
    ? Math.round(stats.reduce((acc, s) => acc + formatPercentage(s.present_count, s.total_days), 0) / stats.length)
    : 0;

  const chartData = stats.map(s => ({
    name: s.name,
    percentage: formatPercentage(s.present_count, s.total_days)
  })).slice(0, 10); // Show top 10 for chart

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted mt-1">Overview of school attendance performance</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={Users} 
          label="Total Students" 
          value={totalStudents.toString()} 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Avg. Attendance" 
          value={`${overallAttendance}%`} 
          color="bg-emerald-500" 
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Active Classes" 
          value="12" 
          color="bg-violet-500" 
        />
        <StatCard 
          icon={XCircle} 
          label="Low Attendance" 
          value={stats.filter(s => formatPercentage(s.present_count, s.total_days) < 75).length.toString()} 
          color="bg-red-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Attendance by Student (%)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: '#f9f9f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.percentage >= 75 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Recent Low Attendance</h3>
          <div className="space-y-4">
            {stats
              .filter(s => formatPercentage(s.present_count, s.total_days) < 75)
              .slice(0, 5)
              .map(student => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-[#f9f9f9] rounded-2xl">
                  <div>
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted">Roll: {student.roll_number}</p>
                  </div>
                  <span className="text-red-500 font-bold text-sm">
                    {formatPercentage(student.present_count, student.total_days)}%
                  </span>
                </div>
              ))}
            {stats.filter(s => formatPercentage(s.present_count, s.total_days) < 75).length === 0 && (
              <p className="text-sm text-muted text-center py-8">All students are above 75%!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex items-center gap-4"
  >
    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white", color)}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
    </div>
  </motion.div>
);
