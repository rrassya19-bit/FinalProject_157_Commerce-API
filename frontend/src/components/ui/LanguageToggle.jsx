import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageToggle = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'id';

  const toggleLanguage = () => {
    const nextLang = currentLang.startsWith('id') ? 'en' : 'id';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('commerce_lang', nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 dark:bg-slate-800/80 dark:border-slate-700/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
      } ${className}`}
      title={currentLang.startsWith('id') ? 'Ganti ke English' : 'Switch to Bahasa Indonesia'}
    >
      <Languages className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
      <span>{currentLang.startsWith('id') ? 'ID' : 'EN'}</span>
    </button>
  );
};

export default LanguageToggle;
