import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { KeyRound, Package, FolderTree, ArrowUpRight, Activity, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiKeyApi } from '../api/apiKeyApi';
import { produkApi } from '../api/produkApi';
import { kategoriApi } from '../api/kategoriApi';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import IconContainer from '../components/ui/IconContainer';
import { CardSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

const DashboardPage = () => {
  const { user, activeApiKey } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    activeKeys: 0,
    totalProduk: 0,
    totalKategori: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch API Keys
        const keysRes = await apiKeyApi.list().catch(() => ({ data: { data: [] } }));
        const keys = keysRes.data?.data || [];
        const activeCount = keys.filter((k) => k.is_active).length;

        // Fetch Produk & Kategori
        let produkCount = 0;
        let kategoriCount = 0;

        if (activeApiKey) {
          try {
            const [prodRes, katRes] = await Promise.all([
              produkApi.getAll({ limit: 1 }),
              kategoriApi.getAll(),
            ]);
            const prodData = prodRes.data?.data;
            if (prodData && typeof prodData.total === 'number') {
              produkCount = prodData.total;
            } else if (Array.isArray(prodData)) {
              produkCount = prodData.length;
            } else {
              produkCount = prodRes.data?.pagination?.totalItems || 0;
            }
            kategoriCount = katRes.data?.data?.length || 0;
          } catch (_err) {
            // Silently handled fallback
          }
        }

        setStats({
          activeKeys: activeCount,
          totalProduk: produkCount,
          totalKategori: kategoriCount,
        });
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [activeApiKey]);

  const statCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (idx) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        delay: idx * 0.08,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <div className="space-y-8">
      {/* Header Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
            {t('dashboard.welcome')}, <span className="text-indigo-600 dark:text-indigo-400">{user?.name || 'Seller'}</span>!
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/api-keys">
            <Button variant="primary" size="sm" icon={Plus}>
              {t('dashboard.generateKey')}
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Notice if no API key */}
      {!activeApiKey && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
        >
          <div>
            <span className="font-semibold">{t('dashboard.noKeyNotice')}</span>
          </div>
          <Link to="/dashboard/api-keys">
            <Button variant="outline" size="sm" className="border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-500/20">
              {t('dashboard.createKeyBtn')}
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            {/* Stat 1: API Keys */}
            <motion.div
              custom={0}
              variants={statCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card hoverEffect className="relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {t('dashboard.activeKeys')}
                  </span>
                  <IconContainer icon={KeyRound} size="md" className="group-hover:scale-110" />
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-extrabold text-[#0F172A] dark:text-white">
                    {stats.activeKeys}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('dashboard.activeKeysDesc')}</p>
                </div>
                <Link
                  to="/dashboard/api-keys"
                  className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group/link font-medium"
                >
                  <span>{t('dashboard.manageKeys')}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
              </Card>
            </motion.div>

            {/* Stat 2: Produk */}
            <motion.div
              custom={1}
              variants={statCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card hoverEffect className="relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {t('dashboard.totalProducts')}
                  </span>
                  <IconContainer icon={Package} size="md" className="group-hover:scale-110" />
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-extrabold text-[#0F172A] dark:text-white">
                    {stats.totalProduk}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('dashboard.totalProductsDesc')}</p>
                </div>
                <Link
                  to="/dashboard/produk"
                  className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group/link font-medium"
                >
                  <span>{t('dashboard.viewProducts')}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
              </Card>
            </motion.div>

            {/* Stat 3: Kategori */}
            <motion.div
              custom={2}
              variants={statCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card hoverEffect className="relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {t('dashboard.totalCategories')}
                  </span>
                  <IconContainer icon={FolderTree} size="md" className="group-hover:scale-110" />
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-extrabold text-[#0F172A] dark:text-white">
                    {stats.totalKategori}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('dashboard.totalCategoriesDesc')}</p>
                </div>
                <Link
                  to="/dashboard/kategori"
                  className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group/link font-medium"
                >
                  <span>{t('dashboard.manageCategories')}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
              </Card>
            </motion.div>
          </>
        )}
      </div>

      {/* Quick Guide / Info - Standardized Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card variant="default" className="space-y-4">
          <div className="flex items-start gap-4">
            <IconContainer icon={Activity} size="md" />
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">{t('dashboard.flowTitle')}</h3>
              <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-1">
                <p>1. {t('dashboard.flowStep1')}</p>
                <p>2. {t('dashboard.flowStep2')}</p>
                <p>3. {t('dashboard.flowStep3')}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
