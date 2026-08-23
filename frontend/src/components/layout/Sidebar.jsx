import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  KeyRound,
  Package,
  FolderTree,
  User,
  BookOpen,
  Layers,
  Terminal
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { t } = useTranslation();

  const mainNav = [
    { name: t('nav.dashboard'), path: '/dashboard', icon: LayoutDashboard, end: true },
    { name: t('nav.apiKeys'), path: '/dashboard/api-keys', icon: KeyRound },
    { name: t('nav.products'), path: '/dashboard/produk', icon: Package },
    { name: t('nav.categories'), path: '/dashboard/kategori', icon: FolderTree },
    { name: t('nav.profile'), path: '/dashboard/profile', icon: User },
  ];

  const docNav = [
    { name: t('nav.docs'), path: '/docs', icon: BookOpen },
    { name: t('nav.playground'), path: '/docs/playground', icon: Terminal },
  ];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-indigo-50 dark:bg-indigo-600/15 text-indigo-700 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-500/30 font-semibold'
        : 'text-[#4A5568] dark:text-slate-400 hover:text-[#1A202C] dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 dark:bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-[#0E131F] border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col transition-all duration-200 lg:translate-x-0 shadow-xs dark:shadow-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-bold text-base tracking-tight text-[#1A202C] dark:text-white">
            Commerce<span className="text-indigo-600 dark:text-indigo-400">API</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#718096] dark:text-slate-500 px-3 mb-2">
              {t('nav.management')}
            </div>
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setIsMobileOpen(false)}
                    className={navLinkClass}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#718096] dark:text-slate-500 px-3 mb-2">
              {t('nav.developerHub')}
            </div>
            <nav className="space-y-1">
              {docNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={navLinkClass}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Card footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-[#F8F9FA] dark:bg-[#0A0E17]/60">
          <div className="text-xs text-[#718096] dark:text-slate-500 flex items-center justify-between">
            <span>{t('nav.env')}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono border border-emerald-200/80 dark:border-emerald-500/20">
              {t('nav.liveApi')}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
