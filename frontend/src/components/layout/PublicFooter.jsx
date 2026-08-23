import React from 'react';
import { useTranslation } from 'react-i18next';

const PublicFooter = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17] py-10 text-[#718096] dark:text-slate-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <img
            src="/CommerceIcon.svg"
            alt="CommerceAPI Logo"
            className="w-7 h-7 rounded-lg shadow-xs border border-indigo-500/20 dark:border-indigo-400/20"
          />
          <span className="font-semibold text-[#1A202C] dark:text-white">CommerceAPI</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="text-[#718096] dark:text-slate-500 text-xs sm:text-sm">{t('footer.tagline')}</span>
        </div>

        <p className="text-xs text-[#A0AEC0] dark:text-slate-500">
          &copy; {new Date().getFullYear()} {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
};

export default PublicFooter;
