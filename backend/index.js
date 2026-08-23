require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

const authRoutes = require('./routes/auth');
const apiKeyRoutes = require('./routes/apiKeys');
const kategoriRoutes = require('./routes/kategori');
const produkRoutes = require('./routes/produk');

const app = express();
const PORT = process.env.PORT || 3000;

// Lazy database connection handler for Serverless (Vercel) & Local
let databaseReady = false;
let databasePromise = null;

const ensureDatabaseConnection = async () => {
  if (databaseReady) return;
  if (!databasePromise) {
    databasePromise = db.sequelize.authenticate()
      .then(() => {
        databaseReady = true;
        console.log('Database connected successfully.');
      })
      .catch((err) => {
        databasePromise = null;
        console.error('Database connection error:', err);
        throw err;
      });
  }
  return databasePromise;
};

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true); // fallback allow for dev flexibility, or set origin
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection middleware for every incoming request
app.use(async (req, res, next) => {
  try {
    await ensureDatabaseConnection();
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Koneksi database gagal: ' + error.message,
      data: null
    });
  }
});

// Root Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CommerceAPI Server is running',
    data: {
      version: '1.0.0',
      docs: 'Silakan baca PERANCANGAN.md untuk panduan endpoint'
    }
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/api-keys', apiKeyRoutes);
app.use('/api/v1/kategori', kategoriRoutes);
app.use('/api/v1/produk', produkRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan',
    data: null
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan internal server: ' + err.message,
    data: null
  });
});

// Start server when executed directly (non-serverless)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, async () => {
    try {
      await ensureDatabaseConnection();
      console.log(`Server is running on http://localhost:${PORT}`);
    } catch (err) {
      console.error('Failed to start server:', err);
    }
  });
}

module.exports = app;
