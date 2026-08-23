import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800/80 rounded-lg ${className}`} />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800/80 rounded-xl p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-4 w-40" />
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full space-y-3">
      {/* Header Skeleton */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-slate-100 dark:bg-slate-850/50 rounded-lg border border-slate-200 dark:border-slate-800/60">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-24" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="grid grid-cols-4 gap-4 p-4 bg-white dark:bg-[#111622] rounded-lg border border-slate-200 dark:border-slate-800/40"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
};
