import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Standardized IconContainer Component
 * Provides a unified container styling across feature cards, steps, and headers.
 * Uses a single brand purple/indigo palette with consistent border, background, and sizing.
 */
export const IconContainer = ({
  icon: Icon,
  children,
  size = 'md', // 'sm' | 'md' | 'lg'
  tone = 'primary', // 'primary' | 'subtle'
  className = '',
  ...props
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 rounded-lg text-sm',
    md: 'w-11 h-11 rounded-xl text-base',
    lg: 'w-12 h-12 rounded-xl text-lg',
  };

  const toneMap = {
    primary: 'bg-indigo-50 border border-indigo-200/80 text-indigo-600 dark:bg-indigo-600/10 dark:border-indigo-500/25 dark:text-indigo-400',
    subtle: 'bg-slate-100 border border-slate-200/80 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300',
  };

  return (
    <div
      className={twMerge(
        'flex items-center justify-center shrink-0 shadow-2xs font-mono font-bold transition-all duration-200',
        sizeMap[size],
        toneMap[tone],
        className
      )}
      {...props}
    >
      {Icon ? <Icon className="w-5 h-5" /> : children}
    </div>
  );
};

export default IconContainer;
