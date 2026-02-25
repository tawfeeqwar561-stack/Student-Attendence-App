import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardCheck, History, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/utils';

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/attendance', icon: ClipboardCheck, label: 'Mark Attendance' },
    { to: '/students', icon: Users, label: 'Students' },
    { to: '/history', icon: History, label: 'History' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-black/5 flex flex-col p-4 fixed left-0 top-0">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">E</span>
        </div>
        <span className="font-bold text-xl tracking-tight">EduTrack</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive 
                  ? "bg-black text-white shadow-md" 
                  : "text-muted hover:bg-black/5 hover:text-black"
              )
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-auto"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
};
