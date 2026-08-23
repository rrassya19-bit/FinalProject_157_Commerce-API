import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

/**
 * Standardized Card Component
 * Variants:
 *  - default: elevated standard container with consistent border and dark background
 *  - subtle: inner card layer / secondary container
 *  - code: terminal/code panel style
 */
const Card = ({
  children,
  variant = 'default', // 'default' | 'subtle' | 'code'
  className = '',
  hoverEffect = false,
  onClick,
  ...props
}) => {
  const Component = hoverEffect ? motion.div : 'div';

  const variantMap = {
    default:
      'bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs dark:shadow-md transition-all duration-200',
    subtle:
      'bg-[#F8F9FA] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 transition-all duration-200',
    code:
      'bg-[#0A0E17] dark:bg-[#070A10] border border-slate-800 rounded-2xl p-6 font-mono shadow-md text-slate-300 transition-all duration-200',
  };

  const hoverClass = hoverEffect
    ? 'hover:border-indigo-300 dark:hover:border-slate-700 hover:shadow-md dark:hover:shadow-indigo-950/20'
    : '';

  const hoverProps = hoverEffect
    ? {
        whileHover: { y: -3, scale: 1.012, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={twMerge(variantMap[variant] || variantMap.default, hoverClass, className)}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;

