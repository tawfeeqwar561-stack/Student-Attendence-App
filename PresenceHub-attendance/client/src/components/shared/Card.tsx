import React, { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, noPadding = false }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-surface-900 rounded-xl shadow-card border border-surface-100 dark:border-surface-800 transition-colors duration-200',
        !noPadding && 'p-5 lg:p-6',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ title: string; subtitle?: string; action?: ReactNode; className?: string }> = ({
  title,
  subtitle,
  action,
  className
}) => (
  <div className={cn('flex items-center justify-between mb-4', className)}>
    <div>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{title}</h3>
      {subtitle && <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
