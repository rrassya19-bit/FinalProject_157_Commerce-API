import React from 'react';
import { Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PublicFooter = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17] py-10 text-[#718096] dark:text-slate-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/10 dark:bg-indigo-600/30 border border-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
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
