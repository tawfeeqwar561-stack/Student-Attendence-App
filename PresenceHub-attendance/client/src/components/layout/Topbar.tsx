import React from 'react';
import { Menu, Bell, Search, Sun, Moon, PanelLeft, PanelLeftClose } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';
import { useAuthStore } from '../../stores/auth.store';
import { useNavigate, useLocation } from 'react-router-dom';

export const Topbar: React.FC = () => {
  const { toggleSidebar, isSidebarCollapsed, toggleCollapse, theme, toggleTheme } = useUI();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Generate simple breadcrumb from path
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumb = pathnames.length > 0 
    ? pathnames.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ')
    : 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 py-3 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-100 dark:border-surface-800 shadow-sm transition-colors duration-200">
      
      {/* Left side: Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800 lg:hidden focus:outline-none transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors"
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
        
        <h2 className="hidden sm:block text-lg font-semibold text-surface-800 dark:text-surface-100">
          {breadcrumb}
        </h2>
      </div>

      {/* Right side: Search, Theme Toggle, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Search */}
        <div className="hidden md:flex items-center px-3 py-1.5 bg-surface-100 dark:bg-surface-800 rounded-full border border-surface-200 dark:border-surface-700">
          <Search className="w-4 h-4 text-surface-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="ml-2 bg-transparent border-none focus:outline-none text-sm text-surface-700 dark:text-surface-200 placeholder-surface-400 w-40"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-full text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-danger ring-2 ring-white dark:ring-surface-900"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-surface-200 dark:sm:border-surface-700">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="hidden lg:block text-sm">
            <p className="font-medium text-surface-800 dark:text-surface-100 leading-tight">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
        </div>
        
      </div>
    </header>
  );
};
