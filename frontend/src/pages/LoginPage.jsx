import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Layers, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired')) {
      toast.error(t('auth.sessionExpired'));
    }
  }, [location, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.email || !formData.password) {
      setErrorMsg(t('auth.email') + ' & ' + t('auth.password') + ' wajib diisi');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.login(formData);
      const data = res.data?.data;

      if (data?.token && data?.user) {
        login(data.user, data.token);
        toast.success(`${t('auth.loginSuccess')}, ${data.user.name}!`);
        navigate('/dashboard');
      } else {
        throw new Error('Respon login tidak valid');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Email atau password salah. Periksa kembali akun Anda.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-8 shadow-md dark:shadow-2xl dark:shadow-black/40 text-[#2D3748] dark:text-slate-100"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 dark:bg-indigo-600/20 dark:border-indigo-500/30 dark:text-indigo-400 mb-4 shadow-2xs">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A202C] dark:text-white tracking-tight">
            {t('auth.loginTitle')}
          </h2>
          <p className="text-sm text-[#718096] dark:text-slate-400 mt-1">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="nama@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#F8F9FA] dark:bg-slate-900/90 border border-slate-300/90 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#1A202C] dark:text-slate-200 placeholder-[#A0AEC0] dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#F8F9FA] dark:bg-slate-900/90 border border-slate-300/90 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#1A202C] dark:text-slate-200 placeholder-[#A0AEC0] dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-6"
            loading={loading}
            icon={LogIn}
          >
            {t('auth.btnLogin')}
          </Button>
        </form>

        <p className="text-center text-sm text-[#718096] dark:text-slate-400 mt-6">
          {t('auth.dontHaveAccount')}{' '}
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            {t('auth.registerHere')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
