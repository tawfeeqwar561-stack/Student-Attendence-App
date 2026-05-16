// ============================================
// Sidebar — ChatGPT-style Collapsible Navigation
// ============================================

import React, { useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, GraduationCap, X, PanelLeftClose, PanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../../stores/auth.store';
import { authApi } from '../../api/auth.api';
import { getNavigationForRole } from '../../constants/navigation';
import { Role } from '@college-erp/shared';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { useUI } from '../../contexts/UIContext';

export const SIDEBAR_WIDTH_EXPANDED = 256; // 16rem = w-64
export const SIDEBAR_WIDTH_COLLAPSED = 64; // 4rem = w-16

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarOpen, closeSidebar, isSidebarCollapsed, toggleCollapse } = useUI();

  // Close mobile overlay on navigation
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  if (!user) return null;

  const navigation = getNavigationForRole(user.role as Role);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if API fails, clear local state
    }
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const roleLabel = user.role === 'ADMIN' ? 'Administrator' : user.role === 'FACULTY' ? 'Faculty' : 'Student';
  const roleColor = user.role === 'ADMIN'
    ? 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'
    : user.role === 'FACULTY'
    ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
    : 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400';

  // ---- Sidebar content (used in both desktop & mobile) ----
  const sidebarContent = (collapsed: boolean) => (
    <aside
      className={cn(
        'h-full flex flex-col bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 transition-all duration-300 ease-in-out overflow-hidden',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* ---- Logo Area ---- */}
      <div className={cn(
        'flex items-center border-b border-surface-100 dark:border-surface-800 flex-shrink-0',
        collapsed ? 'justify-center px-2 py-5' : 'justify-between gap-3 px-5 py-5'
      )}>
        {collapsed ? (
          <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-surface-900 dark:text-white leading-tight whitespace-nowrap">College ERP</h1>
                <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap', roleColor)}>
                  {roleLabel}
                </span>
              </div>
            </div>
            {/* Close button (mobile only) */}
            <button
              onClick={closeSidebar}
              className="lg:hidden p-1 rounded-md text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* ---- Collapse toggle (desktop only) ---- */}
      <div className={cn(
        'hidden lg:flex items-center px-3 py-2 border-b border-surface-100 dark:border-surface-800 flex-shrink-0',
        collapsed ? 'justify-center' : 'justify-end'
      )}>
        <button
          onClick={toggleCollapse}
          className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-600 dark:hover:text-surface-200 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* ---- Navigation ---- */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4 custom-scrollbar">
        {navigation.map((section, sIdx) => (
          <div key={sIdx}>
            {section.title && !collapsed && (
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 whitespace-nowrap">
                {section.title}
              </p>
            )}
            {section.title && collapsed && (
              <div className="w-8 mx-auto my-2 border-t border-surface-200 dark:border-surface-700" />
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center rounded-lg text-sm font-medium transition-all duration-200 group relative',
                        collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5',
                        isActive
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 shadow-sm'
                          : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800/50 dark:hover:text-white'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={cn(
                            'w-[18px] h-[18px] flex-shrink-0',
                            isActive ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400 dark:text-surface-500'
                          )}
                        />
                        {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                        {!collapsed && item.badge && item.badge > 0 && (
                          <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold bg-danger text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {/* Tooltip on collapsed state */}
                        {collapsed && (
                          <span className="absolute left-full ml-2 px-2.5 py-1 text-xs font-medium bg-surface-900 text-white dark:bg-surface-100 dark:text-surface-900 rounded-md shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                            {item.label}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* ---- User Profile + Logout ---- */}
      <div className="border-t border-surface-100 dark:border-surface-800 px-2 py-3 mt-auto flex-shrink-0">
        <div className={cn(
          'flex items-center gap-2 px-2 py-2',
          collapsed ? 'flex-col' : 'flex-row'
        )}>
          <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[11px] text-surface-500 dark:text-surface-400 truncate">{user.email}</p>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="p-2 rounded-lg text-surface-400 hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex-shrink-0"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar — always visible, collapsible */}
      <div
        className="hidden lg:block fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out"
        style={{ width: isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED }}
      >
        {sidebarContent(isSidebarCollapsed)}
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              {sidebarContent(false)}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
