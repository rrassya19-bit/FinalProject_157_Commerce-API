import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary', // primary | secondary | danger | ghost | outline
  size = 'md', // sm | md | lg
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0B0F17] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer group relative overflow-hidden';

  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-500/35 focus:ring-indigo-500',
    secondary: 'bg-slate-100 hover:bg-slate-200/90 text-slate-800 border border-slate-300/80 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 focus:ring-slate-400 dark:focus:ring-slate-600 shadow-2xs hover:shadow-xs',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 hover:shadow-lg hover:shadow-rose-500/35 focus:ring-rose-500',
    ghost: 'text-slate-600 hover:text-[#1A202C] hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60 focus:ring-slate-400 dark:focus:ring-slate-700',
    outline: 'border border-indigo-500/40 text-indigo-600 hover:bg-indigo-50/80 dark:text-indigo-400 dark:hover:bg-indigo-500/10 dark:border-indigo-500/60 focus:ring-indigo-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5',
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.025 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.975 } : undefined}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {Icon && (
            <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
          )}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
};

export default Button;
