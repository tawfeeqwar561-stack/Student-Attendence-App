import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UIContextType {
  // Mobile overlay sidebar (small screens)
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  // Desktop collapsible sidebar (ChatGPT-style)
  isSidebarCollapsed: boolean;
  toggleCollapse: () => void;
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Persist collapsed state in localStorage
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });

  // Try to get theme from localStorage or system preference
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    // Apply theme to document element
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const toggleCollapse = () => {
    setIsSidebarCollapsed(prev => {
      localStorage.setItem('sidebar-collapsed', String(!prev));
      return !prev;
    });
  };

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <UIContext.Provider value={{
      isSidebarOpen, toggleSidebar, closeSidebar,
      isSidebarCollapsed, toggleCollapse,
      theme, toggleTheme,
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
