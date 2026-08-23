import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="text-8xl font-black text-indigo-500/15 font-mono tracking-tighter">
          404
        </div>
        <h1 className="text-2xl font-bold text-[#1A202C] dark:text-white tracking-tight">
          {t('notFound.title')}
        </h1>
        <p className="text-sm text-[#718096] dark:text-slate-400 leading-relaxed">
          {t('notFound.desc')}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/dashboard">
            <Button variant="primary" icon={Home}>
              {t('notFound.toDashboard')}
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" icon={ArrowLeft}>
              {t('notFound.toHome')}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
