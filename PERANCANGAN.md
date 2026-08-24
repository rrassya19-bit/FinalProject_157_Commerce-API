# PERANCANGAN PROJECT: CommerceAPI

## 1. Ringkasan Project

**Nama Project:** CommerceAPI
**Repo:** `FinalProject_157_Commerce-API`
**Konsep:** SaaS API Gateway untuk data produk e-commerce — analog dengan cara kerja **OpenRouter**, tapi alih-alih menyediakan akses ke banyak model AI lewat satu API key, project ini menyediakan akses **CRUD data produk** lewat satu API key.

**Alur besar:**
1. User mendaftar akun (register) dan login → mendapat **JWT**
2. Dengan JWT tersebut, user men-generate **API key**
3. API key dipakai untuk mengakses endpoint data (`produk`, `kategori`) — bisa **Create, Read, Update, Delete**
4. Endpoint ini bisa dipanggil dari aplikasi lain (Postman, mobile app, web lain, dsb) selama menyertakan API key yang valid

**Perbedaan peran JWT vs API key (penting, jangan tertukar):**
| | JWT | API Key |
|---|---|---|
| Didapat dari | Login (`/auth/login`) | Generate setelah login (`/api-keys`) |
| Dipakai untuk | Akses endpoint manajemen akun & generate/kelola API key | Akses endpoint data (`produk`, `kategori`) |
| Dikirim lewat | Header `Authorization: Bearer <token>` | Header `x-api-key: <key>` |
| Analogi | Login ke dashboard OpenRouter | API key yang dipakai untuk call model di OpenRouter |

---

## 2. Tech Stack

### Backend:
- **Backend Framework:** Express.js
- **Database:** PostgreSQL (Supabase, region Singapore)
- **ORM:** Sequelize
- **Auth:** JWT (jsonwebtoken) untuk login, bcrypt untuk hash password
- **API Key:** random string generator (cryptographic hash), disimpan di tabel `api_keys`
- **Deployment:** Vercel (Serverless Node.js Function)
- **Testing:** Postman

### Frontend:
- **Build Tool:** Vite
- **UI Library:** React (JS)
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion (page transitions, scroll reveal, interactive micro-interactions, canvas network mesh)
- **HTTP Client:** Axios (interceptor untuk JWT dan `x-api-key`)
- **Internationalization (i18n):** i18next & react-i18next (Multi-bahasa ID/EN)
- **Theming:** Dark / Light Mode Toggle dengan Tailwind class `.dark` & LocalStorage persistence
- **Icons & Notification:** Lucide React & React Hot Toast

---

## 3. Skema Database (dasar untuk ERD)

### Tabel 1: `users`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | SERIAL PK | |
| name | VARCHAR(100) | |
| email | VARCHAR(150) UNIQUE | |
| password | VARCHAR(255) | di-hash bcrypt |
| role | VARCHAR(20) | default `seller` |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### Tabel 2: `api_keys`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | SERIAL PK | |
| user_id | INTEGER FK → users.id | ON DELETE CASCADE |
| api_key | VARCHAR(255) UNIQUE | |
| label | VARCHAR(100) | nama bebas dari user |
| is_active | BOOLEAN | default true |
| last_used_at | TIMESTAMP | diupdate tiap kali key dipakai |
| created_at | TIMESTAMP | |

### Tabel 3: `kategori`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | SERIAL PK | |
| nama | VARCHAR(100) | |
| deskripsi | TEXT | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### Tabel 4: `produk`
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
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### Relasi (ERD)
```
users (1) ───< (N) api_keys
users (1) ───< (N) produk
kategori (1) ───< (N) produk
```

> File SQL siap pakai: `01_schema.sql` (struktur tabel) dan `02_seed_data.sql` (10 kategori + 50 produk).

---

## 4. Struktur Folder Project

Struktur repository `FinalProject_157_Commerce-API` memisahkan sisi backend dan frontend secara mandiri (monorepo terstruktur):

```
FinalProject_157_Commerce-API/
├── backend/
│   ├── config/
│   │   ├── config.js
│   ├── controller/
│   │   ├── apiKeyController.js
│   │   ├── authController.js
│   │   ├── kategoriController.js
│   │   └── produkController.js
│   ├── middleware/
│   │   ├── apiKeyMiddleware.js
│   │   └── authMiddleware.js
│   ├── migrations/
│   ├── models/
│   │   ├── apiKey.js
│   │   ├── index.js
│   │   ├── kategori.js
│   │   ├── produk.js
│   │   └── user.js
│   ├── routes/
│   │   ├── apiKeys.js
│   │   ├── auth.js
│   │   ├── kategori.js
│   │   └── produk.js
│   ├── seeders/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── 01_schema.sql
│   ├── 02_seed_data.sql
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── vercel.json
│
├── docs/
│   ├── DIAGRAM/
│   │   ├── Screenshots_DIAGRAM/
│   │   ├── Activity_CRUD_Produk.mmd
│   │   ├── Activity_Register_Login.mmd
│   │   ├── Class_Diagram.mmd
│   │   ├── Deployment_Diagram.mmd
│   │   ├── ERD.mmd
│   │   └── UseCase.mmd
│   ├── Dokumentasi_Postman/
│   └── DIAGRAM.md
│
├── frontend/
│   ├── dist/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── api/
│   │   │   ├── apiKeyApi.js
│   │   │   ├── authApi.js
│   │   │   ├── axiosInstance.js
│   │   │   ├── kategoriApi.js
│   │   │   └── produkApi.js
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── PublicFooter.jsx
│   │   │   │   ├── PublicNavbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Topbar.jsx
│   │   │   ├── shared/
│   │   │   │   ├── AnimatedBackground.jsx
│   │   │   │   ├── IntroSplash.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── ui/
│   │   │       ├── Badge.jsx
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── ConfirmModal.jsx
│   │   │       ├── IconContainer.jsx
│   │   │       ├── LanguageToggle.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Skeleton.jsx
│   │   │       └── ThemeToggle.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── i18n/
│   │   │   ├── locales/
│   │   │   │   ├── en.json
│   │   │   │   └── id.json
│   │   │   └── index.js
│   │   ├── layouts/
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── PublicLayout.jsx
│   │   ├── pages/
│   │   │   ├── ApiKeysPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── DocsPage.jsx
│   │   │   ├── KategoriPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── PlaygroundPage.jsx
│   │   │   ├── ProdukPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vercel.json
│   └── vite.config.js
│
├── PERANCANGAN.md
└── README.md
```

