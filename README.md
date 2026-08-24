# CommerceAPI

**SaaS API Gateway untuk Data Produk E-Commerce**

CommerceAPI adalah layanan backend bergaya SaaS yang menyediakan akses CRUD ke data produk e-commerce melalui satu API key — konsepnya analog dengan cara kerja **OpenRouter**, tapi alih-alih menyediakan akses ke berbagai model AI, project ini menyediakan akses terprogram ke data **produk** dan **kategori**.

Dibangun sebagai proyek akhir mata kuliah *Pengembangan Web Servis* (NIM: 20250140157).

---

## 📋 Daftar Isi

- [Konsep & Alur Sistem](#konsep--alur-sistem)
- [Tech Stack](#tech-stack)
- [Struktur Folder](#struktur-folder)
- [Skema Database](#skema-database)
- [Daftar Endpoint API](#daftar-endpoint-api)
- [Instalasi & Menjalankan Project](#instalasi--menjalankan-project)
- [Environment Variables](#environment-variables)
- [Alur Middleware & Autentikasi](#alur-middleware--autentikasi)
- [Dokumentasi Tambahan](#dokumentasi-tambahan)

---

## Konsep & Alur Sistem

1. User mendaftar akun (**register**) dan login → mendapat **JWT**
2. Dengan JWT tersebut, user men-generate **API Key**
3. API Key dipakai untuk mengakses endpoint data (`produk`, `kategori`) — mendukung operasi **Create, Read, Update, Delete**
4. Endpoint ini bisa dipanggil dari aplikasi lain (Postman, mobile app, web lain, dsb) selama menyertakan API Key yang valid

### Perbedaan Peran JWT vs API Key

| | JWT | API Key |
|---|---|---|
| Didapat dari | Login (`/auth/login`) | Generate setelah login (`/api-keys`) |
| Dipakai untuk | Akses endpoint manajemen akun & kelola API Key | Akses endpoint data (`produk`, `kategori`) |
| Dikirim lewat | Header `Authorization: Bearer <token>` | Header `x-api-key: <key>` |
| Analogi | Login ke dashboard OpenRouter | API Key yang dipakai untuk call model di OpenRouter |

---

## Tech Stack

### Backend
| Kategori | Teknologi |
|---|---|
| Framework | Express.js |
| Database | PostgreSQL (Supabase, region Singapore) |
| ORM | Sequelize |
| Autentikasi | JWT (jsonwebtoken) + bcrypt untuk hash password |
| API Key | Cryptographic random string generator, disimpan di tabel `api_keys` |
| Deployment | Vercel (Serverless Node.js Function) |
| Testing | Postman |

### Frontend
| Kategori | Teknologi |
|---|---|
| Build Tool | Vite |
| UI Library | React (JS) |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| Animasi | Framer Motion (page transition, scroll reveal, micro-interaction, canvas network mesh) |
| HTTP Client | Axios (interceptor untuk JWT & `x-api-key`) |
| i18n | i18next & react-i18next (Multi-bahasa ID/EN) |
| Theming | Dark/Light Mode Toggle (Tailwind `.dark` class + localStorage) |
| Icons & Notifikasi | Lucide React & React Hot Toast |

---

## Struktur Folder

```
FinalProject_157_Commerce-API/
├── backend/
│   ├── config/                # Konfigurasi Sequelize & koneksi DB
│   ├── controller/             # Logic tiap endpoint (auth, apiKey, produk, kategori)
│   ├── middleware/              # authMiddleware (JWT) & apiKeyMiddleware (x-api-key)
│   ├── migrations/
│   ├── models/                  # Model Sequelize (user, apiKey, produk, kategori)
│   ├── routes/
│   ├── seeders/
│   ├── 01_schema.sql            # Struktur tabel siap pakai
│   ├── 02_seed_data.sql         # 10 kategori + 50 produk dummy
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── vercel.json
│
├── docs/
│   ├── DIAGRAM/                 # ERD, Use Case, Activity, Class, Deployment Diagram
│   ├── Dokumentasi_Postman/     # Koleksi Postman screenshot
│   └── DIAGRAM.md
│
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios instance & service per resource
│   │   ├── components/
│   │   │   ├── layout/           # Navbar, Footer, Sidebar, Topbar
│   │   │   ├── shared/           # AnimatedBackground, ProtectedRoute, dll
│   │   │   └── ui/               # Button, Card, Modal, ThemeToggle, dll
│   │   ├── context/              # AuthContext, ThemeContext
│   │   ├── i18n/                 # Locale ID/EN
│   │   ├── layouts/              # DashboardLayout, PublicLayout
│   │   └── pages/                # Landing, Login, Register, Dashboard, Produk, Kategori, API Keys, Playground, Docs, Profile
│   ├── .env.example
│   ├── vercel.json
│   ├── package.json
│   └── vite.config.js
│
├── PERANCANGAN.md
└── README.md
```

---

## Skema Database

### `users`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | SERIAL PK | |
| name | VARCHAR(100) | |
| email | VARCHAR(150) UNIQUE | |
| password | VARCHAR(255) | di-hash bcrypt |
| role | VARCHAR(20) | default `seller` |
| created_at / updated_at | TIMESTAMP | |

### `api_keys`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | SERIAL PK | |
| user_id | INTEGER FK → users.id | ON DELETE CASCADE |
| api_key | VARCHAR(255) UNIQUE | |
| label | VARCHAR(100) | nama bebas dari user |
| is_active | BOOLEAN | default true |
| last_used_at | TIMESTAMP | diupdate tiap kali key dipakai |
| created_at | TIMESTAMP | |

### `kategori`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | SERIAL PK | |
| nama | VARCHAR(100) | |
| deskripsi | TEXT | |
| created_at / updated_at | TIMESTAMP | |

### `produk`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | SERIAL PK | |
| user_id | INTEGER FK → users.id | pemilik produk |
| kategori_id | INTEGER FK → kategori.id | ON DELETE SET NULL |
| nama | VARCHAR(150) | |
| deskripsi | TEXT | |
| harga | NUMERIC(12,2) | |
| stok | INTEGER | |
| sku | VARCHAR(50) UNIQUE | |
| gambar_url | VARCHAR(255) | |
| berat | NUMERIC(8,2) | dalam gram |
| status | VARCHAR(20) | active / inactive / out_of_stock |
| created_at / updated_at | TIMESTAMP | |

### Relasi (ERD)
```
users (1) ───< (N) api_keys
users (1) ───< (N) produk
kategori (1) ───< (N) produk
```

> File SQL siap pakai tersedia di `backend/01_schema.sql` (struktur tabel) dan `backend/02_seed_data.sql` (10 kategori + 50 produk).

---

## Daftar Endpoint API

### Auth
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/auth/register` | - | Registrasi user baru |
| POST | `/auth/login` | - | Login, response berisi JWT |

### API Key Management
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/api-keys` | JWT | Generate API Key baru |
| GET | `/api-keys` | JWT | List semua API Key milik user |
| DELETE | `/api-keys/:id` | JWT | Revoke/hapus API Key |

### Kategori
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/api/v1/kategori` | API Key | List semua kategori |
| GET | `/api/v1/kategori/:id` | API Key | Detail kategori |
| POST | `/api/v1/kategori` | API Key | Tambah kategori |
| PUT | `/api/v1/kategori/:id` | API Key | Update kategori |
| DELETE | `/api/v1/kategori/:id` | API Key | Hapus kategori |

### Produk
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/api/v1/produk` | API Key | List semua produk (query: `?kategori_id=` `?status=` `?page=` `?limit=`) |
| GET | `/api/v1/produk/:id` | API Key | Detail produk |
| POST | `/api/v1/produk` | API Key | Tambah produk baru |
| PUT | `/api/v1/produk/:id` | API Key | Update produk |
| DELETE | `/api/v1/produk/:id` | API Key | Hapus produk |

---

## Instalasi & Menjalankan Project

### Prasyarat
- Node.js (v18+ direkomendasikan)
- PostgreSQL (lokal) atau akses ke instance Supabase
- npm

### 1. Clone Repository
```bash
git clone https://github.com/rrassya19-bit/FinalProject_157_Commerce-API.git
cd FinalProject_157_Commerce-API
```

### 2. Menjalankan Backend
```bash
cd backend
npm install
cp .env.example .env   # lalu sesuaikan isinya
npm run dev             # atau: npm start
```
Backend berjalan di `http://localhost:3000`

### 3. Menjalankan Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend berjalan di `http://localhost:5173`

---

## Environment Variables

### Backend (`backend/.env`)
```env
# Database Connection (Development & Local PostgreSQL)
DB_USER=postgres
DB_PASS=postgres
DB_DATABASE=commerceapi
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DIALECT=postgres

# Database Connection (Production Supabase PostgreSQL)
POSTGRES_URL=postgresql://<user>:<password>@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# JWT Security
JWT_SECRET=<ganti-dengan-secret-anda>
JWT_EXPIRES=1d

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:3000
```

> ⚠️ Jangan commit file `.env` yang berisi kredensial asli. Gunakan `.env.example` sebagai template.

---

## Alur Middleware & Autentikasi

### `authMiddleware.js` (JWT)
- Membaca header `Authorization: Bearer <token>`
- Memverifikasi token menggunakan `JWT_SECRET`
- Jika valid, request diteruskan ke controller
- Dipakai pada route: `auth`, `api-keys`

### `apiKeyMiddleware.js` (API Key)
- Membaca header `x-api-key`
- Mengecek keberadaan key di tabel `api_keys` dan status `is_active = true`
- Jika valid: `last_used_at` diperbarui, request diteruskan ke controller
- Jika tidak valid/tidak ada: mengembalikan `401 Unauthorized`
- Dipakai pada semua route: `produk`, `kategori`

---

## Dokumentasi Tambahan

- **`PERANCANGAN.md`** — Dokumen perancangan lengkap sistem (skema database, tech stack, alur endpoint)
- **`docs/DIAGRAM.md`** & folder **`docs/DIAGRAM/`** — ERD, Use Case Diagram, Activity Diagram, Class Diagram, Deployment Diagram
- **`docs/Dokumentasi_Postman/`** — Koleksi Postman untuk testing seluruh endpoint
- Halaman **API Docs** & **API Playground** tersedia langsung di dashboard frontend untuk uji coba endpoint secara interaktif tanpa aplikasi eksternal

---

## Lisensi

Project ini dibuat untuk keperluan **Tugas Akhir Semester Antara** — Mata Kuliah Pengembangan Web Servis.