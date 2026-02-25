import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, UserPlus, GraduationCap } from 'lucide-react';
import { Student } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', roll_number: '', class_name: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await fetch('/api/students');
    const data = await res.json();
    setStudents(data);
    setLoading(false);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent),
    });
    if (res.ok) {
      fetchStudents();
      setIsModalOpen(false);
      setNewStudent({ name: '', roll_number: '', class_name: '' });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure? All attendance records for this student will be deleted.')) {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      fetchStudents();
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.roll_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted mt-1">Add, view, and manage your students</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-black/90 flex items-center gap-2 transition-all shadow-sm"
        >
          <UserPlus className="w-4 h-4" /> Add New Student
        </button>
      </header>

      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-black/5 bg-[#f9f9f9]">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
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
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-muted">Loading...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-muted">No students found.</td></tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-[#f9f9f9] transition-colors group">
                    <td className="px-6 py-4 font-mono text-sm">{student.roll_number}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black/5 rounded-full flex items-center justify-center text-black font-bold text-xs">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-black/5 px-2.5 py-1 rounded-lg text-xs font-medium">
                        {student.class_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-black/5"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                  <GraduationCap className="text-white w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold">Add New Student</h2>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5 ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full bg-[#f9f9f9] border border-black/5 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5 ml-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={newStudent.roll_number}
                    onChange={e => setNewStudent({ ...newStudent, roll_number: e.target.value })}
                    className="w-full bg-[#f9f9f9] border border-black/5 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="S101"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5 ml-1">Class</label>
                  <input
                    type="text"
                    required
                    value={newStudent.class_name}
                    onChange={e => setNewStudent({ ...newStudent, class_name: e.target.value })}
                    className="w-full bg-[#f9f9f9] border border-black/5 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="Grade 10-A"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl text-sm font-medium border border-black/5 hover:bg-black/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-black/90 transition-all shadow-md"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
