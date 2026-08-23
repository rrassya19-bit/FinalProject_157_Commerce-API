import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Search,
  KeyRound,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { kategoriApi } from '../api/kategoriApi';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import { TableSkeleton } from '../components/ui/Skeleton';
import { Link } from 'react-router-dom';

const KategoriPage = () => {
  const { activeApiKey } = useAuth();
  const { t } = useTranslation();

  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKategori, setEditingKategori] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchKategori = async () => {
    if (!activeApiKey) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await kategoriApi.getAll();
      setKategoriList(res.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengambil data kategori');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, [activeApiKey]);

  const openCreateModal = () => {
    setEditingKategori(null);
    setFormData({ nama: '', deskripsi: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (kat) => {
    setEditingKategori(kat);
    setFormData({
      nama: kat.nama || '',
      deskripsi: kat.deskripsi || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeApiKey) {
      toast.error('API Key aktif diperlukan!');
      return;
    }

    try {
      setFormLoading(true);
      if (editingKategori) {
        await kategoriApi.update(editingKategori.id, formData);
        toast.success(t('categories.toastUpdated'));
      } else {
        await kategoriApi.create(formData);
        toast.success(t('categories.toastCreated'));
      }

      setIsModalOpen(false);
      fetchKategori();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan kategori');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      await kategoriApi.delete(deleteTarget.id);
      toast.success(t('categories.toastDeleted'));
      setDeleteTarget(null);
      fetchKategori();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus kategori');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredKategori = kategoriList.filter((item) =>
    item.nama?.toLowerCase().includes(search.toLowerCase()) ||
    item.deskripsi?.toLowerCase().includes(search.toLowerCase())
  );

  const rowVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.28,
        delay: Math.min(i * 0.03, 0.35),
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#1A202C] dark:text-white tracking-tight">{t('categories.title')}</h1>
          <p className="text-sm text-[#718096] dark:text-slate-400 mt-1">
            {t('categories.subtitle')}
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={openCreateModal}
          disabled={!activeApiKey}
        >
          {t('categories.addBtn')}
        </Button>
      </motion.div>

      {/* No API Key Notice */}
      {!activeApiKey ? (
        <Card className="text-center py-12 border-dashed border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center mx-auto text-amber-700 dark:text-amber-400 mb-4">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#1A202C] dark:text-white">{t('products.noKeyTitle')}</h3>
          <p className="text-sm text-[#4A5568] dark:text-slate-400 max-w-md mx-auto mt-1 mb-6">
            {t('products.noKeyDesc')}
          </p>
          <Link to="/dashboard/api-keys">
            <Button variant="primary" size="sm">
              {t('products.toKeyBtn')}
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex items-center justify-between"
          >
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder={t('categories.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-[#1A202C] dark:text-slate-200 placeholder-[#A0AEC0] dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </motion.div>

          {/* Table Container */}
          {loading ? (
            <TableSkeleton rows={4} cols={4} />
          ) : filteredKategori.length === 0 ? (
            <Card className="text-center py-12 border-dashed border-slate-300/80 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-400 mb-4">
                <FolderTree className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[#1A202C] dark:text-white">{t('categories.noCatTitle')}</h3>
              <p className="text-sm text-[#718096] dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                {t('categories.noCatDesc')}
              </p>
              <Button variant="primary" size="sm" icon={Plus} onClick={openCreateModal}>
                {t('categories.addFirst')}
              </Button>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111622] shadow-xs"
            >
              <table className="w-full text-left text-xs sm:text-sm text-[#4A5568] dark:text-slate-300">
                <thead className="bg-[#F8F9FA] dark:bg-slate-900/80 text-[#718096] dark:text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-200/80 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">{t('categories.colId')}</th>
                    <th className="px-5 py-3.5">{t('categories.colName')}</th>
                    <th className="px-5 py-3.5">{t('categories.colDesc')}</th>
                    <th className="px-5 py-3.5">{t('categories.colCreated')}</th>
                    <th className="px-5 py-3.5 text-right">{t('categories.colAction')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                  {filteredKategori.map((item, idx) => (
                    <motion.tr
                      key={item.id}
                      custom={idx}
                      variants={rowVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      className="hover:bg-[#F8F9FA] dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono text-[#A0AEC0] dark:text-slate-500">#{item.id}</td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#1A202C] dark:text-white flex items-center gap-2">
                          <FolderTree className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          {item.nama}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#718096] dark:text-slate-400 max-w-xs truncate">
                        {item.deskripsi || '-'}
                      </td>
                      <td className="px-5 py-4 text-[#718096] dark:text-slate-400 text-xs font-mono">
                        {new Date(item.created_at || item.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.15, rotate: -6 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.15 }}
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer"
                            title="Edit Kategori"
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.15, rotate: 6 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.15 }}
                            onClick={() => setDeleteTarget(item)}
                            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Hapus Kategori"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </>
      )}

      {/* Modal Tambah/Edit Kategori */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingKategori ? t('categories.modalEditTitle') : t('categories.modalAddTitle')}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-300 uppercase mb-1">
              {t('categories.formName')}
            </label>
            <input
              type="text"
              placeholder={t('categories.formNamePlaceholder')}
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3.5 py-2 text-sm text-[#1A202C] dark:text-slate-200 placeholder-[#A0AEC0] dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-300 uppercase mb-1">
              {t('categories.formDesc')}
            </label>
            <textarea
              rows={3}
              placeholder={t('categories.formDescPlaceholder')}
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              className="w-full bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3.5 py-2 text-sm text-[#1A202C] dark:text-slate-200 placeholder-[#A0AEC0] dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={formLoading}
            >
              {t('apiKeys.btnCancel')}
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              {editingKategori ? t('categories.btnSave') : t('categories.btnAdd')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal Hapus */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('categories.confirmTitle')}
        message={`${t('categories.confirmMsg')} (${deleteTarget?.nama})`}
        confirmText={t('categories.confirmBtn')}
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
};

export default KategoriPage;
