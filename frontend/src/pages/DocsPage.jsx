import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Shield,
  Copy,
  Check,
  Terminal,
  LayoutDashboard,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const DocsPage = ({ isDashboard = false }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState('auth-register');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success(t('docs.toastCopied'));
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const navItems = [
    {
      group: 'Authentication (JWT)',
      items: [
        { id: 'auth-register', name: 'POST /auth/register', method: 'POST' },
        { id: 'auth-login', name: 'POST /auth/login', method: 'POST' },
      ],
    },
    {
      group: 'API Key Management (JWT)',
      items: [
        { id: 'keys-generate', name: 'POST /api-keys', method: 'POST' },
        { id: 'keys-list', name: 'GET /api-keys', method: 'GET' },
        { id: 'keys-delete', name: 'DELETE /api-keys/:id', method: 'DELETE' },
      ],
    },
    {
      group: 'Produk CRUD (x-api-key)',
      items: [
        { id: 'produk-list', name: 'GET /api/v1/produk', method: 'GET' },
        { id: 'produk-detail', name: 'GET /api/v1/produk/:id', method: 'GET' },
        { id: 'produk-create', name: 'POST /api/v1/produk', method: 'POST' },
        { id: 'produk-update', name: 'PUT /api/v1/produk/:id', method: 'PUT' },
        { id: 'produk-delete', name: 'DELETE /api/v1/produk/:id', method: 'DELETE' },
      ],
    },
    {
      group: 'Kategori CRUD (x-api-key)',
      items: [
        { id: 'kategori-list', name: 'GET /api/v1/kategori', method: 'GET' },
        { id: 'kategori-detail', name: 'GET /api/v1/kategori/:id', method: 'GET' },
        { id: 'kategori-create', name: 'POST /api/v1/kategori', method: 'POST' },
        { id: 'kategori-update', name: 'PUT /api/v1/kategori/:id', method: 'PUT' },
        { id: 'kategori-delete', name: 'DELETE /api/v1/kategori/:id', method: 'DELETE' },
      ],
    },
  ];

  const docsData = {
    'auth-register': {
      title: 'Registrasi User Baru',
      method: 'POST',
      endpoint: '/auth/register',
      authType: 'Public (Tanpa Auth)',
      description: 'Mendaftarkan akun seller baru untuk mengakses dashboard & manajemen API key.',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          name: 'Budi Santoso',
          email: 'budi@example.com',
          password: 'secretpassword',
        },
        null,
        2
      ),
      response: JSON.stringify(
        {
          success: true,
          message: 'Registrasi berhasil',
          data: {
            id: 1,
            name: 'Budi Santoso',
            email: 'budi@example.com',
            role: 'seller',
          },
        },
        null,
        2
      ),
    },
    'auth-login': {
      title: 'Login User',
      method: 'POST',
      endpoint: '/auth/login',
      authType: 'Public (Tanpa Auth)',
      description: 'Melakukan autentikasi dan mendapatkan token JWT untuk otorisasi endpoint akun.',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          email: 'budi@example.com',
          password: 'secretpassword',
        },
        null,
        2
      ),
      response: JSON.stringify(
        {
          success: true,
          message: 'Login berhasil',
          data: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            user: {
              id: 1,
              name: 'Budi Santoso',
              email: 'budi@example.com',
              role: 'seller',
            },
          },
        },
        null,
        2
      ),
    },
    'keys-generate': {
      title: 'Generate API Key Baru',
      method: 'POST',
      endpoint: '/api-keys',
      authType: 'Bearer JWT',
      description: 'Membuat kunci API baru yang terikat dengan user ID yang login.',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer <your-jwt-token>',
      },
      body: JSON.stringify(
        {
          label: 'Mobile Store Key',
        },
        null,
        2
      ),
      response: JSON.stringify(
        {
          success: true,
          message: 'API Key berhasil dibuat',
          data: {
            id: 1,
            label: 'Mobile Store Key',
            api_key: 'sk-comm_live_4b8f72a1e93c...',
            is_active: true,
            created_at: '2026-08-23T10:00:00.000Z',
          },
        },
        null,
        2
      ),
    },
    'keys-list': {
      title: 'List API Key Milik User',
      method: 'GET',
      endpoint: '/api-keys',
      authType: 'Bearer JWT',
      description: 'Mengambil seluruh daftar API Key yang pernah dibuat oleh user yang login.',
      headers: {
        Authorization: 'Bearer <your-jwt-token>',
      },
      body: null,
      response: JSON.stringify(
        {
          success: true,
          message: 'Daftar API Key berhasil diambil',
          data: [
            {
              id: 1,
              label: 'Mobile Store Key',
              api_key: 'sk-comm_live_4b8f72a1e93c...',
              is_active: true,
              last_used_at: '2026-08-23T12:00:00.000Z',
              created_at: '2026-08-23T10:00:00.000Z',
            },
          ],
        },
        null,
        2
      ),
    },
    'keys-delete': {
      title: 'Revoke / Hapus API Key',
      method: 'DELETE',
      endpoint: '/api-keys/:id',
      authType: 'Bearer JWT',
      description: 'Menghapus atau mencabut izin API Key tertentu.',
      headers: {
        Authorization: 'Bearer <your-jwt-token>',
      },
      body: null,
      response: JSON.stringify(
        {
          success: true,
          message: 'API Key berhasil dihapus',
          data: null,
        },
        null,
        2
      ),
    },
    'produk-list': {
      title: 'List Semua Produk',
      method: 'GET',
      endpoint: '/api/v1/produk?kategori_id=1&status=active&page=1&limit=10',
      authType: 'x-api-key',
      description: 'Mengambil data katalog produk dengan dukungan query filter kategori_id, status, pagination (page, limit).',
      headers: {
        'x-api-key': 'sk-comm_live_4b8f72a1e93c...',
      },
      body: null,
      response: JSON.stringify(
        {
          success: true,
          message: 'Data produk berhasil diambil',
          data: [
            {
              id: 1,
              user_id: 1,
              kategori_id: 1,
              nama: 'Smartphone Galaxy X',
              deskripsi: 'Layar 6.7 inch AMOLED 120Hz, RAM 8GB, 256GB Storage',
              harga: '7500000.00',
              stok: 25,
              sku: 'ELK-001',
              gambar_url: 'https://images.unsplash.com/...',
              berat: '200.00',
              status: 'active',
              kategori: {
                id: 1,
                nama: 'Elektronik',
              },
            },
          ],
          pagination: {
            currentPage: 1,
            totalPages: 5,
            totalItems: 50,
            itemsPerPage: 10,
          },
        },
        null,
        2
      ),
    },
    'produk-detail': {
      title: 'Detail Produk',
      method: 'GET',
      endpoint: '/api/v1/produk/:id',
      authType: 'x-api-key',
      description: 'Mengambil detail produk tunggal berdasarkan ID.',
      headers: {
        'x-api-key': 'sk-comm_live_4b8f72a1e93c...',
      },
      body: null,
      response: JSON.stringify(
        {
          success: true,
          message: 'Detail produk ditemukan',
          data: {
            id: 1,
            user_id: 1,
            kategori_id: 1,
            nama: 'Smartphone Galaxy X',
            harga: '7500000.00',
            stok: 25,
            sku: 'ELK-001',
            status: 'active',
          },
        },
        null,
        2
      ),
    },
    'produk-create': {
      title: 'Tambah Produk Baru',
      method: 'POST',
      endpoint: '/api/v1/produk',
      authType: 'x-api-key',
      description: 'Menambahkan item produk baru ke dalam katalog seller pemilik API Key.',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'sk-comm_live_4b8f72a1e93c...',
      },
      body: JSON.stringify(
        {
          kategori_id: 1,
          nama: 'Smartwatch AMOLED Waterproof',
          deskripsi: 'Jam pintar dengan sensor detak jantung dan GPS.',
          harga: 599000,
          stok: 40,
          sku: 'ELK-002',
          gambar_url: 'https://...',
          berat: 120,
          status: 'active',
        },
        null,
        2
      ),
      response: JSON.stringify(
        {
          success: true,
          message: 'Produk berhasil dibuat',
          data: {
            id: 2,
            user_id: 1,
            nama: 'Smartwatch AMOLED Waterproof',
            harga: 599000,
            stok: 40,
          },
        },
        null,
        2
      ),
    },
    'produk-update': {
      title: 'Update Produk',
      method: 'PUT',
      endpoint: '/api/v1/produk/:id',
      authType: 'x-api-key',
      description: 'Mengubah atribut produk milik user pemilik API Key.',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'sk-comm_live_4b8f72a1e93c...',
      },
      body: JSON.stringify(
        {
          harga: 549000,
          stok: 35,
          status: 'active',
        },
        null,
        2
      ),
      response: JSON.stringify(
        {
          success: true,
          message: 'Produk berhasil diperbarui',
          data: {
            id: 2,
            harga: 549000,
            stok: 35,
          },
        },
        null,
        2
      ),
    },
    'produk-delete': {
      title: 'Hapus Produk',
      method: 'DELETE',
      endpoint: '/api/v1/produk/:id',
      authType: 'x-api-key',
      description: 'Menghapus produk dari katalog.',
      headers: {
        'x-api-key': 'sk-comm_live_4b8f72a1e93c...',
      },
      body: null,
      response: JSON.stringify(
        {
          success: true,
          message: 'Produk berhasil dihapus',
          data: null,
        },
        null,
        2
      ),
    },
    'kategori-list': {
      title: 'List Semua Kategori',
      method: 'GET',
      endpoint: '/api/v1/kategori',
      authType: 'x-api-key',
      description: 'Mengambil daftar semua kategori produk yang tersedia.',
      headers: {
        'x-api-key': 'sk-comm_live_4b8f72a1e93c...',
      },
      body: null,
      response: JSON.stringify(
        {
          success: true,
          message: 'Berhasil mengambil daftar kategori',
          data: [
            {
              id: 1,
              nama: 'Elektronik',
              deskripsi: 'Peralatan elektronik, gadget, dan aksesoris teknologi',
            },
          ],
        },
        null,
        2
      ),
    },
    'kategori-detail': {
      title: 'Detail Kategori',
      method: 'GET',
      endpoint: '/api/v1/kategori/:id',
      authType: 'x-api-key',
      description: 'Mendapatkan detail satu kategori beserta relasi produknya.',
      headers: {
        'x-api-key': 'sk-comm_live_4b8f72a1e93c...',
      },
      body: null,
      response: JSON.stringify(
        {
          success: true,
          message: 'Berhasil mengambil detail kategori',
          data: {
            id: 1,
            nama: 'Elektronik',
            deskripsi: 'Peralatan elektronik',
            produk: [],
          },
        },
        null,
        2
      ),
    },
    'kategori-create': {
      title: 'Tambah Kategori Baru',
      method: 'POST',
      endpoint: '/api/v1/kategori',
      authType: 'x-api-key',
      description: 'Menambahkan kategori baru.',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'sk-comm_live_4b8f72a1e93c...',
      },
      body: JSON.stringify(
        {
          nama: 'Fashion Pria',
          deskripsi: 'Pakaian dan aksesoris pria',
        },
        null,
        2
      ),
      response: JSON.stringify(
        {
          success: true,
          message: 'Kategori berhasil dibuat',
          data: {
            id: 2,
            nama: 'Fashion Pria',
          },
        },
        null,
        2
      ),
    },
    'kategori-update': {
      title: 'Update Kategori',
      method: 'PUT',
      endpoint: '/api/v1/kategori/:id',
      authType: 'x-api-key',
      description: 'Mengubah nama dan deskripsi kategori.',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'sk-comm_live_4b8f72a1e93c...',
      },
      body: JSON.stringify(
        {
          nama: 'Fashion & Apparel',
          deskripsi: 'Pakaian pria dan wanita',
        },
        null,
        2
      ),
      response: JSON.stringify(
        {
          success: true,
          message: 'Kategori berhasil diupdate',
          data: {
            id: 2,
            nama: 'Fashion & Apparel',
          },
        },
        null,
        2
      ),
    },
    'kategori-delete': {
      title: 'Hapus Kategori',
      method: 'DELETE',
      endpoint: '/api/v1/kategori/:id',
      authType: 'x-api-key',
      description: 'Menghapus kategori. Produk terkait akan di-set null.',
      headers: {
        'x-api-key': 'sk-comm_live_4b8f72a1e93c...',
      },
      body: null,
      response: JSON.stringify(
        {
          success: true,
          message: 'Kategori berhasil dihapus',
          data: null,
        },
        null,
        2
      ),
    },
  };

  const currentDoc = docsData[activeSection] || docsData['auth-register'];

  const methodBadge = (method) => {
    const map = {
      GET: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/30',
      POST: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-500/30',
      PUT: 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-200/80 dark:border-amber-500/30',
      DELETE: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200/80 dark:border-rose-500/30',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${map[method] || ''}`}>
        {method}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A202C] dark:text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            CommerceAPI — {t('docs.title')}
          </h1>
          <p className="text-sm text-[#718096] dark:text-slate-400 mt-1">
            SaaS API Gateway untuk Data Produk E-Commerce • {t('docs.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isDashboard && isAuthenticated && (
            <Link to="/dashboard">
              <Button variant="secondary" icon={LayoutDashboard}>
                {t('nav.dashboard')}
              </Button>
            </Link>
          )}
          <Link to={isDashboard ? "/dashboard/playground" : "/docs/playground"}>
            <Button variant="outline" icon={Terminal}>
              {t('docs.openPlayground')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Docs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-4 bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 sticky top-24 space-y-6 shadow-xs">
          {navItems.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#718096] dark:text-slate-500 px-3 py-1">
                {group.group}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-500/40 font-semibold'
                          : 'text-[#4A5568] dark:text-slate-400 hover:text-[#1A202C] dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="font-mono">{item.name}</span>
                      {methodBadge(item.method)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs"
          >
            {/* Title & Endpoint */}
            <div className="space-y-3 pb-6 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {methodBadge(currentDoc.method)}
                <h2 className="text-xl font-bold text-[#1A202C] dark:text-white">{currentDoc.title}</h2>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F8F9FA] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-indigo-700 dark:text-indigo-300">
                <span className="text-[#A0AEC0] dark:text-slate-500 select-none">ENDPOINT:</span>
                <span>{currentDoc.endpoint}</span>
              </div>
              <p className="text-sm text-[#4A5568] dark:text-slate-400 leading-relaxed">{currentDoc.description}</p>
            </div>

            {/* Auth Requirements */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#718096] dark:text-slate-400">
                {t('docs.authType')}
              </h3>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8F9FA] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-[#2D3748] dark:text-slate-300">
                <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{currentDoc.authType}</span>
              </div>
            </div>

            {/* Headers */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('docs.reqHeaders')}
              </h3>
              <div className="bg-[#F8F9FA] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-800 dark:text-slate-300 space-y-1">
                {Object.entries(currentDoc.headers).map(([k, v]) => (
                  <div key={k} className="flex">
                    <span className="text-slate-500 dark:text-slate-400 w-36">{k}:</span>
                    <span className="text-indigo-600 dark:text-amber-300 font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Body (if any) */}
            {currentDoc.body && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t('docs.reqBody')}
                  </h3>
                  <button
                    onClick={() => handleCopy(currentDoc.body, 'req')}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedIndex === 'req' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {t('docs.copy')}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-indigo-900 dark:text-indigo-200 overflow-x-auto">
                  <code>{currentDoc.body}</code>
                </pre>
              </div>
            )}

            {/* Response Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t('docs.resExample')}
                </h3>
                <button
                  onClick={() => handleCopy(currentDoc.response, 'res')}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedIndex === 'res' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {t('docs.copy')}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-emerald-700 dark:text-emerald-300 overflow-x-auto">
                <code>{currentDoc.response}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
