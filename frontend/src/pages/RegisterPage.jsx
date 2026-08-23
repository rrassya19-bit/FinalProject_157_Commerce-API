import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api/authApi';
import Button from '../components/ui/Button';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const err = {};
    if (!formData.name.trim()) err.name = t('auth.fullName') + ' wajib diisi';
    if (!formData.email.trim()) {
      err.email = t('auth.email') + ' wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      err.email = 'Format email tidak valid';
    }
    if (!formData.password) {
      err.password = t('auth.password') + ' wajib diisi';
    } else if (formData.password.length < 6) {
      err.password = 'Password minimal 6 karakter';
    }
    if (formData.password !== formData.confirmPassword) {
      err.confirmPassword = 'Konfirmasi password tidak cocok';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success(res.data?.message || t('auth.registerSuccess'));
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
      if (msg.toLowerCase().includes('email')) {
        setErrors((prev) => ({ ...prev, email: msg }));
      }
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
            {t('auth.registerTitle')}
          </h2>
          <p className="text-sm text-[#718096] dark:text-slate-400 mt-1">
            {t('auth.registerSubtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {t('auth.fullName')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#F8F9FA] dark:bg-slate-900/90 border border-slate-300/90 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#1A202C] dark:text-slate-200 placeholder-[#A0AEC0] dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
            {errors.name && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.name}</p>}
          </div>

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
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.email}</p>}
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
              />
            </div>
            {errors.password && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {t('auth.confirmPassword')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full bg-[#F8F9FA] dark:bg-slate-900/90 border border-slate-300/90 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#1A202C] dark:text-slate-200 placeholder-[#A0AEC0] dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-6"
            loading={loading}
            icon={ArrowRight}
          >
            {t('auth.btnRegister')}
          </Button>
        </form>

        <p className="text-center text-sm text-[#718096] dark:text-slate-400 mt-6">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            {t('auth.loginHere')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
