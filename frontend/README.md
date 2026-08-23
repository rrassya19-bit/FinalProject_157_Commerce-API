# CommerceAPI — Frontend Client & Dashboard

Frontend Single Page Application (SPA) modern untuk **CommerceAPI**, sebuah SaaS API Gateway data produk e-commerce. Antarmuka ini menyediakan portal pengembang lengkap: manajemen akun, pengelolaan API Key, manajemen katalog produk & kategori, dokumentasi API interaktif, serta live API Playground.

Dibangun sebagai bagian dari proyek akhir mata kuliah *Pengembangan Web Servis* (NIM: 20250140157).

---

## 🚀 Fitur Utama

- 🎨 **Modern Design & Micro-Interactions:** Antarmuka responsif berbasis Tailwind CSS v4 dan animasi halus dari Framer Motion (termasuk interactive canvas network mesh).
- 🌓 **Dark & Light Mode Toggle:** Dukungan pergantian tema gelap dan terang dengan penyimpanan preferensi di `localStorage`.
- 🌐 **Multi-Language Support (i18n):** Dukungan penuh dua bahasa (Bahasa Indonesia & English) menggunakan `i18next`.
- 🔐 **Dual-Authentication Handler:**
  - Manajemen sesi **JWT** untuk rute internal & dashboard pengembang.
  - Injeksi otomatis **API Key aktif** (`x-api-key`) pada setiap request CRUD produk & kategori melalui Axios Interceptor.
- 🔑 **API Key Management:** Generate key baru dengan custom label, monitoring status aktif/inaktif, tanggal terakhir dipakai (`last_used_at`), penyalinan satu klik, dan revoke key.
- 📦 **CRUD Produk & Kategori:**
  - Manajemen katalog produk lengkap (filter status, filter kategori, pagination, pencarian).
  - Manajemen kategori produk dengan dialog konfirmasi aman.
- 🧪 **Interactive API Docs & Live Playground:** Menguji endpoint API langsung dari browser tanpa perlu membuka aplikasi pihak ketiga seperti Postman.

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| **Framework / Library** | React 19 (`react`, `react-dom`) |
| **Build Tool** | Vite 8 |
| **Routing** | React Router v7 (`react-router-dom`) |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`, `clsx`, `tailwind-merge`) |
| **Animasi** | Framer Motion 13 |
| **HTTP Client** | Axios 1.x (dengan Request & Response Interceptors) |
| **Internationalization** | i18next & react-i18next |
| **Icons & Feedback** | Lucide React & React Hot Toast |
| **Linter** | Oxlint |

---

## 📁 Struktur Folder

```
frontend/
├── public/                  # Static assets (favicon, icons.svg)
├── src/
│   ├── api/                 # Service layer & Axios instance
│   │   ├── apiKeyApi.js     # Endpoint /api-keys
│   │   ├── authApi.js       # Endpoint /auth/login & /auth/register
│   │   ├── axiosInstance.js # Interceptor JWT & x-api-key
│   │   ├── kategoriApi.js   # Endpoint /api/v1/kategori
│   │   └── produkApi.js     # Endpoint /api/v1/produk
│   ├── components/
│   │   ├── layout/          # PublicNavbar, PublicFooter, Sidebar, Topbar
│   │   ├── shared/          # ProtectedRoute, AnimatedBackground
│   │   └── ui/              # Button, Card, Modal, ConfirmModal, Badge, Skeleton, ThemeToggle, LanguageToggle
│   ├── context/
│   │   ├── AuthContext.jsx  # State autentikasi, token, & active API key
│   │   └── ThemeContext.jsx # State tema dark/light
│   ├── i18n/                # Konfigurasi i18n & kamus terjemahan (id.json, en.json)
│   ├── layouts/             # PublicLayout & DashboardLayout
│   ├── pages/               # Halaman aplikasi (Landing, Auth, Dashboard, CRUD, Docs, Playground)
│   ├── App.jsx              # Routing & Route Guard
│   ├── index.css            # Global CSS & Tailwind imports
│   └── main.jsx             # Entry point aplikasi React
├── .env                     # Environment variables lokal
├── index.html
├── package.json
└── vite.config.js
```

---

## 🧭 Daftar Halaman & Rute

### Public Routes
- `/` — Landing Page promosi SaaS & fitur CommerceAPI.
- `/login` — Halaman login user (mendapatkan token JWT).
- `/register` — Registrasi akun seller baru.
- `/docs` — Dokumentasi endpoint API interaktif.
- `/docs/playground` — Sandbox untuk menguji request HTTP secara langsung.

### Protected Routes (Memerlukan Login)
- `/dashboard` — Ringkasan metrik akun, status API Key, dan akses cepat.
- `/dashboard/api-keys` — Pengelolaan dan pembuatan API Key.
- `/dashboard/produk` — Tabel katalog produk & antarmuka CRUD produk.
- `/dashboard/kategori` — Tabel & antarmuka CRUD kategori produk.
- `/dashboard/profile` — Informasi akun pengembang.

---

## ⚙️ Konfigurasi Environment (`.env`)

Buat file `.env` di dalam root direktori `frontend/`:

```env
# URL Backend CommerceAPI Express.js
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🚦 Instalasi & Menjalankan

1. **Masuk ke direktori frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan local development server:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan pada: `http://localhost:5173`

4. **Build untuk produksi:**
   ```bash
   npm run build
   ```

5. **Pratinjau build produksi (Preview):**
   ```bash
   npm run preview
   ```

6. **Menjalankan Linter:**
   ```bash
   npm run lint
   ```