---

## 4.1 Tech Stack Frontend

Frontend **CommerceAPI Dashboard** dibangun dengan stack modern yang dirancang untuk pengalaman pengguna (UX) level SaaS komersial:
- **React + Vite:** Single Page Application (SPA) cepat dan efisien.
- **React Router v7:** Navigasi antar halaman instan tanpa reload browser, dilengkapi route guard (`ProtectedRoute`).
- **Tailwind CSS v4:** Styling modern dengan sistem desain terpadu, layout responsif, dan palet warna kontras yang ramah mata.
- **Dark / Light Mode:** Mendukung switch tema gelap dan terang secara global dengan penyimpanan preferensi di `localStorage`.
- **Framer Motion:** Animasi transisi halaman (`AnimatePresence`), scroll reveal (`whileInView`), interaksi hover tombol & kartu, serta background canvas animasi *network data points*.
- **Axios Interceptors:** Otomatis melampirkan header `Authorization: Bearer <JWT>` untuk rute akun/kunci dan `x-api-key` untuk rute katalog.
- **i18next (Multi-Bahasa ID/EN):** Dukungan penuh pergantian bahasa Bahasa Indonesia $\leftrightarrow$ English di seluruh UI.

> *Detail panduan blueprint dan arsitektur frontend lengkap dapat dibaca pada file **`FRONTEND.md`**.*

---
    
## 5. Daftar Endpoint API

### A. Auth (pakai JWT setelah login)
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/auth/register` | - | Registrasi user baru |
| POST | `/auth/login` | - | Login, response berisi JWT |

### B. API Key Management (butuh JWT)
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/api-keys` | JWT | Generate API key baru |
| GET | `/api-keys` | JWT | List semua API key milik user |
| DELETE | `/api-keys/:id` | JWT | Revoke/hapus API key |

### C. Kategori (butuh x-api-key) — CRUD
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/api/v1/kategori` | API Key | List semua kategori |
| GET | `/api/v1/kategori/:id` | API Key | Detail kategori |
| POST | `/api/v1/kategori` | API Key | Tambah kategori |
| PUT | `/api/v1/kategori/:id` | API Key | Update kategori |
| DELETE | `/api/v1/kategori/:id` | API Key | Hapus kategori |

### D. Produk (butuh x-api-key) — CRUD, inti dari SaaS ini
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/api/v1/produk` | API Key | List semua produk (support query `?kategori_id=` `?status=` `?page=` `?limit=`) |
| GET | `/api/v1/produk/:id` | API Key | Detail produk |
| POST | `/api/v1/produk` | API Key | Tambah produk baru |
| PUT | `/api/v1/produk/:id` | API Key | Update produk |
| DELETE | `/api/v1/produk/:id` | API Key | Hapus produk |

---

## 6. Alur Middleware 

### `authMiddleware.js` (JWT)
- Baca header `Authorization: Bearer <token>`
- Verifikasi pakai `JWT_SECRET`
- Kalau valid, lanjut ke controller (dipakai di route auth & api-keys)

### `apiKeyMiddleware.js` (API Key)
- Baca header `x-api-key`
- Cek ke tabel `api_keys` apakah key ada, `is_active = true`
- Kalau valid: update `last_used_at`, lanjut ke controller
- Kalau tidak ada/tidak valid: return 401 Unauthorized
- Dipakai di semua route `produk` dan `kategori`

---

## 7. Environment Variables

### A. Backend (`backend/.env`)
```env
# Database Connection (Development & Local PostgreSQL)
DB_USER=postgres
DB_PASS=postgres
DB_DATABASE=commerceapi
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DIALECT=postgres

# Database Connection (Production Supabase PostgreSQL)
POSTGRES_URL=postgresql://postgres.xxxx:yyyy@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# JWT Security
JWT_SECRET=supersecretjwtstringcommerceapi12345!
JWT_EXPIRES=1d

# Server Configuration
PORT=3000
NODE_ENV=development
```

### B. Frontend (`frontend/.env`)
```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:3000
```

---

## 8. Panduan Instalasi & Menjalankan Project

### 1. Menjalankan Backend:
```bash
cd backend
npm run dev    # atau npm start
# Backend berjalan pada http://localhost:3000
```

### 2. Menjalankan Frontend:
```bash
cd frontend
npm run dev
# Frontend berjalan pada http://localhost:5173
```

---

## 9. Kebutuhan Laporan 

Setelah project selesai dan berjalan, susun laporan PDF berisi:
1. **ERD** — berdasarkan skema section 3
2. **Use Case Diagram** — aktor: *User (belum login)*, *Seller (sudah login)*, *Konsumen API (pakai API key)*
3. **Activity Diagram / Userflow** — alur: Register → Login → Generate API Key → Panggil endpoint CRUD produk/kategori pakai API key
4. Deskripsi singkat konsep SaaS dan tech stack yang dipakai
5. Screenshot hasil deploy & hasil testing Postman
