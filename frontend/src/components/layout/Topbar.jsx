import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageToggle from '../ui/LanguageToggle';

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#0E131F]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-500 hover:text-[#1A202C] dark:text-slate-400 dark:hover:text-white rounded-lg lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* User Controls & Profile */}
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <ThemeToggle />
        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
        <Link
          to="/dashboard/profile"
          className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold uppercase shadow-inner">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-[#1A202C] dark:text-slate-200">{user?.name || 'User'}</div>
            <div className="text-[10px] text-[#718096] dark:text-slate-400 font-mono">{user?.role || 'seller'}</div>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
