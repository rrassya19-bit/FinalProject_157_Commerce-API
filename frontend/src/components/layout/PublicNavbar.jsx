import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LogIn, UserPlus, Terminal, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageToggle from '../ui/LanguageToggle';

const PublicNavbar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-[#F8F9FA]/80 dark:bg-[#0B0F17]/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/CommerceIcon.svg"
            alt="CommerceAPI Logo"
            className="w-9 h-9 rounded-xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform border border-indigo-500/20 dark:border-indigo-400/20"
          />
          <span className="font-bold text-lg tracking-tight text-[#1A202C] dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            Commerce<span className="text-indigo-600 dark:text-indigo-400">API</span>
          </span>
        </Link>

        {/* Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            to="/"
            className={`transition-colors font-medium ${
              location.pathname === '/'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-[#4A5568] dark:text-slate-400 hover:text-[#1A202C] dark:hover:text-slate-200'
            }`}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/docs"
            className={`flex items-center gap-1.5 transition-colors font-medium ${
              location.pathname === '/docs'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-[#4A5568] dark:text-slate-400 hover:text-[#1A202C] dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {t('nav.docs')}
          </Link>
          <Link
            to="/docs/playground"
            className={`flex items-center gap-1.5 transition-colors font-medium ${
              location.pathname === '/docs/playground'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-[#4A5568] dark:text-slate-400 hover:text-[#1A202C] dark:hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            {t('nav.playground')}
          </Link>
        </nav>

        {/* Action Controls & CTA */}
        <div className="flex items-center gap-2.5">
          <LanguageToggle />
          <ThemeToggle />
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" icon={LogIn}>
                {t('nav.login')}
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" icon={UserPlus}>
                {t('nav.getStarted')}
              </Button>
            </Link>
          </div>

          {/* Hamburger Button for Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#4A5568] dark:text-slate-400 hover:text-[#1A202C] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 md:hidden transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-md px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-indigo-50 dark:bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-[#4A5568] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === '/docs'
                  ? 'bg-indigo-50 dark:bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-[#4A5568] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {t('nav.docs')}
            </Link>
            <Link
              to="/docs/playground"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === '/docs/playground'
                  ? 'bg-indigo-50 dark:bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-[#4A5568] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <Terminal className="w-4 h-4" />
              {t('nav.playground')}
            </Link>
          </nav>

          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col gap-2">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" size="sm" className="w-full" icon={LogIn}>
                {t('nav.login')}
              </Button>
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="sm" className="w-full" icon={UserPlus}>
                {t('nav.getStarted')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
