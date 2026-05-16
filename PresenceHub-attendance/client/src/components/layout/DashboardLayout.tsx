// ============================================
// Dashboard Layout — Dynamic Sidebar + Content
// ============================================

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, SIDEBAR_WIDTH_EXPANDED, SIDEBAR_WIDTH_COLLAPSED } from './Sidebar';
import { Topbar } from './Topbar';
import { UIProvider, useUI } from '../../contexts/UIContext';

const LayoutInner: React.FC = () => {
  const { isSidebarCollapsed } = useUI();
  const marginLeft = isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors duration-200">
      <Sidebar />
      {/* Main content — margin adjusts dynamically with the sidebar */}
      <div
        className="flex flex-col min-h-screen transition-all duration-300 ease-in-out"
        style={{ marginLeft: `${marginLeft}px` }}
      >
        <Topbar />
        <main className="flex-1 p-4 lg:p-6 xl:p-8 overflow-y-auto animate-fadeIn">
          <Outlet />
        </main>
      </div>
      {/* Mobile: no margin, sidebar is an overlay */}
      <style>{`
        @media (max-width: 1023px) {
          div[style*="margin-left"] {
            margin-left: 0px !important;
          }
        }
      `}</style>
    </div>
  );
};

export const DashboardLayout: React.FC = () => {
  return (
    <UIProvider>
      <LayoutInner />
    </UIProvider>
  );
};
