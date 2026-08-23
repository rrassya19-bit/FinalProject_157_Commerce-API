import React from 'react';
import { LogOut, KeyRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout, activeApiKey, userApiKeys } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success(t('profile.logoutToast'));
    navigate('/login');
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">{t('profile.title')}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {t('profile.subtitle')}
        </p>
      </div>

      {/* User Card */}
      <Card variant="default">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold uppercase shadow-md shadow-indigo-500/20 shrink-0">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>

          <div className="flex-1 space-y-4 text-center sm:text-left w-full">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">{user?.name || 'Seller'}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{user?.email || 'email@domain.com'}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Card variant="subtle" className="p-3">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  {t('profile.role')}
                </span>
                <span className="text-sm font-semibold text-[#0F172A] dark:text-slate-200 uppercase mt-0.5 inline-block font-mono">
                  {user?.role || 'seller'}
                </span>
              </Card>

              <Card variant="subtle" className="p-3">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  {t('profile.totalKeys')}
                </span>
                <span className="text-sm font-semibold text-[#0F172A] dark:text-slate-200 mt-0.5 inline-block">
                  {userApiKeys.length} Keys
                </span>
              </Card>
            </div>
          </div>
        </div>
      </Card>

      {/* Active Key Info */}
      <Card variant="default">
        <div className="flex items-center gap-3 mb-4">
          <KeyRound className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-semibold text-[#0F172A] dark:text-white">{t('profile.activeKeyStatus')}</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          {t('profile.activeKeyDesc')}
        </p>

        {activeApiKey ? (
          <Card variant="subtle" className="p-3 flex items-center justify-between">
            <code className="text-xs font-mono text-indigo-700 dark:text-indigo-300">
              {activeApiKey.substring(0, 12)}••••••••••••{activeApiKey.substring(activeApiKey.length - 4)}
            </code>
            <Badge variant="status" tone="success" size="sm">
              Active
            </Badge>
          </Card>
        ) : (
          <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs rounded-lg">
            {t('profile.noActiveKey')}
          </div>
        )}
      </Card>

      {/* Logout Action */}
      <Card variant="default" className="border-rose-200 dark:border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-rose-800 dark:text-rose-300">{t('profile.logoutTitle')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('profile.logoutDesc')}
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            icon={LogOut}
            onClick={handleLogout}
          >
            {t('profile.logoutBtn')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
