import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  KeyRound,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { produkApi } from '../api/produkApi';
import { kategoriApi } from '../api/kategoriApi';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import { TableSkeleton } from '../components/ui/Skeleton';
import { Link } from 'react-router-dom';

const ProdukPage = () => {
  const { activeApiKey } = useAuth();
  const { t } = useTranslation();

  const [produkList, setProdukList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state (Client-side)
  const [search, setSearch] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduk, setEditingProduk] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    kategori_id: '',
    harga: '',
    stok: '',
    sku: '',
    berat: '',
    gambar_url: '',
    status: 'active',
    deskripsi: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchKategori = async () => {
    if (!activeApiKey) return;
    try {
      const res = await kategoriApi.getAll();
      setKategoriList(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching kategori:', err);
    }
  };

  const fetchProduk = async () => {
    if (!activeApiKey) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await produkApi.getAll({ limit: 500 });
      const rawData = res.data?.data;
      const data = Array.isArray(rawData) ? rawData : (rawData?.produk || []);

      setProdukList(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memuat daftar produk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
    fetchProduk();
  }, [activeApiKey]);

  const openCreateModal = () => {
    setEditingProduk(null);
    setFormData({
      nama: '',
      kategori_id: kategoriList[0]?.id || '',
      harga: '',
      stok: '',
      sku: '',
      berat: '',
      gambar_url: '',
      status: 'active',
      deskripsi: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (produk) => {
    setEditingProduk(produk);
    setFormData({
      nama: produk.nama || '',
      kategori_id: produk.kategori_id || '',
      harga: produk.harga || '',
      stok: produk.stok || 0,
      sku: produk.sku || '',
      berat: produk.berat || '',
      gambar_url: produk.gambar_url || '',
      status: produk.status || 'active',
      deskripsi: produk.deskripsi || '',
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
      const payload = {
        ...formData,
        kategori_id: formData.kategori_id ? parseInt(formData.kategori_id, 10) : null,
        harga: parseFloat(formData.harga),
        stok: parseInt(formData.stok, 10),
        berat: formData.berat ? parseFloat(formData.berat) : null,
      };

      if (editingProduk) {
        await produkApi.update(editingProduk.id, payload);
        toast.success(t('products.toastUpdated'));
      } else {
        await produkApi.create(payload);
        toast.success(t('products.toastCreated'));
      }

      setIsModalOpen(false);
      fetchProduk();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan produk');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      await produkApi.delete(deleteTarget.id);
      toast.success(t('products.toastDeleted'));
      setDeleteTarget(null);
      fetchProduk();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus produk');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredProduk = produkList.filter((item) => {
    const term = search.toLowerCase();
    const matchSearch =
      item.nama?.toLowerCase().includes(term) ||
      item.sku?.toLowerCase().includes(term) ||
      item.deskripsi?.toLowerCase().includes(term);

    const matchKategori = selectedKategori
      ? String(item.kategori_id) === String(selectedKategori)
      : true;

    const matchStatus = selectedStatus
      ? item.status === selectedStatus
      : true;

    return matchSearch && matchKategori && matchStatus;
  });

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(number);
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.28,
        delay: Math.min(i * 0.025, 0.4),
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
          <h1 className="text-2xl font-bold text-[#1A202C] dark:text-white tracking-tight">{t('products.title')}</h1>
          <p className="text-sm text-[#718096] dark:text-slate-400 mt-1">
            {t('products.subtitle')}
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={openCreateModal}
          disabled={!activeApiKey}
        >
          {t('products.addBtn')}
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
          {/* Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder={t('products.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-[#1A202C] dark:text-slate-200 placeholder-[#A0AEC0] dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-[#4A5568] dark:text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="">{t('products.allCategories')}</option>
                {kategoriList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-[#4A5568] dark:text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="">{t('products.allStatus')}</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </motion.div>

          {/* Table Container - Single Long Scrollable List */}
          {loading ? (
            <TableSkeleton rows={8} cols={6} />
          ) : filteredProduk.length === 0 ? (
            <Card className="text-center py-12 border-dashed border-slate-300/80 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-400 mb-4">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[#1A202C] dark:text-white">{t('products.noProductTitle')}</h3>
              <p className="text-sm text-[#718096] dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                {t('products.noProductDesc')}
              </p>
              <Button variant="primary" size="sm" icon={Plus} onClick={openCreateModal}>
                {t('products.addFirst')}
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
                    <th className="px-5 py-3.5">{t('products.colProduct')}</th>
                    <th className="px-5 py-3.5">{t('products.colCategory')}</th>
                    <th className="px-5 py-3.5">{t('products.colPrice')}</th>
                    <th className="px-5 py-3.5">{t('products.colStock')}</th>
                    <th className="px-5 py-3.5">{t('products.colStatus')}</th>
                    <th className="px-5 py-3.5 text-right">{t('products.colAction')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                  {filteredProduk.map((item, idx) => {
                    const statusColors = {
                      active: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/20',
                      inactive: 'bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-200/80 dark:border-slate-500/20',
                      out_of_stock: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200/80 dark:border-rose-500/20',
                    };

                    return (
                      <motion.tr
                        key={item.id}
                        custom={idx}
                        variants={rowVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        className="hover:bg-[#F8F9FA] dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {item.gambar_url ? (
                              <img
                                src={item.gambar_url}
                                alt={item.nama}
                                loading="lazy"
                                className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 transition-transform duration-200 hover:scale-105"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://placehold.co/100x100?text=Produk';
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-[#1A202C] dark:text-white">{item.nama}</div>
                              <div className="text-xs text-[#718096] dark:text-slate-500 font-mono">
                                SKU: {item.sku || '-'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-[#4A5568] dark:text-slate-300">
                            {item.kategori?.nama || item.Kategori?.nama || '-'}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-medium text-[#1A202C] dark:text-slate-200 font-mono">
                          {formatRupiah(item.harga)}
                        </td>
                        <td className="px-5 py-4 text-[#4A5568] dark:text-slate-300">{item.stok} {t('products.units')}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                              statusColors[item.status] || statusColors.active
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <motion.button
                              whileHover={{ scale: 1.15, rotate: -6 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ duration: 0.15 }}
                              onClick={() => openEditModal(item)}
                              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer"
                              title="Edit Produk"
                            >
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.15, rotate: 6 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ duration: 0.15 }}
                              onClick={() => setDeleteTarget(item)}
                              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Hapus Produk"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          )}
        </>
      )}

      {/* Modal Form Tambah/Edit Produk */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduk ? t('products.modalEditTitle') : t('products.modalAddTitle')}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-300 uppercase mb-1">
                {t('products.formName')}
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3.5 py-2 text-sm text-[#1A202C] dark:text-slate-200 placeholder-[#A0AEC0] dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-300 uppercase mb-1">
                {t('products.formCategory')}
              </label>
              <select
                value={formData.kategori_id}
                onChange={(e) => setFormData({ ...formData, kategori_id: e.target.value })}
                className="w-full bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-[#1A202C] dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">{t('products.formSelectCat')}</option>
                {kategoriList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-300 uppercase mb-1">
                {t('products.formSku')}
              </label>
              <input
                type="text"
                placeholder="Contoh: PRD-001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3.5 py-2 text-sm text-[#1A202C] dark:text-slate-200 placeholder-[#A0AEC0] dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-300 uppercase mb-1">
                {t('products.formPrice')}
              </label>
              <input
                type="number"
                value={formData.harga}
                onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                className="w-full bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3.5 py-2 text-sm text-[#1A202C] dark:text-slate-200 placeholder-[#A0AEC0] dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-300 uppercase mb-1">
                {t('products.formStock')}
              </label>
              <input
                type="number"
                value={formData.stok}
                onChange={(e) => setFormData({ ...formData, stok: e.target.value })}
                className="w-full bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3.5 py-2 text-sm text-[#1A202C] dark:text-slate-200 placeholder-[#A0AEC0] dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-300 uppercase mb-1">
                {t('products.formWeight')}
              </label>
              <input
                type="number"
                placeholder="Contoh: 500"
                value={formData.berat}
                onChange={(e) => setFormData({ ...formData, berat: e.target.value })}
                className="w-full bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3.5 py-2 text-sm text-[#1A202C] dark:text-slate-200 placeholder-[#A0AEC0] dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-300 uppercase mb-1">
                {t('products.formStatus')}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-[#1A202C] dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-300 uppercase mb-1">
                {t('products.formImage')}
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.gambar_url}
                onChange={(e) => setFormData({ ...formData, gambar_url: e.target.value })}
                className="w-full bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3.5 py-2 text-sm text-[#1A202C] dark:text-slate-200 placeholder-[#A0AEC0] dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#4A5568] dark:text-slate-300 uppercase mb-1">
                {t('products.formDesc')}
              </label>
              <textarea
                rows={3}
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                className="w-full bg-[#F8F9FA] dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-lg px-3.5 py-2 text-sm text-[#1A202C] dark:text-slate-200 placeholder-[#A0AEC0] dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                placeholder="Deskripsi detail produk..."
              />
            </div>
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
              {editingProduk ? t('products.btnSave') : t('products.btnAdd')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal Hapus */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('products.confirmTitle')}
        message={`${t('products.confirmMsg')} (${deleteTarget?.nama})`}
        confirmText={t('products.confirmBtn')}
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
};

export default ProdukPage;
