# CommerceAPI — Backend RESTful API Server

Backend RESTful API dan API Gateway bergaya SaaS untuk penyediaan data produk e-commerce. Layanan ini memungkinkan pengembang mendaftarkan akun, menghasilkan **API Key**, serta mengakses endpoint katalog produk dan kategori secara terprogram melalui REST API.

Dibangun sebagai proyek akhir mata kuliah *Pengembangan Web Servis* (NIM: 20250140157).

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| **Runtime & Framework** | Node.js & Express.js v5 |
| **Database** | PostgreSQL (Lokal atau Supabase Pooler) |
| **ORM** | Sequelize v6 (`sequelize`, `pg`, `pg-hstore`) |
| **Autentikasi & Keamanan** | JSON Web Token (`jsonwebtoken`) & `bcrypt` (hash password) |
| **Middleware & Utility** | CORS, Dotenv, Nodemon |
| **Deployment** | Vercel Serverless Function (`@vercel/node`) |

---

## 🔐 Arsitektur Autentikasi (JWT vs API Key)

Sistem ini menerapkan model otentikasi ganda tergantung pada fungsi endpoint:

```
┌──────────────────────────────────────────────────────────┐
│                     KLIEN / PENGGUNA                     │
└────────────┬─────────────────────────────┬───────────────┘
             │ (1) Login via JWT           │ (2) Akses Data via x-api-key
             ▼                             ▼
┌──────────────────────────┐  ┌────────────────────────────┐
│   AUTH / API-KEYS ROUTE  │  │   PRODUK / KATEGORI ROUTE   │
│   (authMiddleware.js)    │  │   (apiKeyMiddleware.js)     │
├──────────────────────────┤  ├────────────────────────────┤
│ Header:                  │  │ Header:                     │
│ Authorization: Bearer <> │  │ x-api-key: <api_key>        │
└──────────────────────────┘  └────────────────────────────┘
```

1. **JWT (`authMiddleware.js`):** Digunakan untuk manajemen sesi akun user dan operasi CRUD API Key (generate, list, delete).
2. **API Key (`apiKeyMiddleware.js`):** Digunakan untuk mengakses data publik e-commerce (`/api/v1/produk` & `/api/v1/kategori`). Middleware memvalidasi keaktifan key dan secara otomatis memperbarui timestamp `last_used_at`.

---

## 📋 Daftar Endpoint API

### 1. Autentikasi (`/auth`)
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Mendaftarkan user/seller baru |
| `POST` | `/auth/login` | Public | Login akun & mendapatkan token JWT |

### 2. Manajemen API Key (`/api-keys`)
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/api-keys` | JWT Bearer | Membuat API Key baru (dengan label) |
| `GET` | `/api-keys` | JWT Bearer | Mengambil daftar semua API Key milik user |
| `DELETE` | `/api-keys/:id` | JWT Bearer | Menghapus / me-revoke API Key |

### 3. Kategori Produk (`/api/v1/kategori`)
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/api/v1/kategori` | API Key (`x-api-key`) | Mengambil seluruh daftar kategori |
| `GET` | `/api/v1/kategori/:id` | API Key (`x-api-key`) | Mengambil detail 1 kategori |
| `POST` | `/api/v1/kategori` | API Key (`x-api-key`) | Menambahkan kategori baru |
| `PUT` | `/api/v1/kategori/:id` | API Key (`x-api-key`) | Memperbarui data kategori |
| `DELETE` | `/api/v1/kategori/:id` | API Key (`x-api-key`) | Menghapus kategori |

### 4. Produk E-Commerce (`/api/v1/produk`)
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/api/v1/produk` | API Key (`x-api-key`) | List produk (query: `?kategori_id=`, `?status=`, `?search=`, `?page=`, `?limit=`) |
| `GET` | `/api/v1/produk/:id` | API Key (`x-api-key`) | Mengambil detail 1 produk |
| `POST` | `/api/v1/produk` | API Key (`x-api-key`) | Menambahkan produk baru |
| `PUT` | `/api/v1/produk/:id` | API Key (`x-api-key`) | Memperbarui produk |
| `DELETE` | `/api/v1/produk/:id` | API Key (`x-api-key`) | Menghapus produk |

---

## 🗄️ Skema Database

- **`users`:** `id (PK)`, `name`, `email (Unique)`, `password (Hash)`, `role`, `created_at`, `updated_at`.
- **`api_keys`:** `id (PK)`, `user_id (FK)`, `api_key (Unique)`, `label`, `is_active`, `last_used_at`, `created_at`.
- **`kategori`:** `id (PK)`, `nama`, `deskripsi`, `created_at`, `updated_at`.
- **`produk`:** `id (PK)`, `user_id (FK)`, `kategori_id (FK)`, `nama`, `deskripsi`, `harga`, `stok`, `sku (Unique)`, `gambar_url`, `berat`, `status`, `created_at`, `updated_at`.

> Tersedia skrip database siap pakai: `01_schema.sql` (struktur tabel & trigger) dan `02_seed_data.sql` (dummy 10 kategori & 50 produk).

---

## 📁 Struktur Folder

```
backend/
├── config/              # Konfigurasi database & Sequelize
│   └── config.js
├── controller/          # Logic controller per resource
│   ├── apiKeyController.js
│   ├── authController.js
│   ├── kategoriController.js
│   └── produkController.js
├── middleware/          # authMiddleware (JWT) & apiKeyMiddleware (x-api-key)
│   ├── apiKeyMiddleware.js
│   └── authMiddleware.js
├── migrations/          # Sequelize migrations
├── models/              # Model Sequelize (user, apiKey, kategori, produk)
│   ├── apiKey.js
│   ├── index.js
│   ├── kategori.js
│   ├── produk.js
│   └── user.js
├── routes/              # Express route definition
│   ├── apiKeys.js
│   ├── auth.js
│   ├── kategori.js
│   └── produk.js
├── seeders/             # Sequelize seeders
├── 01_schema.sql        # Skema SQL PostgreSQL
├── 02_seed_data.sql     # Data awal SQL PostgreSQL
├── .env.example         # Template konfigurasi environment
├── index.js             # Entry point Express.js app
├── package.json
└── vercel.json          # Konfigurasi deployment serverless Vercel
```

---

## ⚙️ Environment Variables (`.env`)

Salin `.env.example` ke `.env`:

```env
# Database Lokal (Development)
DB_USER=postgres
DB_PASS=postgres
DB_DATABASE=commerceapi
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DIALECT=postgres

# Database Cloud / Supabase (Production)
POSTGRES_URL=postgresql://user:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# JWT Security
JWT_SECRET=supersecretjwtstringcommerceapi12345!
JWT_EXPIRES=1d

# Server Setting
PORT=3000
NODE_ENV=development
```

---

## 🚦 Instalasi & Menjalankan Backend

1. **Masuk ke folder backend:**
   ```bash
   cd backend
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Setup Database:**
   - Buat database PostgreSQL bernama `commerceapi`.
   - Eksekusi file SQL `01_schema.sql` lalu `02_seed_data.sql` pada tool DB Anda (pgAdmin / DBeaver / psql / Supabase SQL Editor).

4. **Jalankan Server:**
   - **Mode Development (auto-reload):**
     ```bash
     npm run dev
     ```
   - **Mode Production:**
     ```bash
     npm start
     ```

   Server akan aktif di: `http://localhost:3000`
