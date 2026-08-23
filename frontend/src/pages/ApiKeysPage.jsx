import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  KeyRound,
  Plus,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { apiKeyApi } from '../api/apiKeyApi';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import { TableSkeleton } from '../components/ui/Skeleton';

const ApiKeysPage = () => {
  const { refreshApiKeys, activeApiKey, setActiveApiKey } = useAuth();
  const { t } = useTranslation();

  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [createdKeyData, setCreatedKeyData] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Copied state
  const [copiedKey, setCopiedKey] = useState(null);

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const res = await apiKeyApi.list();
      setKeys(res.data?.data || []);
      await refreshApiKeys();
    } catch (err) {
      toast.error('Gagal mengambil daftar API key');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCopy = (text, keyId) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    toast.success(t('apiKeys.copied'));
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newKeyLabel.trim()) {
      toast.error('Label API key wajib diisi');
      return;
    }

    try {
      setCreateLoading(true);
      const res = await apiKeyApi.create({ label: newKeyLabel });
      const newKey = res.data?.data;

      setCreatedKeyData(newKey);
      setNewKeyLabel('');
      await fetchKeys();
      if (newKey?.api_key) {
        setActiveApiKey(newKey.api_key);
      }
      toast.success(t('apiKeys.keyCreatedToast'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membuat API Key');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      await apiKeyApi.delete(deleteTarget.id);
      toast.success(t('apiKeys.keyDeletedToast'));
      if (activeApiKey === deleteTarget.api_key) {
        setActiveApiKey(null);
      }
      setDeleteTarget(null);
      await fetchKeys();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus API Key');
    } finally {
      setDeleteLoading(false);
    }
  };

  const maskKey = (key) => {
    if (!key || key.length < 12) return key;
    return `${key.substring(0, 8)}••••••••••••${key.substring(key.length - 4)}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-[#1A202C] dark:text-white tracking-tight">{t('apiKeys.title')}</h1>
          <p className="text-sm text-[#718096] dark:text-slate-400 mt-1">
            {t('apiKeys.subtitle')}
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setCreatedKeyData(null);
            setIsCreateOpen(true);
          }}
        >
          {t('apiKeys.generateBtn')}
        </Button>
      </div>

      {/* Warning Banner */}
      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-500/20 text-indigo-900 dark:text-indigo-300 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-xs sm:text-sm">
          {t('apiKeys.bannerText')}
        </p>
      </div>

      {/* Keys List */}
      {loading ? (
        <TableSkeleton rows={4} cols={4} />
      ) : keys.length === 0 ? (
        <Card className="text-center py-12 border-dashed border-slate-300/80 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto text-[#718096] dark:text-slate-400 mb-4">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#1A202C] dark:text-white">{t('apiKeys.noKeys')}</h3>
          <p className="text-sm text-[#718096] dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            {t('apiKeys.noKeysDesc')}
          </p>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsCreateOpen(true)}
          >
            {t('apiKeys.generateFirst')}
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {keys.map((key) => {
              const isActive = key.is_active;
              const isCurrentActive = activeApiKey === key.api_key;

              return (
                <Card
                  key={key.id}
                  hoverEffect
                  className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 transition-all ${
                    isCurrentActive
                      ? 'border-indigo-500/50 bg-indigo-50/40 dark:bg-[#121829] ring-1 ring-indigo-500/20'
                      : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111622]'
                  }`}
                >
                  {/* Left: Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[#1A202C] dark:text-white text-base">{key.label}</span>
                      {isCurrentActive && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[11px] font-medium border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {t('apiKeys.selected')}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                          isActive
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/20'
                            : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200/80 dark:border-rose-500/20'
                        }`}
                      >
                        {isActive ? t('apiKeys.active') : t('apiKeys.revoked')}
                      </span>
                    </div>

                    {/* Key Masked Box */}
                    <div className="flex items-center gap-2">
                      <code className="px-3 py-1.5 rounded-lg bg-[#F8F9FA] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-[#2D3748] dark:text-slate-300">
                        {maskKey(key.api_key)}
                      </code>
                      <button
                        onClick={() => handleCopy(key.api_key, key.id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#4A5568] dark:text-slate-400 hover:text-[#1A202C] dark:hover:text-white transition-colors cursor-pointer"
                        title="Copy Key"
                      >
                        {copiedKey === key.id ? (
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#718096] dark:text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {t('apiKeys.created')}:{' '}
                        {new Date(key.created_at || key.createdAt).toLocaleDateString('id-ID')}
                      </span>
                      {key.last_used_at && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {t('apiKeys.lastUsed')}:{' '}
                          {new Date(key.last_used_at).toLocaleDateString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200/80 dark:border-slate-800">
                    {!isCurrentActive && isActive && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setActiveApiKey(key.api_key);
                          toast.success(`Key "${key.label}" ${t('apiKeys.keySetActiveToast')}`);
                        }}
                      >
                        {t('apiKeys.setActive')}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-700 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                      icon={Trash2}
                      onClick={() => setDeleteTarget(key)}
                    >
                      {t('apiKeys.revoke')}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Generate New Key */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setCreatedKeyData(null);
        }}
        title={createdKeyData ? t('apiKeys.modalSuccessTitle') : t('apiKeys.modalTitle')}
      >
        {createdKeyData ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs leading-relaxed flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <span>{t('apiKeys.modalWarning')}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#718096] dark:text-slate-400 uppercase mb-1">
                {t('apiKeys.labelName')}
              </label>
              <div className="text-sm font-semibold text-[#1A202C] dark:text-white">{createdKeyData.label}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#718096] dark:text-slate-400 uppercase mb-1">
                API Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={createdKeyData.api_key}
                  className="w-full bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-indigo-700 dark:text-indigo-300 select-all"
                />
                <Button
                  variant="primary"
                  size="sm"
                  icon={copiedKey === 'new' ? Check : Copy}
                  onClick={() => handleCopy(createdKeyData.api_key, 'new')}
                >
                  {copiedKey === 'new' ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsCreateOpen(false);
                  setCreatedKeyData(null);
                }}
              >
                {t('apiKeys.btnDone')}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {t('apiKeys.labelName')}
              </label>
              <input
                type="text"
                placeholder={t('apiKeys.labelPlaceholder')}
                value={newKeyLabel}
                onChange={(e) => setNewKeyLabel(e.target.value)}
                className="w-full bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-[#1A202C] dark:text-slate-200 placeholder-[#A0AEC0] dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
                autoFocus
              />
              <p className="text-xs text-[#718096] dark:text-slate-500 mt-1">
                {t('apiKeys.labelHint')}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <Button
                variant="secondary"
                onClick={() => setIsCreateOpen(false)}
                disabled={createLoading}
              >
                {t('apiKeys.btnCancel')}
              </Button>
              <Button type="submit" variant="primary" loading={createLoading}>
                {t('apiKeys.btnGenerate')}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete / Revoke Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('apiKeys.confirmTitle')}
        message={t('apiKeys.confirmMsg')}
        confirmText={t('apiKeys.confirmBtn')}
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
};

export default ApiKeysPage;
