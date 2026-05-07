'use client';

import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'candidate' | 'hr' | 'admin';
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Basic route protection mock
    const token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      router.push('/login');
    } else if (userRole && userRole !== role) {
      // If user tries to access a layout meant for another role
      router.push(`/${userRole}`);
    } else {
      setIsLoading(false);
    }
  }, [router, role]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#3525cd] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9ff]">
      <Sidebar role={role} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800 capitalize tracking-tight">
              {role} Portal
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Notifications */}
            <button className="relative text-gray-400 hover:text-[#3525cd] transition-colors p-2 rounded-full hover:bg-gray-50">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>

            {/* Profile Dropdown (Mock) */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#3525cd] transition-colors">Test User</p>
                <p className="text-xs text-gray-500 capitalize">{role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3525cd] to-indigo-400 text-white flex items-center justify-center font-bold shadow-md ring-2 ring-white">
                TU
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600">expand_more</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
