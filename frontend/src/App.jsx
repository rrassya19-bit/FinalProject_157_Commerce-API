import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Shared Components
import ProtectedRoute from './components/shared/ProtectedRoute';
import IntroSplash from './components/shared/IntroSplash';

// Pages
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ApiKeysPage from './pages/ApiKeysPage';
import ProdukPage from './pages/ProdukPage';
import KategoriPage from './pages/KategoriPage';
import ProfilePage from './pages/ProfilePage';
import DocsPage from './pages/DocsPage';
import PlaygroundPage from './pages/PlaygroundPage';
import NotFoundPage from './pages/NotFoundPage';

// Animated Page Wrapper for smooth page transitions
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <>
      <IntroSplash />
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'shadow-lg border border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-[#111622] text-[#1A202C] dark:text-slate-100 text-xs',
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#F43F5E',
              secondary: '#FFFFFF',
            },
          },
        }}
      />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
            <Route path="/docs" element={<PageWrapper><DocsPage /></PageWrapper>} />
            <Route path="/docs/playground" element={<PageWrapper><PlaygroundPage /></PageWrapper>} />
          </Route>

          {/* Protected Routes (Dashboard) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<PageWrapper><DashboardPage /></PageWrapper>} />
              <Route path="/dashboard/api-keys" element={<PageWrapper><ApiKeysPage /></PageWrapper>} />
              <Route path="/dashboard/produk" element={<PageWrapper><ProdukPage /></PageWrapper>} />
              <Route path="/dashboard/kategori" element={<PageWrapper><KategoriPage /></PageWrapper>} />
              <Route path="/dashboard/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
            </Route>
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
