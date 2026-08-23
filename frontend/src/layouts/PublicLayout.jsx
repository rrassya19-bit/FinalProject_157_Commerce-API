import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/layout/PublicNavbar';
import PublicFooter from '../components/layout/PublicFooter';
import AnimatedBackground from '../components/shared/AnimatedBackground';

const PublicLayout = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0B0F17] text-[#2D3748] dark:text-slate-200 transition-colors overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicNavbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <PublicFooter />
      </div>
    </div>
  );
};

export default PublicLayout;
