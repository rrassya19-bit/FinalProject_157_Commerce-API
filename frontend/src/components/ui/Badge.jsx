import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Standardized Badge Component
 * Variants:
 *  - status: Semantic status badges (success, auth, info, neutral, danger)
 *  - section: Uppercase tag badge for section headers / categories
 *  - outline: Subtle border badge for metadata
 */
export const Badge = ({
  children,
  variant = 'status', // 'status' | 'section' | 'outline'
  tone = 'primary', // 'primary' | 'success' | 'auth' | 'info' | 'neutral' | 'danger'
  size = 'md', // 'sm' | 'md'
  icon: Icon,
  className = '',
  ...props
}) => {
  const toneMap = {
    primary: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/25 dark:text-indigo-400',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400',
    auth: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/25 dark:text-indigo-400',
    info: 'bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-500/10 dark:border-sky-500/25 dark:text-sky-400',
    neutral: 'bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300',
    danger: 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/25 dark:text-rose-400',
  };

  const sizeMap = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
  };

  const variantStyles = {
    section: 'rounded-full font-semibold uppercase tracking-wider border shadow-2xs',
    status: 'rounded-full font-medium font-mono border',
    outline: 'rounded-lg font-mono border bg-transparent',
  };

  return (
    <span
      className={twMerge(
        'inline-flex items-center justify-center shrink-0 transition-colors',
        sizeMap[size],
        variantStyles[variant] || variantStyles.status,
        toneMap[tone] || toneMap.primary,
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
