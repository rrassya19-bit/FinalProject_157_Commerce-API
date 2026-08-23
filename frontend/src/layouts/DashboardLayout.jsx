import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import AnimatedBackground from '../components/shared/AnimatedBackground';

const DashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#F8F9FA] dark:bg-[#0B0F17] text-[#2D3748] dark:text-slate-200 transition-colors">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <Topbar onMenuClick={() => setIsMobileOpen(true)} />
          
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
